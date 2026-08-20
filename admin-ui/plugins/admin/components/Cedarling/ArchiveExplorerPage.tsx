import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/mode-xml'
import 'ace-builds/src-noconflict/mode-text'
import 'ace-builds/src-noconflict/theme-xcode'
import 'ace-builds/src-noconflict/theme-monokai'
import SetTitle from 'Utils/SetTitle'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { GluuPageContent, GluuButton } from '@/components'
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import { Check, Close, DeleteOutlined, Edit, InfoOutlined } from '@/components/icons'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { usePermission } from '@/cedarling/hooks/usePermission'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { useAppDispatch } from '@/redux/hooks'
import { updateToast } from '@/redux/features/toastSlice'
import { useGetAdminuiPolicyStore, type AdminUIPolicyStore } from 'JansConfigApi'
import { base64ToUint8Array, toPolicyStoreEntries } from '@/utils/policyStore'
import {
  buildArchiveTree,
  editorModeFor,
  entryToText,
  isTextEntry,
  normalizeArchivePath,
  readArchive,
  textToBytes,
  writeArchive,
  type ArchiveEntry,
} from '@/utils/cjarArchive'
import { logger } from '@/utils/logger'
import ArchiveFileTree from './components/ArchiveFileTree'
import { useStyles } from './styles/ArchiveExplorerPage.style'

const SECURITY_RESOURCE_ID = ADMIN_UI_RESOURCES.Security
const ZIP_MIME_TYPE = 'application/zip'
const EDITOR_HEIGHT = '460px'

const ArchiveExplorerPage: React.FC = () => {
  const { t } = useTranslation()
  const { inum } = useParams<{ inum: string }>()
  const { navigateBack } = useAppNavigation()
  const dispatch = useAppDispatch()
  SetTitle(t('titles.archive_explorer'))

  const { canRead: canReadSecurity, canWrite: canWriteSecurity } =
    usePermission(SECURITY_RESOURCE_ID)

  const { state: themeState } = useTheme()
  const isDark = themeState.theme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const { classes } = useStyles({ isDark, themeColors })

  // Entries live in component state: every edit is in-memory until the archive is downloaded and
  // re-uploaded, which is what the ticket specifies.
  const [entries, setEntries] = useState<ArchiveEntry[] | null>(null)
  // A ref, not state: marking a store as loaded must not re-run the effect below, whose cleanup
  // would then cancel the in-flight unpack before it could store its result.
  const loadedInumRef = useRef<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [dirtyPaths, setDirtyPaths] = useState<Set<string>>(new Set())
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [newPath, setNewPath] = useState('')

  const { data, isLoading } = useGetAdminuiPolicyStore(
    { limit: 1, fieldValuePair: inum ? `inum=${inum}` : undefined },
    { query: { enabled: canReadSecurity && Boolean(inum), staleTime: 0 } },
  )

  const store: AdminUIPolicyStore | undefined = useMemo(() => {
    const list = toPolicyStoreEntries(data)
    // The filter may be ignored by the backend, so match on inum client-side rather than trusting
    // that a single-entry response is the store that was asked for.
    return list.find((entry) => entry.inum === inum) ?? (list.length === 1 ? list[0] : undefined)
  }, [data, inum])

  // Unpack once per store. Guarded by loadedInum so in-memory edits are not discarded by a refetch.
  useEffect(() => {
    const archive = store?.policyStore
    const storeInum = store?.inum
    if (!storeInum || storeInum === loadedInumRef.current || !archive) {
      return
    }
    let isMounted = true
    loadedInumRef.current = storeInum
    readArchive(base64ToUint8Array(archive))
      .then((unpacked) => {
        if (!isMounted) return
        setEntries(unpacked)
        setLoadError(null)
        setSelectedPath(unpacked[0]?.path ?? null)
        setDirtyPaths(new Set())
      })
      .catch((error: Error) => {
        logger.error('Failed to read policy store archive:', error)
        if (!isMounted) return
        setEntries([])
        setLoadError(t('documentation.policyStore.archiveUnreadable'))
      })
    return () => {
      isMounted = false
    }
  }, [store, t])

  const tree = useMemo(() => buildArchiveTree(entries ?? []), [entries])

  const selectedEntry = useMemo(
    () => entries?.find((entry) => entry.path === selectedPath) ?? null,
    [entries, selectedPath],
  )

  const selectedIsText = selectedEntry ? isTextEntry(selectedEntry.path) : false
  const selectedText = useMemo(
    () => (selectedEntry && selectedIsText ? entryToText(selectedEntry) : ''),
    [selectedEntry, selectedIsText],
  )

  const handleSelect = useCallback((path: string) => {
    setSelectedPath(path)
    setIsEditing(false)
    setDraft('')
  }, [])

  const handleStartEdit = useCallback(() => {
    setDraft(selectedText)
    setIsEditing(true)
  }, [selectedText])

  const handleDiscard = useCallback(() => {
    setIsEditing(false)
    setDraft('')
  }, [])

  const handleSave = useCallback(() => {
    if (!selectedEntry) return
    setEntries((previous) =>
      (previous ?? []).map((entry) =>
        entry.path === selectedEntry.path ? { ...entry, bytes: textToBytes(draft) } : entry,
      ),
    )
    setDirtyPaths((previous) => new Set(previous).add(selectedEntry.path))
    setIsEditing(false)
    dispatch(updateToast(true, 'success', t('documentation.policyStore.fileSaved')))
  }, [selectedEntry, draft, dispatch, t])

  const handleAddFile = useCallback(() => {
    const path = normalizeArchivePath(newPath)
    if (!path) {
      dispatch(updateToast(true, 'error', t('documentation.policyStore.filePathRequired')))
      return
    }
    if ((entries ?? []).some((entry) => entry.path === path)) {
      dispatch(updateToast(true, 'error', t('documentation.policyStore.fileAlreadyExists')))
      return
    }
    setEntries((previous) =>
      [...(previous ?? []), { path, bytes: textToBytes('') }].sort((a, b) =>
        a.path.localeCompare(b.path),
      ),
    )
    setDirtyPaths((previous) => new Set(previous).add(path))
    setSelectedPath(path)
    setNewPath('')
    setIsAdding(false)
    setIsEditing(true)
    setDraft('')
  }, [newPath, entries, dispatch, t])

  const handleDeleteFile = useCallback(() => {
    if (!selectedEntry) return
    const remaining = (entries ?? []).filter((entry) => entry.path !== selectedEntry.path)
    setEntries(remaining)
    setDirtyPaths((previous) => {
      const next = new Set(previous)
      next.delete(selectedEntry.path)
      return next
    })
    setSelectedPath(remaining[0]?.path ?? null)
    setIsEditing(false)
    dispatch(updateToast(true, 'success', t('documentation.policyStore.fileDeleted')))
  }, [selectedEntry, entries, dispatch, t])

  const handleDownload = useCallback(async () => {
    try {
      const packed = await writeArchive(entries ?? [])
      const blob = new Blob([packed], { type: ZIP_MIME_TYPE })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = store?.displayname || `${inum}.cjar`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      logger.error('Failed to pack archive:', error instanceof Error ? error : String(error))
      dispatch(updateToast(true, 'error', t('documentation.policyStore.downloadFailed')))
    }
  }, [entries, store, inum, dispatch, t])

  const handleToggleAdd = useCallback(() => setIsAdding((previous) => !previous), [])

  const handleCancelAdd = useCallback(() => {
    setIsAdding(false)
    setNewPath('')
  }, [])

  const handleNewPathChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => setNewPath(event.target.value),
    [],
  )

  const handleBack = useCallback(() => navigateBack(ROUTES.ADMIN_POLICY_STORES), [navigateBack])

  const hasUnsavedChanges = dirtyPaths.size > 0

  return (
    <GluuLoader blocking={isLoading}>
      <GluuViewWrapper canShow={canReadSecurity}>
        <GluuPageContent>
          <div className={classes.mobileContentPad}>
            <GluuText variant="h1" className={classes.mobilePageTitle} disableThemeColor>
              {t('titles.archive_explorer')}
            </GluuText>

            <GluuText variant="span" disableThemeColor className={classes.storeName}>
              {store?.displayname || inum}
            </GluuText>

            {hasUnsavedChanges && (
              <div className={`${classes.infoAlert} ${classes.infoAlertTopAligned}`}>
                <InfoOutlined className={classes.infoIcon} />
                <GluuText variant="span" className={classes.infoText} disableThemeColor>
                  {t('documentation.policyStore.unsavedChangesNote')}
                </GluuText>
              </div>
            )}

            {isAdding && canWriteSecurity && (
              <div className={classes.addFileRow}>
                <input
                  className={classes.addFileInput}
                  value={newPath}
                  onChange={handleNewPathChange}
                  placeholder={t('placeholders.archive_file_path')}
                  aria-label={t('placeholders.archive_file_path')}
                />
                <GluuButton onClick={handleAddFile} padding="8px 20px">
                  {t('actions.create')}
                </GluuButton>
                <GluuButton onClick={handleCancelAdd} padding="8px 20px">
                  {t('actions.cancel')}
                </GluuButton>
              </div>
            )}

            <div className={classes.splitPane}>
              <div className={classes.treePane}>
                {loadError ? (
                  <GluuText variant="span" disableThemeColor className={classes.binaryNotice}>
                    {loadError}
                  </GluuText>
                ) : (
                  <ArchiveFileTree
                    nodes={tree}
                    selectedPath={selectedPath}
                    dirtyPaths={dirtyPaths}
                    onSelect={handleSelect}
                    classes={classes}
                  />
                )}
              </div>

              <div className={classes.viewerPane}>
                {selectedEntry ? (
                  <>
                    <div className={classes.viewerHeader}>
                      <GluuText variant="span" disableThemeColor className={classes.viewerPath}>
                        {selectedEntry.path}
                      </GluuText>
                      {selectedIsText && canWriteSecurity && !isEditing && (
                        <GluuButton onClick={handleStartEdit} padding="6px 16px">
                          <Edit className={classes.actionIcon} aria-hidden /> {t('actions.edit')}
                        </GluuButton>
                      )}
                      {isEditing && (
                        <>
                          <GluuButton onClick={handleSave} padding="6px 16px">
                            <Check className={classes.actionIcon} aria-hidden /> {t('actions.save')}
                          </GluuButton>
                          <GluuButton onClick={handleDiscard} padding="6px 16px">
                            <Close className={classes.actionIcon} aria-hidden />{' '}
                            {t('actions.discard')}
                          </GluuButton>
                        </>
                      )}
                      {canWriteSecurity && !isEditing && (
                        <GluuButton
                          onClick={handleDeleteFile}
                          padding="6px 16px"
                          aria-label={t('actions.delete')}
                        >
                          <DeleteOutlined className={classes.actionIcon} aria-hidden />
                        </GluuButton>
                      )}
                    </div>
                    {selectedIsText ? (
                      <div className={classes.viewerBody}>
                        <AceEditor
                          mode={editorModeFor(selectedEntry.path)}
                          theme={isDark ? 'monokai' : 'xcode'}
                          value={isEditing ? draft : selectedText}
                          onChange={setDraft}
                          readOnly={!isEditing}
                          name={`archive-editor-${selectedEntry.path}`}
                          width="100%"
                          height={EDITOR_HEIGHT}
                          setOptions={{ useWorker: false, showPrintMargin: false }}
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
              showCancel
              cancelButtonLabel={t('actions.download')}
              onCancel={handleDownload}
              showApply={canWriteSecurity}
              applyButtonLabel={t('actions.add_file')}
              onApply={handleToggleAdd}
              applyButtonType="button"
            />
          </div>
        </GluuPageContent>
      </GluuViewWrapper>
    </GluuLoader>
  )
}

export default React.memo(ArchiveExplorerPage)
