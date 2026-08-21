import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useMediaQuery from '@mui/material/useMediaQuery'
import SetTitle from 'Utils/SetTitle'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { GluuBadge } from '@/components/GluuBadge'
import { GluuTable, COLUMN_WIDTHS } from '@/components/GluuTable'
import { GluuSearchToolbar } from '@/components/GluuSearchToolbar'
import {
  DeleteOutlined,
  DownloadOutlined,
  CheckCircleOutline,
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
import type { ColumnDef, ActionDef, PaginationConfig } from '@/components/GluuTable'
import type { FilterDef } from '@/components/GluuSearchToolbar/types'
import { usePolicyStoreMutations } from './hooks/usePolicyStoreMutations'
import { useStyles } from './styles/PolicyStoreHistoryPage.style'

const COLUMN_MIN_WIDTHS = { FILENAME: 280, SIZE: 110, COMMENTS: 200 } as const

const LIMIT_OPTIONS = getRowsPerPageOptions()

const SECURITY_RESOURCE_ID = ADMIN_UI_RESOURCES.Security
const PAGE_TITLE_KEY = 'titles.policy_store_history'
const ZIP_MIME_TYPE = 'application/zip'

const SORT_COLUMNS = ['creationDate', 'displayname', 'jansStatus'] as const
const SORT_COLUMN_LABELS: Record<string, string> = {
  creationDate: 'fields.uploaded',
  displayname: 'fields.name',
  jansStatus: 'fields.status',
}

const DEFAULT_SERVER_SORT = { column: 'creationDate', desc: true }

type PendingAction = { type: 'activate' | 'delete'; store: AdminUIPolicyStore }

const formatDate = (value: string | undefined): string => {
  if (!value) return '-'
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString()
}

const PolicyStoreHistoryPage: React.FC = () => {
  const { t } = useTranslation()
  const { navigateToRoute } = useAppNavigation()
  SetTitle(t(PAGE_TITLE_KEY))
  const pageTitle = t(PAGE_TITLE_KEY)

  const { canRead: canReadSecurity, canWrite: canWriteSecurity } =
    usePermission(SECURITY_RESOURCE_ID)

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

  const handleRowsPerPageChange = useCallback(
    (rowsPerPage: number) => {
      setLimit(rowsPerPage)
      setPageNumber(0)
    },
    [setLimit, setPageNumber],
  )

  const handleSearchSubmit = useCallback(() => {
    setPageNumber(0)
    refetch()
  }, [setPageNumber, refetch])

  const handleRefresh = useCallback(() => {
    setPageNumber(0)
    setPattern('')
    setServerSort(DEFAULT_SERVER_SORT)
    refetch()
  }, [setPageNumber, refetch])

  const handleSortByFilter = useCallback(
    (value: string) => {
      setServerSort({ column: value || DEFAULT_SERVER_SORT.column, desc: true })
      setPageNumber(0)
    },
    [setPageNumber],
  )

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
        minWidth: COLUMN_MIN_WIDTHS.FILENAME,
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
          const style = active ? badgeStyles.statusBadgeActive : badgeStyles.statusBadgeBackup
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
        width: COLUMN_WIDTHS.PILL_SINGLE,
        render: (_value, row) => (
          <GluuText variant="span" disableThemeColor className={classes.cellMuted}>
            {formatDate(row.creationDate)}
          </GluuText>
        ),
      },
      {
        key: 'policyStore',
        label: t('fields.size'),
        width: COLUMN_MIN_WIDTHS.SIZE,
        render: (_value, row) => (
          <GluuText variant="span" disableThemeColor className={classes.cellMuted}>
            {formatBytes(decodedByteLength(row.policyStore))}
          </GluuText>
        ),
      },
      {
        key: 'description',
        label: t('fields.comments'),
        minWidth: COLUMN_MIN_WIDTHS.COMMENTS,
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
        icon: <VisibilityOutlined className={classes.viewIcon} />,
        tooltip: t('actions.open'),
        id: 'openPolicyStore',
        onClick: handleOpen,
      },
      {
        icon: <DownloadOutlined className={classes.downloadIcon} />,
        tooltip: t('actions.download'),
        id: 'downloadPolicyStore',
        onClick: handleDownload,
        show: (row) => Boolean(row.policyStore),
      },
    ]
    if (isMobile) return list
    if (canWriteSecurity) {
      list.push(
        {
          icon: <CheckCircleOutline className={classes.activateIcon} />,
          tooltip: t('actions.set_active'),
          id: 'activatePolicyStore',
          disabled: (row) => isActivePolicyStore(row),
          onClick: (row) => setPendingAction({ type: 'activate', store: row }),
        },
        {
          icon: <DeleteOutlined className={classes.deleteIcon} />,
          tooltip: t('actions.delete'),
          id: 'deletePolicyStore',
          disabled: (row) => isActivePolicyStore(row),
          onClick: (row) => setPendingAction({ type: 'delete', store: row }),
        },
      )
    }
    return list
  }, [
    isLoading,
    canReadSecurity,
    canWriteSecurity,
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
        onChange: handleSortByFilter,
        width: TOOLBAR.CONTROL_WIDTH,
        defaultValue: DEFAULT_SERVER_SORT.column,
      },
    ],
    [t, serverSort.column, sortOptions, handleSortByFilter],
  )

  const pagination: PaginationConfig = useMemo(
    () => ({
      page: effectivePage,
      rowsPerPage: limit,
      totalItems,
      rowsPerPageOptions: LIMIT_OPTIONS,
      onPageChange: setPageNumber,
      onRowsPerPageChange: handleRowsPerPageChange,
    }),
    [effectivePage, limit, totalItems, setPageNumber, handleRowsPerPageChange],
  )

  const getRowKey = useCallback(
    (row: AdminUIPolicyStore, index: number) => row.inum ?? `no-inum-${index}`,
    [],
  )

  const emptyMessage = useMemo(
    () =>
      !pattern && totalItems === 0
        ? t('documentation.policyStore.noPolicyStores')
        : t('messages.no_data'),
    [pattern, totalItems, t],
  )

  const searchLabel = useMemo(() => `${t('fields.pattern')}:`, [t])
  const searchPlaceholder = useMemo(() => t('placeholders.search_pattern'), [t])

  const dialogFeature =
    pendingAction?.type === 'delete'
      ? adminUiFeatures.policy_store_delete
      : adminUiFeatures.policy_store_write

  const loading = isFetching || isMutating

  return (
    <GluuLoader blocking={loading}>
      <div className={classes.page}>
        <GluuViewWrapper canShow={canReadSecurity}>
          <GluuText variant="h1" className={classes.mobilePageTitle}>
            {pageTitle}
          </GluuText>

          <div className={classes.searchCard}>
            <div className={classes.searchCardContent}>
              <GluuSearchToolbar
                searchLabel={searchLabel}
                searchPlaceholder={searchPlaceholder}
                searchValue={pattern}
                searchOnType
                onSearch={setPattern}
                onSearchSubmit={handleSearchSubmit}
                filters={filters}
                onRefresh={canReadSecurity ? handleRefresh : undefined}
                refreshLoading={isFetching}
                actionsLabel={`${t('fields.actions')}:`}
                disabled={loading}
              />
            </div>
          </div>

          <div className={classes.tableCard}>
            <GluuTable<AdminUIPolicyStore>
              columns={columns}
              data={stores}
              loading={false}
              pagination={pagination}
              onPagingSizeSync={onPagingSizeSync}
              actions={actions}
              getRowKey={getRowKey}
              emptyMessage={emptyMessage}
            />
          </div>
        </GluuViewWrapper>

        <GluuCommitDialog
          modal={Boolean(pendingAction)}
          handler={closeDialog}
          onAccept={handleConfirm}
          feature={dialogFeature}
          alertSeverity={pendingAction?.type === 'delete' ? 'error' : 'warning'}
          alertMessage={
            pendingAction?.type === 'delete'
              ? t('documentation.policyStore.deleteWarning')
              : t('documentation.policyStore.activateWarning')
          }
          operations={
            pendingAction
              ? [
                  {
                    label:
                      pendingAction.type === 'delete'
                        ? t('actions.delete')
                        : t('actions.set_active'),
                    path: pendingAction.store.displayname || pendingAction.store.inum || '',
                    value: pendingAction.store.description || '',
                  },
                ]
              : []
          }
        />
      </div>
    </GluuLoader>
  )
}

export default React.memo(PolicyStoreHistoryPage)
