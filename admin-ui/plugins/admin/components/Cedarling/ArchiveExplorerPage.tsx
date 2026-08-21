import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
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
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { usePermission } from '@/cedarling/hooks/usePermission'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { useGetAdminuiPolicyStore, type AdminUIPolicyStore } from 'JansConfigApi'
import { base64ToUint8Array, toPolicyStoreEntries } from '@/utils/policyStore'
import {
  buildArchiveTree,
  editorModeFor,
  entryToText,
  isTextEntry,
  readArchive,
  type ArchiveEntry,
} from '@/utils/cjarArchive'
import { logger } from '@/utils/logger'
import ArchiveFileTree from './components/ArchiveFileTree'
import { useStyles, PANE_BODY_PADDING } from './styles/ArchiveExplorerPage.style'

const SECURITY_RESOURCE_ID = ADMIN_UI_RESOURCES.Security
const EDITOR_HEIGHT = '100%'
const EDITOR_FONT_SIZE = 16

const EMPTY_LOCATION = { dir: '', name: '' } as const
const EDITOR_OPTIONS = {
  useWorker: false,
  showPrintMargin: false,
  hScrollBarAlwaysVisible: false,
} as const
const EDITOR_PROPS = { $blockScrolling: true } as const

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
  const { navigateBack } = useAppNavigation()
  SetTitle(t('titles.policy_store_contents'))

  const { canRead: canReadSecurity } = usePermission(SECURITY_RESOURCE_ID)

  const { state: themeState } = useTheme()
  const isDark = themeState.theme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const { classes } = useStyles({ isDark, themeColors })

  const [entries, setEntries] = useState<ArchiveEntry[] | null>(null)
  const loadedInumRef = useRef<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [selectedPath, setSelectedPath] = useState<string | null>(null)

  const { data, isLoading } = useGetAdminuiPolicyStore(
    { limit: 1, fieldValuePair: inum ? `inum=${inum}` : undefined },
    { query: { enabled: canReadSecurity && Boolean(inum) } },
  )

  const store: AdminUIPolicyStore | undefined = useMemo(() => {
    const list = toPolicyStoreEntries(data)
    return list.find((entry) => entry.inum === inum) ?? (list.length === 1 ? list[0] : undefined)
  }, [data, inum])

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

  const tree = useMemo(() => buildArchiveTree(entries ?? []), [entries])

  const selectedEntry = useMemo(
    () => entries?.find((entry) => entry.path === selectedPath) ?? null,
    [entries, selectedPath],
  )

  const selectedIsText = useMemo(
    () => (selectedEntry ? isTextEntry(selectedEntry.path) : false),
    [selectedEntry],
  )
  const selectedText = useMemo(
    () => (selectedEntry && selectedIsText ? entryToText(selectedEntry) : ''),
    [selectedEntry, selectedIsText],
  )

  const fileCount = useMemo(() => countArchiveFiles(entries), [entries])

  const selectedLocation = useMemo(() => splitArchivePath(selectedEntry), [selectedEntry])

  const handleSelect = useCallback((path: string) => {
    setSelectedPath(path)
  }, [])

  const handleEditorLoad = useCallback((editor: Ace.Editor) => {
    editor.renderer.setScrollMargin(PANE_BODY_PADDING, PANE_BODY_PADDING, 0, 0)
  }, [])

  const handleBack = useCallback(() => navigateBack(ROUTES.ADMIN_POLICIES_LIST), [navigateBack])

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

            <div className={classes.splitPane}>
              <div className={classes.treePane}>
                <div className={classes.paneHeader}>
                  <GluuText variant="span" disableThemeColor className={classes.paneTitle}>
                    {t('fields.files')}
                  </GluuText>
                  <GluuText variant="span" disableThemeColor className={classes.paneCount}>
                    {fileCount}
                  </GluuText>
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
                      </div>
                    </div>
                    {selectedIsText ? (
                      <div className={classes.viewerBody}>
                        <AceEditor
                          mode={editorModeFor(selectedEntry.path)}
                          theme={isDark ? 'monokai' : 'xcode'}
                          value={selectedText}
                          readOnly
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
              showCancel={false}
            />
          </div>
        </GluuPageContent>
      </GluuViewWrapper>
    </GluuLoader>
  )
}

export default React.memo(ArchiveExplorerPage)
