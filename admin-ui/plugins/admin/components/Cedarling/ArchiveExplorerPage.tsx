import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMatch, useParams } from 'react-router-dom'
import AceEditor from 'react-ace'
import type { Ace } from 'ace-builds'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/mode-xml'
import 'ace-builds/src-noconflict/mode-text'
import 'ace-builds/src-noconflict/theme-xcode'
import 'ace-builds/src-noconflict/theme-monokai'
import SetTitle from 'Utils/SetTitle'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { GluuPageContent } from '@/components'
import { Add, DeleteOutlined } from '@/components/icons'
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { usePermission } from '@/cedarling/hooks/usePermission'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { useGetAdminuiPolicyStore, type AdminUIPolicyStore } from 'JansConfigApi'
import {
  base64ToUint8Array,
  buildArchiveDownloadName,
  isActivePolicyStore,
  toPolicyStoreEntries,
} from '@/utils/policyStore'
import {
  buildArchiveTree,
  editorModeFor,
  entryToText,
  flattenArchiveTree,
  isTextEntry,
  readArchive,
  textToBytes,
  writeArchive,
  type ArchiveEntry,
} from '@/utils/cjarArchive'
import { logger } from '@/utils/logger'
import { useAppDispatch } from '@/redux/hooks'
import { updateToast } from '@/redux/features/toastSlice'
import ArchiveFileTree from './components/ArchiveFileTree'
import PolicyStoreConfirmDialog from './components/PolicyStoreConfirmDialog'
import ArchiveAddFileDialog from './components/ArchiveAddFileDialog'
import { useStyles, PANE_BODY_PADDING } from './styles/ArchiveExplorerPage.style'

const SECURITY_RESOURCE_ID = ADMIN_UI_RESOURCES.Security
const EDITOR_HEIGHT = '100%'
const EDITOR_FONT_SIZE = 16

const EMPTY_LOCATION = { dir: '', name: '' } as const
const ZIP_MIME_TYPE = 'application/zip'
const EDITOR_OPTIONS = {
  useWorker: false,
  showPrintMargin: false,
  hScrollBarAlwaysVisible: false,
} as const
const EDITOR_PROPS = { $blockScrolling: true } as const

const TREE_WIDTH_DEFAULT = 300
const TREE_WIDTH_MIN = 180
const TREE_WIDTH_MAX_RATIO = 0.6
const TREE_WIDTH_STEP = 16

const countArchiveFiles = (entries: ArchiveEntry[] | null) => entries?.length ?? 0

const splitArchivePath = (entry: ArchiveEntry | null) => {
  if (!entry) return EMPTY_LOCATION
  const segments = entry.path.split('/')
  const name = segments.pop() ?? entry.path
  return {
    dir: segments.length ? `${segments.join('/')}/` : '',
    name,
  }
}

const ArchiveExplorerPage: React.FC = () => {
  const { t } = useTranslation()
  const { inum } = useParams<{ inum: string }>()
  const { navigateBack, navigateToRoute } = useAppNavigation()
  const isEditRoute = Boolean(useMatch(ROUTES.ADMIN_POLICIES_EDIT_TEMPLATE))
  SetTitle(t('titles.policy_store_contents'))

  const { canRead: canReadSecurity, canWrite: canWriteSecurity } =
    usePermission(SECURITY_RESOURCE_ID)
  const dispatch = useAppDispatch()

  const { state: themeState } = useTheme()
  const isDark = themeState.theme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const { classes } = useStyles({ isDark, themeColors })

  const [entries, setEntries] = useState<ArchiveEntry[] | null>(null)
  const loadedInumRef = useRef<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [edits, setEdits] = useState<Record<string, string>>({})
  const [addedPaths, setAddedPaths] = useState<string[]>([])
  const [removedPaths, setRemovedPaths] = useState<string[]>([])
  const [showAddFile, setShowAddFile] = useState(false)
  const [treeWidth, setTreeWidth] = useState(TREE_WIDTH_DEFAULT)
  const splitPaneRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<Ace.Editor | null>(null)
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false)

  const { data, isLoading } = useGetAdminuiPolicyStore(
    { fieldValuePair: inum ? `inum=${inum}` : undefined },
    { query: { enabled: canReadSecurity && Boolean(inum) } },
  )

  const store: AdminUIPolicyStore | undefined = useMemo(
    () => toPolicyStoreEntries(data).find((entry) => entry.inum === inum),
    [data, inum],
  )

  useEffect(() => {
    const archive = store?.policyStore
    const storeInum = store?.inum
    if (!storeInum || storeInum === loadedInumRef.current || !archive) {
      return
    }
    let isMounted = true
    loadedInumRef.current = storeInum
    Promise.resolve()
      .then(() => readArchive(base64ToUint8Array(archive)))
      .then((unpacked) => {
        if (!isMounted) return
        setEntries(unpacked)
        setLoadError(null)
        setSelectedPath(unpacked[0]?.path ?? null)
        setEdits({})
        setAddedPaths([])
        setRemovedPaths([])
      })
      .catch((error) => {
        logger.error(
          'Failed to read policy store archive:',
          error instanceof Error ? error : String(error),
        )
        if (!isMounted) return
        setEntries([])
        setLoadError(t('documentation.policyStore.archiveUnreadable'))
      })
    return () => {
      isMounted = false
    }
  }, [store, t])

  const workingEntries = useMemo(() => {
    if (!entries) return null
    const kept = entries.filter((entry) => !removedPaths.includes(entry.path))
    const added = addedPaths.map((path) => ({ path, bytes: textToBytes(edits[path] ?? '') }))
    return [...kept, ...added]
  }, [entries, removedPaths, addedPaths, edits])

  const tree = useMemo(() => buildArchiveTree(workingEntries ?? []), [workingEntries])

  const selectedEntry = useMemo(
    () => workingEntries?.find((entry) => entry.path === selectedPath) ?? null,
    [workingEntries, selectedPath],
  )

  const selectedIsText = useMemo(
    () => (selectedEntry ? isTextEntry(selectedEntry.path) : false),
    [selectedEntry],
  )
  const selectedOriginalText = useMemo(
    () => (selectedEntry && selectedIsText ? entryToText(selectedEntry) : ''),
    [selectedEntry, selectedIsText],
  )

  const selectedText =
    selectedEntry && selectedPath && selectedPath in edits
      ? edits[selectedPath]
      : selectedOriginalText

  const isActive = useMemo(() => (store ? isActivePolicyStore(store) : false), [store])
  const canEdit = isEditRoute && canWriteSecurity && !isActive && !loadError
  const showEditAction = !isEditRoute && canWriteSecurity && !isActive && !loadError
  const hasEdits = Object.keys(edits).length > 0 || addedPaths.length > 0 || removedPaths.length > 0

  const handleEditorChange = useCallback(
    (value: string) => {
      if (!selectedPath) return
      setEdits((previous) => {
        if (value === selectedOriginalText) {
          if (!(selectedPath in previous)) return previous
          const rest = { ...previous }
          delete rest[selectedPath]
          return rest
        }
        return { ...previous, [selectedPath]: value }
      })
    },
    [selectedPath, selectedOriginalText],
  )

  const handleDownload = useCallback(async () => {
    if (!workingEntries) return
    try {
      const merged = workingEntries.map((entry) =>
        entry.path in edits ? { ...entry, bytes: textToBytes(edits[entry.path]) } : entry,
      )
      const bytes = await writeArchive(merged)
      const url = URL.createObjectURL(new Blob([bytes], { type: ZIP_MIME_TYPE }))
      const link = document.createElement('a')
      link.href = url
      link.download = buildArchiveDownloadName(store?.displayname, inum, new Date())
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      setEdits({})
      setAddedPaths([])
      setRemovedPaths([])
    } catch (error) {
      logger.error(
        'Failed to download policy store archive:',
        error instanceof Error ? error : String(error),
      )
      dispatch(updateToast(true, 'error', t('documentation.policyStore.downloadFailed')))
    }
  }, [workingEntries, edits, store, inum, dispatch, t])

  const fileCount = useMemo(() => countArchiveFiles(workingEntries), [workingEntries])

  const existingPaths = useMemo(
    () => (workingEntries ?? []).map((entry) => entry.path),
    [workingEntries],
  )

  const selectedLocation = useMemo(() => splitArchivePath(selectedEntry), [selectedEntry])

  const handleSelect = useCallback((path: string) => {
    setSelectedPath(path)
  }, [])

  const handleEditorLoad = useCallback((editor: Ace.Editor) => {
    editorRef.current = editor
    editor.renderer.setScrollMargin(PANE_BODY_PADDING, PANE_BODY_PADDING, 0, 0)
  }, [])

  const clampTreeWidth = useCallback((width: number) => {
    const available = splitPaneRef.current?.clientWidth ?? 0
    const max = available > 0 ? available * TREE_WIDTH_MAX_RATIO : Number.POSITIVE_INFINITY
    return Math.round(Math.min(Math.max(width, TREE_WIDTH_MIN), max))
  }, [])

  const handleSplitterPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault()
      const pane = splitPaneRef.current
      if (!pane) return
      const paneLeft = pane.getBoundingClientRect().left
      const handle = event.currentTarget
      handle.setPointerCapture(event.pointerId)

      const onMove = (moveEvent: PointerEvent) => {
        setTreeWidth(clampTreeWidth(moveEvent.clientX - paneLeft))
      }
      const onUp = () => {
        handle.releasePointerCapture(event.pointerId)
        handle.removeEventListener('pointermove', onMove)
        handle.removeEventListener('pointerup', onUp)
        handle.removeEventListener('pointercancel', onUp)
      }

      handle.addEventListener('pointermove', onMove)
      handle.addEventListener('pointerup', onUp)
      handle.addEventListener('pointercancel', onUp)
    },
    [clampTreeWidth],
  )

  const handleSplitterKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      event.preventDefault()
      const delta = event.key === 'ArrowLeft' ? -TREE_WIDTH_STEP : TREE_WIDTH_STEP
      setTreeWidth((previous) => clampTreeWidth(previous + delta))
    },
    [clampTreeWidth],
  )

  useEffect(() => {
    editorRef.current?.resize()
  }, [treeWidth])

  const treePaneStyle = useMemo(() => ({ width: treeWidth, minWidth: treeWidth }), [treeWidth])

  const goBack = useCallback(() => navigateBack(ROUTES.ADMIN_POLICIES_LIST), [navigateBack])

  const handleBack = useCallback(() => {
    if (hasEdits) {
      setShowDiscardConfirm(true)
      return
    }
    goBack()
  }, [hasEdits, goBack])

  const handleResetEdits = useCallback(() => {
    setEdits({})
    setAddedPaths([])
    setRemovedPaths([])
  }, [])

  const handleAddFileOpen = useCallback(() => setShowAddFile(true), [])

  const handleAddFileClose = useCallback(() => setShowAddFile(false), [])

  const handleAddFile = useCallback(
    (path: string) => {
      setShowAddFile(false)
      setRemovedPaths((previous) => previous.filter((removed) => removed !== path))
      setAddedPaths((previous) => (previous.includes(path) ? previous : [...previous, path]))
      setEdits((previous) => ({ ...previous, [path]: '' }))
      setSelectedPath(path)
      dispatch(updateToast(true, 'success', t('documentation.policyStore.fileSaved')))
    },
    [dispatch, t],
  )

  const handleDeleteFile = useCallback(() => {
    if (!selectedPath) return
    const path = selectedPath
    setAddedPaths((previous) => previous.filter((added) => added !== path))
    setEdits((previous) => {
      if (!(path in previous)) return previous
      const rest = { ...previous }
      delete rest[path]
      return rest
    })
    setRemovedPaths((previous) =>
      entries?.some((entry) => entry.path === path) && !previous.includes(path)
        ? [...previous, path]
        : previous,
    )
    const ordered = flattenArchiveTree(tree)
    const index = ordered.indexOf(path)
    setSelectedPath(ordered[index - 1] ?? ordered[index + 1] ?? null)
    dispatch(updateToast(true, 'success', t('documentation.policyStore.fileDeleted')))
  }, [selectedPath, entries, tree, dispatch, t])

  const handleDiscardConfirm = useCallback(() => {
    setShowDiscardConfirm(false)
    setEdits({})
    setAddedPaths([])
    setRemovedPaths([])
    goBack()
  }, [goBack])

  const handleDiscardCancel = useCallback(() => setShowDiscardConfirm(false), [])

  const handleEdit = useCallback(() => {
    if (!inum) return
    navigateToRoute(ROUTES.ADMIN_POLICIES_EDIT(inum))
  }, [inum, navigateToRoute])

  return (
    <GluuLoader blocking={isLoading}>
      <GluuViewWrapper canShow={canReadSecurity}>
        <GluuPageContent>
          <div className={classes.mobileContentPad}>
            <GluuText variant="h1" className={classes.mobilePageTitle} disableThemeColor>
              {t('titles.policy_store_contents')}
            </GluuText>

            <GluuText variant="span" disableThemeColor className={classes.storeName}>
              {store?.displayname || inum}
            </GluuText>

            <div className={classes.splitPane} ref={splitPaneRef}>
              <div className={classes.treePane} style={treePaneStyle}>
                <div className={classes.paneHeader}>
                  <GluuText variant="span" disableThemeColor className={classes.paneTitle}>
                    {t('fields.files')}
                  </GluuText>
                  <div className={classes.paneActions}>
                    <GluuText variant="span" disableThemeColor className={classes.paneCount}>
                      {fileCount}
                    </GluuText>
                    {canEdit && (
                      <button
                        type="button"
                        className={classes.paneAction}
                        onClick={handleAddFileOpen}
                        title={t('actions.add_file')}
                        aria-label={t('actions.add_file')}
                      >
                        <Add className={classes.paneActionIcon} aria-hidden />
                      </button>
                    )}
                  </div>
                </div>
                <div className={classes.treeScroll}>
                  {loadError ? (
                    <GluuText variant="span" disableThemeColor className={classes.binaryNotice}>
                      {loadError}
                    </GluuText>
                  ) : (
                    <ArchiveFileTree
                      nodes={tree}
                      selectedPath={selectedPath}
                      onSelect={handleSelect}
                      classes={classes}
                    />
                  )}
                </div>
              </div>

              <div
                className={classes.splitter}
                onPointerDown={handleSplitterPointerDown}
                onKeyDown={handleSplitterKeyDown}
                role="separator"
                tabIndex={0}
                aria-orientation="vertical"
                aria-label={t('documentation.policyStore.resizeFileList')}
                aria-valuenow={treeWidth}
                aria-valuemin={TREE_WIDTH_MIN}
              >
                <span className={classes.splitterGrip} aria-hidden />
              </div>

              <div className={classes.viewerPane}>
                {selectedEntry ? (
                  <>
                    <div className={classes.viewerHeader}>
                      <div className={classes.viewerPath}>
                        {selectedLocation.dir && (
                          <GluuText variant="span" disableThemeColor className={classes.viewerDir}>
                            {selectedLocation.dir}
                          </GluuText>
                        )}
                        <GluuText variant="span" disableThemeColor className={classes.viewerFile}>
                          {selectedLocation.name}
                        </GluuText>
                        {hasEdits && (
                          <GluuText
                            variant="span"
                            disableThemeColor
                            className={classes.viewerUnsavedNote}
                          >
                            {t('documentation.policyStore.unsavedChangesNote')}
                          </GluuText>
                        )}
                      </div>
                      {canEdit && (
                        <div className={classes.paneActions}>
                          <button
                            type="button"
                            className={classes.paneAction}
                            onClick={handleDeleteFile}
                            title={t('actions.delete')}
                            aria-label={t('actions.delete')}
                          >
                            <DeleteOutlined className={classes.paneActionIcon} aria-hidden />
                          </button>
                        </div>
                      )}
                      {isActive && (
                        <GluuText variant="span" disableThemeColor className={classes.viewerNotice}>
                          {t('documentation.policyStore.activeStoreReadOnly')}
                        </GluuText>
                      )}
                    </div>
                    {selectedIsText ? (
                      <div className={classes.viewerBody}>
                        <AceEditor
                          mode={editorModeFor(selectedEntry.path)}
                          theme={isDark ? 'monokai' : 'xcode'}
                          value={selectedText}
                          readOnly={!canEdit}
                          onChange={handleEditorChange}
                          name={`archive-editor-${selectedEntry.path}`}
                          width="100%"
                          height={EDITOR_HEIGHT}
                          fontSize={EDITOR_FONT_SIZE}
                          wrapEnabled
                          onLoad={handleEditorLoad}
                          editorProps={EDITOR_PROPS}
                          setOptions={EDITOR_OPTIONS}
                        />
                      </div>
                    ) : (
                      <GluuText variant="p" disableThemeColor className={classes.binaryNotice}>
                        {t('documentation.policyStore.binaryFileNotice')}
                      </GluuText>
                    )}
                  </>
                ) : (
                  <div className={classes.emptyViewer}>
                    <GluuText variant="span" disableThemeColor>
                      {t('documentation.policyStore.selectFileToView')}
                    </GluuText>
                  </div>
                )}
              </div>
            </div>

            <GluuThemeFormFooter
              className={classes.footer}
              showBack
              onBack={handleBack}
              showCancel={isEditRoute}
              onCancel={handleResetEdits}
              disableCancel={!hasEdits}
              showApply={isEditRoute || showEditAction}
              applyButtonType="button"
              applyButtonLabel={isEditRoute ? t('actions.download') : t('actions.edit')}
              onApply={isEditRoute ? handleDownload : handleEdit}
              disableApply={isEditRoute ? !hasEdits : !entries?.length}
            />
          </div>
        </GluuPageContent>
      </GluuViewWrapper>
      <ArchiveAddFileDialog
        open={showAddFile}
        existingPaths={existingPaths}
        onAdd={handleAddFile}
        onClose={handleAddFileClose}
      />

      <PolicyStoreConfirmDialog
        open={showDiscardConfirm}
        title={t('documentation.policyStore.discardChangesTitle')}
        message={t('documentation.policyStore.discardChangesWarning')}
        onConfirm={handleDiscardConfirm}
        onClose={handleDiscardCancel}
      />
    </GluuLoader>
  )
}

export default React.memo(ArchiveExplorerPage)
