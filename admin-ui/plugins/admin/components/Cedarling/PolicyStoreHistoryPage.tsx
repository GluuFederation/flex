import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import SetTitle from 'Utils/SetTitle'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { GluuPageContent } from '@/components'
import { GluuBadge } from '@/components/GluuBadge'
import { GluuTable, COLUMN_WIDTHS } from '@/components/GluuTable'
import { GluuSearchToolbar } from '@/components/GluuSearchToolbar'
import {
  DeleteOutlined,
  DownloadOutlined,
  CheckCircleOutline,
  InfoOutlined,
  VisibilityOutlined,
} from '@/components/icons'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { usePermission } from '@/cedarling/hooks/usePermission'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { useGetAdminuiPolicyStore, type AdminUIPolicyStore } from 'JansConfigApi'
import { getRowsPerPageOptions, usePaginationState } from '@/utils/pagingUtils'
import { MOBILE_MEDIA_QUERY, TOOLBAR } from '@/constants'
import { adminUiFeatures } from '@/constants'
import {
  decodedByteLength,
  isActivePolicyStore,
  toPolicyStoreEntries,
  toPolicyStoreTotal,
  base64ToUint8Array,
} from '@/utils/policyStore'
import { formatBytes } from '@/utils/cjarArchive'
import { logger } from '@/utils/logger'
import type { ColumnDef, ActionDef } from '@/components/GluuTable'
import type { FilterDef } from '@/components/GluuSearchToolbar/types'
import { usePolicyStoreMutations } from './hooks/usePolicyStoreMutations'
import { useStyles } from './styles/PolicyStoreHistoryPage.style'

const SECURITY_RESOURCE_ID = ADMIN_UI_RESOURCES.Security
const PAGE_TITLE_KEY = 'titles.policy_store_history'
const ZIP_MIME_TYPE = 'application/zip'

const SORT_COLUMNS = ['creationDate', 'displayname', 'jansStatus'] as const
const SORT_COLUMN_LABELS: Record<string, string> = {
  creationDate: 'fields.uploaded',
  displayname: 'fields.name',
  jansStatus: 'fields.status',
}

// The list endpoint defaults to sorting by inum (a random uuid). A history screen has to be
// chronological, so newest-first is the default here.
const DEFAULT_SERVER_SORT = { column: 'creationDate', desc: true }

type PendingAction = { type: 'activate' | 'delete'; store: AdminUIPolicyStore }

const formatDate = (value: string | undefined): string => {
  if (!value) return '-'
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString()
}

/** `jansUsrDN` is a DN such as `inum=abc,ou=people,o=jans`; show just the inum where possible. */
const formatUploadedBy = (dn: string | undefined): string => {
  if (!dn) return '-'
  const inumPart = dn.split(',').find((part) => part.trim().toLowerCase().startsWith('inum='))
  return inumPart ? inumPart.trim().slice('inum='.length) : dn
}

const PolicyStoreHistoryPage: React.FC = () => {
  const { t } = useTranslation()
  const { navigateToRoute } = useAppNavigation()
  SetTitle(t(PAGE_TITLE_KEY))

  const {
    canRead: canReadSecurity,
    canWrite: canWriteSecurity,
    canDelete: canDeleteSecurity,
  } = usePermission(SECURITY_RESOURCE_ID)

  const { state: themeState } = useTheme()
  const isDark = themeState.theme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const { classes, badgeStyles } = useStyles({ isDark, themeColors })
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY)

  const { limit, setLimit, pageNumber, setPageNumber, onPagingSizeSync } = usePaginationState()
  const [pattern, setPattern] = useState('')
  const [serverSort, setServerSort] = useState(DEFAULT_SERVER_SORT)
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)

  const { setPolicyStoreActive, deletePolicyStore, isMutating } = usePolicyStoreMutations()

  const { data, isLoading, isFetching, refetch } = useGetAdminuiPolicyStore(
    {
      limit,
      pattern: pattern || undefined,
      startIndex: pageNumber * limit,
      sortBy: serverSort.column,
      sortOrder: serverSort.desc ? 'descending' : 'ascending',
    },
    { query: { enabled: canReadSecurity, staleTime: 0 } },
  )

  const stores = useMemo(() => toPolicyStoreEntries(data), [data])
  const totalItems = useMemo(() => toPolicyStoreTotal(data), [data])

  const effectivePage = useMemo(() => {
    const maxPage = totalItems > 0 ? Math.max(0, Math.ceil(totalItems / limit) - 1) : 0
    return Math.min(pageNumber, maxPage)
  }, [pageNumber, totalItems, limit])

  useEffect(() => {
    if (totalItems > 0 && pageNumber > effectivePage) {
      setPageNumber(effectivePage)
    }
  }, [totalItems, pageNumber, effectivePage, setPageNumber])

  const handleOpen = useCallback(
    (store: AdminUIPolicyStore) => {
      if (!store.inum) return
      navigateToRoute(ROUTES.ADMIN_POLICY_STORE_EXPLORER(store.inum))
    },
    [navigateToRoute],
  )

  const handleDownload = useCallback(
    (store: AdminUIPolicyStore) => {
      try {
        if (!store.policyStore) {
          return
        }
        const blob = new Blob([base64ToUint8Array(store.policyStore)], { type: ZIP_MIME_TYPE })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = store.displayname || `${store.inum}.cjar`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      } catch (error) {
        logger.error(
          'Failed to download policy store:',
          error instanceof Error ? error : String(error),
        )
      }
    },
    [t],
  )

  const closeDialog = useCallback(() => setPendingAction(null), [])

  const handleConfirm = useCallback(
    async (comments: string) => {
      if (!pendingAction) return
      const { type, store } = pendingAction
      try {
        if (type === 'activate') {
          await setPolicyStoreActive(store, comments)
        } else {
          await deletePolicyStore(store, comments)
        }
        setPendingAction(null)
        refetch()
      } catch (error) {
        logger.error(`Policy store ${type} failed:`, error instanceof Error ? error : String(error))
      }
    },
    [pendingAction, setPolicyStoreActive, deletePolicyStore, refetch],
  )

  const columns: ColumnDef<AdminUIPolicyStore>[] = useMemo(
    () => [
      {
        key: 'displayname',
        label: t('fields.filename'),
        render: (_value, row) => (
          <GluuText variant="span" disableThemeColor className={classes.cellName}>
            {row.displayname || row.inum}
          </GluuText>
        ),
      },
      {
        key: 'jansStatus',
        label: t('fields.status'),
        width: COLUMN_WIDTHS.PILL_SINGLE_SHORT,
        render: (_value, row) => {
          const active = isActivePolicyStore(row)
          const style = active ? badgeStyles.active : badgeStyles.backup
          return (
            <GluuBadge
              size="md"
              backgroundColor={style.backgroundColor}
              textColor={style.textColor}
              borderColor={style.borderColor}
              borderRadius={5}
              className={classes.statusBadge}
            >
              {active ? t('options.active') : t('options.backup')}
            </GluuBadge>
          )
        },
      },
      {
        key: 'creationDate',
        label: t('fields.uploaded'),
        render: (_value, row) => (
          <GluuText variant="span" disableThemeColor className={classes.cellMuted}>
            {formatDate(row.creationDate)}
          </GluuText>
        ),
      },
      {
        key: 'policyStore',
        label: t('fields.size'),
        render: (_value, row) => (
          <GluuText variant="span" disableThemeColor className={classes.cellMuted}>
            {formatBytes(decodedByteLength(row.policyStore))}
          </GluuText>
        ),
      },
      {
        key: 'jansUsrDN',
        label: t('fields.uploaded_by'),
        render: (_value, row) => (
          <GluuText variant="span" disableThemeColor className={classes.cellMuted}>
            {formatUploadedBy(row.jansUsrDN)}
          </GluuText>
        ),
      },
      {
        key: 'description',
        label: t('fields.comments'),
        render: (_value, row) => (
          <GluuText variant="span" disableThemeColor className={classes.cellComments}>
            {row.description || '-'}
          </GluuText>
        ),
      },
    ],
    [t, classes, badgeStyles],
  )

  const actions: ActionDef<AdminUIPolicyStore>[] = useMemo(() => {
    if (isLoading || !canReadSecurity) return []
    const list: ActionDef<AdminUIPolicyStore>[] = [
      {
        icon: <VisibilityOutlined className={classes.actionIcon} />,
        tooltip: t('actions.open'),
        id: 'openPolicyStore',
        onClick: handleOpen,
      },
      {
        icon: <DownloadOutlined className={classes.actionIcon} />,
        tooltip: t('actions.download'),
        id: 'downloadPolicyStore',
        onClick: handleDownload,
        show: (row) => Boolean(row.policyStore),
      },
    ]
    if (isMobile) return list
    if (canWriteSecurity) {
      list.push({
        icon: <CheckCircleOutline className={classes.activeIcon} />,
        tooltip: t('actions.set_active'),
        id: 'activatePolicyStore',
        // The active store is already live; only backups can be promoted.
        show: (row) => !isActivePolicyStore(row),
        onClick: (row) => setPendingAction({ type: 'activate', store: row }),
      })
    }
    if (canDeleteSecurity) {
      list.push({
        icon: <DeleteOutlined className={classes.actionIcon} />,
        tooltip: t('actions.delete'),
        id: 'deletePolicyStore',
        // The ticket requires one active store at all times, so the active one cannot be deleted.
        show: (row) => !isActivePolicyStore(row),
        onClick: (row) => setPendingAction({ type: 'delete', store: row }),
      })
    }
    return list
  }, [
    isLoading,
    canReadSecurity,
    canWriteSecurity,
    canDeleteSecurity,
    isMobile,
    classes,
    t,
    handleOpen,
    handleDownload,
  ])

  const sortOptions = useMemo(
    () =>
      SORT_COLUMNS.map((value) => ({
        value,
        label: t(SORT_COLUMN_LABELS[value] ?? 'fields.status'),
      })),
    [t],
  )

  const filters: FilterDef[] = useMemo(
    () => [
      {
        key: 'sortBy',
        label: `${t('fields.sort_by')}:`,
        value: serverSort.column,
        options: sortOptions,
        onChange: (value: string) => {
          setServerSort({ column: value || DEFAULT_SERVER_SORT.column, desc: true })
          setPageNumber(0)
        },
        width: TOOLBAR.CONTROL_WIDTH,
        defaultValue: DEFAULT_SERVER_SORT.column,
      },
    ],
    [t, serverSort.column, sortOptions, setPageNumber],
  )

  const dialogFeature =
    pendingAction?.type === 'delete'
      ? adminUiFeatures.policy_store_delete
      : adminUiFeatures.policy_store_write

  return (
    <GluuLoader blocking={isLoading || isMutating}>
      <GluuViewWrapper canShow={canReadSecurity}>
        <GluuPageContent>
          <Box className={classes.page}>
            {isMobile && (
              <GluuText variant="h1" className={classes.mobilePageTitle} disableThemeColor>
                {t(PAGE_TITLE_KEY)}
              </GluuText>
            )}

            <Box className={classes.infoAlert}>
              <InfoOutlined className={classes.infoIcon} />
              <GluuText variant="span" className={classes.infoText} disableThemeColor>
                {t('documentation.policyStore.historyNote')}
              </GluuText>
            </Box>

            <GluuSearchToolbar
              searchLabel={`${t('fields.pattern')}:`}
              searchPlaceholder={t('placeholders.search_pattern')}
              searchValue={pattern}
              onSearch={setPattern}
              onSearchSubmit={(value: string) => {
                setPattern(value)
                setPageNumber(0)
                refetch()
              }}
              filters={filters}
              onRefresh={() => {
                setPageNumber(0)
                setPattern('')
                setServerSort(DEFAULT_SERVER_SORT)
                refetch()
              }}
              refreshLoading={isFetching}
            />

            <GluuTable<AdminUIPolicyStore>
              columns={columns}
              data={stores}
              loading={isLoading}
              actions={actions}
              getRowKey={(item, index) => item.inum ?? index}
              emptyMessage={t('documentation.policyStore.noPolicyStores')}
              onPagingSizeSync={onPagingSizeSync}
              pagination={{
                page: effectivePage,
                rowsPerPage: limit,
                totalItems,
                rowsPerPageOptions: getRowsPerPageOptions(),
                onPageChange: setPageNumber,
                onRowsPerPageChange: (rowsPerPage) => {
                  setLimit(rowsPerPage)
                  setPageNumber(0)
                },
              }}
            />
          </Box>
        </GluuPageContent>
      </GluuViewWrapper>

      {pendingAction && (
        <GluuCommitDialog
          modal
          handler={closeDialog}
          onAccept={handleConfirm}
          feature={dialogFeature}
          alertSeverity={pendingAction.type === 'delete' ? 'error' : 'warning'}
          alertMessage={
            pendingAction.type === 'delete'
              ? t('documentation.policyStore.deleteWarning')
              : t('documentation.policyStore.activateWarning')
          }
          operations={[
            {
              label:
                pendingAction.type === 'delete' ? t('actions.delete') : t('actions.set_active'),
              path: pendingAction.store.displayname || pendingAction.store.inum || '',
              value: pendingAction.store.description || '',
            },
          ]}
        />
      )}
    </GluuLoader>
  )
}

export default React.memo(PolicyStoreHistoryPage)
