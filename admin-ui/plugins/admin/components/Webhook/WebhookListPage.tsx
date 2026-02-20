import React, { useEffect, useState, useCallback, useMemo, memo } from 'react'
import { DeleteOutlined, Edit, Add } from '@mui/icons-material'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { GluuBadge } from '@/components/GluuBadge'
import { useCedarling } from '@/cedarling'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { isDevelopment } from '@/utils/env'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import SetTitle from 'Utils/SetTitle'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { useGetAllWebhooks } from 'JansConfigApi'
import type { PagedResultEntriesItem } from 'JansConfigApi'
import { useDeleteWebhookWithAudit } from './hooks'
import { GluuTable } from '@/components/GluuTable'
import { GluuSearchToolbar } from '@/components/GluuSearchToolbar'
import type { ColumnDef, PaginationConfig } from '@/components/GluuTable'
import type { FilterDef } from '@/components/GluuSearchToolbar/types'
import type { WebhookEntry } from './types'
import { useStyles } from './styles/WebhookListPage.style'
import { getRowsPerPageOptions, usePaginationState } from '@/utils/pagingUtils'

const toWebhookEntries = (entries: PagedResultEntriesItem[] | undefined): WebhookEntry[] => {
  return (entries ?? []) as unknown as WebhookEntry[]
}

const LIMIT_OPTIONS = getRowsPerPageOptions()

const SORT_COLUMNS = ['inum', 'displayName', 'url', 'httpMethod', 'jansEnabled'] as const
const SORT_COLUMN_LABELS: Record<string, string> = {
  inum: 'fields.inum',
  displayName: 'fields.name',
  url: 'fields.url',
  httpMethod: 'fields.http_method',
  jansEnabled: 'fields.status',
}
const DEFAULT_SERVER_SORT: { column: string; desc: boolean } = { column: 'inum', desc: false }
const WEBHOOK_RESOURCE_ID = ADMIN_UI_RESOURCES.Webhooks

const sortRows = <T,>(rows: T[], column: keyof T & string, desc: boolean): T[] => {
  const sorted = [...rows].sort((a, b) => {
    const aVal = a[column]
    const bVal = b[column]
    if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
      return aVal === bVal ? 0 : aVal ? -1 : 1
    }
    return String(aVal ?? '').localeCompare(String(bVal ?? ''), undefined, { sensitivity: 'base' })
  })
  return desc ? sorted.reverse() : sorted
}
const WEBHOOK_SCOPES = CEDAR_RESOURCE_SCOPES[WEBHOOK_RESOURCE_ID] ?? []
const WebhookListPage: React.FC = () => {
  const { navigateToRoute } = useAppNavigation()
  const {
    hasCedarReadPermission,
    hasCedarWritePermission,
    hasCedarDeletePermission,
    authorizeHelper,
  } = useCedarling()

  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const isDarkTheme = themeState.theme === THEME_DARK
  const { classes, badgeStyles } = useStyles({ isDark: isDarkTheme, themeColors })

  const { limit, setLimit, pageNumber, setPageNumber, onPagingSizeSync } = usePaginationState()
  const [pattern, setPattern] = useState('')
  const [modal, setModal] = useState(false)
  const [deleteData, setDeleteData] = useState<WebhookEntry | null>(null)
  const [serverSort, setServerSort] = useState(DEFAULT_SERVER_SORT)
  const [clientSort, setClientSort] = useState<{ column: string; desc: boolean } | null>(null)

  SetTitle(t('titles.webhooks'))

  const canReadWebhooks = useMemo(
    () => hasCedarReadPermission(WEBHOOK_RESOURCE_ID),
    [hasCedarReadPermission],
  )
  const canWriteWebhooks = useMemo(
    () => hasCedarWritePermission(WEBHOOK_RESOURCE_ID),
    [hasCedarWritePermission],
  )
  const canDeleteWebhooks = useMemo(
    () => hasCedarDeletePermission(WEBHOOK_RESOURCE_ID),
    [hasCedarDeletePermission],
  )

  const { data, isLoading, refetch } = useGetAllWebhooks(
    {
      limit,
      pattern: pattern || undefined,
      startIndex: pageNumber * limit,
      sortBy: serverSort.column,
      sortOrder: serverSort.desc ? 'descending' : 'ascending',
    },
    {
      query: {
        enabled: canReadWebhooks,
      },
    },
  )

  const webhooksRaw = useMemo(() => toWebhookEntries(data?.entries), [data])
  const totalItems = useMemo(() => data?.totalEntriesCount || 0, [data])

  const webhooks = useMemo(
    () =>
      clientSort
        ? sortRows(webhooksRaw, clientSort.column as keyof WebhookEntry & string, clientSort.desc)
        : webhooksRaw,
    [webhooksRaw, clientSort],
  )

  const effectivePage = useMemo(() => {
    const maxPage = totalItems > 0 ? Math.max(0, Math.ceil(totalItems / limit) - 1) : 0
    return Math.min(pageNumber, maxPage)
  }, [pageNumber, totalItems, limit])

  useEffect(() => {
    if (totalItems > 0 && pageNumber > effectivePage) {
      setPageNumber(effectivePage)
    }
  }, [totalItems, pageNumber, limit, effectivePage])

  const { deleteWebhook, isLoading: isDeleting } = useDeleteWebhookWithAudit()

  useEffect(() => {
    if (WEBHOOK_SCOPES.length > 0) {
      authorizeHelper(WEBHOOK_SCOPES)
    }
  }, [authorizeHelper])

  const toggle = useCallback(() => setModal((prev) => !prev), [])

  const submitForm = useCallback(
    async (userMessage: string) => {
      const inumToDelete = deleteData?.inum
      setDeleteData(null)
      if (inumToDelete) {
        try {
          await deleteWebhook(inumToDelete, userMessage)
          refetch()
        } catch (error) {
          if (isDevelopment) console.error('Delete webhook failed:', error)
        }
      }
    },
    [deleteData, deleteWebhook, refetch, t],
  )

  const navigateToAddPage = useCallback(() => {
    navigateToRoute(ROUTES.WEBHOOK_ADD)
  }, [navigateToRoute])

  const navigateToEditPage = useCallback(
    (rowData: WebhookEntry) => {
      if (!rowData?.inum) return
      navigateToRoute(ROUTES.WEBHOOK_EDIT(rowData.inum))
    },
    [navigateToRoute],
  )

  const handleSearchSubmit = useCallback(() => {
    setPageNumber(0)
  }, [])

  const handleRefresh = useCallback(() => {
    setPageNumber(0)
    setPattern('')
    setServerSort(DEFAULT_SERVER_SORT)
    setClientSort(null)
    refetch()
  }, [refetch])

  const handlePageChange = useCallback((page: number) => {
    setPageNumber(page)
  }, [])

  const handleRowsPerPageChange = useCallback((rowsPerPage: number) => {
    setLimit(rowsPerPage)
    setPageNumber(0)
  }, [])

  const handlePagingSizeSync = useCallback(
    (newSize: number) => {
      onPagingSizeSync(newSize)
    },
    [onPagingSizeSync],
  )

  const handleSort = useCallback((columnKey: string, direction: 'asc' | 'desc' | null) => {
    setClientSort(direction ? { column: columnKey, desc: direction === 'desc' } : null)
  }, [])

  const handleSortByFilter = useCallback((value: string) => {
    setServerSort({ column: value || 'inum', desc: false })
    setClientSort(null)
  }, [])

  const sortOptions = useMemo(
    () =>
      SORT_COLUMNS.map((value) => ({
        value,
        label: t(SORT_COLUMN_LABELS[value] || 'fields.status'),
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
        width: 180,
      },
    ],
    [t, serverSort.column, handleSortByFilter, sortOptions],
  )

  const searchLabel = useMemo(() => `${t('fields.pattern')}:`, [t])
  const searchPlaceholder = useMemo(() => t('placeholders.search_pattern'), [t])

  const primaryAction = useMemo(
    () => ({
      label: t('messages.add_webhook'),
      icon: <Add className={classes.addIcon} />,
      onClick: navigateToAddPage,
      disabled: !canWriteWebhooks,
    }),
    [t, navigateToAddPage, canWriteWebhooks, classes],
  )

  const columns: ColumnDef<WebhookEntry>[] = useMemo(
    () => [
      {
        key: 'displayName',
        label: t('fields.name'),
        sortable: true,
        render: (_value, row) => (
          <GluuText variant="span" disableThemeColor className={classes.cellDisplayName}>
            {row.displayName}
          </GluuText>
        ),
      },
      {
        key: 'url',
        label: t('fields.url'),
        width: '35%',
        sortable: true,
        render: (_value, row) => (
          <GluuText variant="span" disableThemeColor className={classes.cellUrl}>
            {row.url}
          </GluuText>
        ),
      },
      {
        key: 'httpMethod',
        label: t('fields.http_method'),
        sortable: true,
        render: (_value, row) => {
          const upper = (row.httpMethod || '').toUpperCase()
          const methodStyle =
            upper === 'GET' || upper === 'POST'
              ? badgeStyles.httpMethodBadgeGetPost
              : upper === 'PUT' || upper === 'PATCH'
                ? badgeStyles.httpMethodBadgePutPatch
                : upper === 'DELETE'
                  ? badgeStyles.httpMethodBadgeDelete
                  : badgeStyles.httpMethodBadgeDefault
          return (
            <GluuBadge
              size="md"
              backgroundColor={methodStyle.backgroundColor}
              textColor={methodStyle.textColor}
              borderColor={methodStyle.borderColor}
              className={classes.httpMethodBadge}
            >
              {row.httpMethod}
            </GluuBadge>
          )
        },
      },
      {
        key: 'jansEnabled',
        label: t('fields.status'),
        sortable: true,
        render: (_value, row) => {
          const isEnabled = row.jansEnabled === true
          const style = isEnabled ? badgeStyles.statusBadgeEnabled : badgeStyles.statusBadgeDisabled
          return (
            <GluuBadge
              size="md"
              backgroundColor={style.backgroundColor}
              textColor={style.textColor}
              borderColor={style.borderColor}
              borderRadius={5}
              className={classes.statusBadge}
            >
              {isEnabled ? t('options.enabled') : t('options.disabled')}
            </GluuBadge>
          )
        },
      },
    ],
    [t, classes, badgeStyles],
  )

  const actions = useMemo(() => {
    const list: Array<{
      icon: React.ReactNode
      tooltip: string
      id?: string
      onClick: (row: WebhookEntry) => void
    }> = []
    if (canWriteWebhooks) {
      list.push({
        icon: <Edit className={classes.editIcon} />,
        tooltip: t('actions.edit'),
        id: 'editWebhook',
        onClick: navigateToEditPage,
      })
    }
    if (canDeleteWebhooks) {
      list.push({
        icon: <DeleteOutlined className={classes.deleteIcon} />,
        tooltip: t('actions.delete'),
        id: 'deleteWebhook',
        onClick: (row) => {
          setDeleteData(row)
          toggle()
        },
      })
    }
    return list
  }, [canWriteWebhooks, canDeleteWebhooks, t, navigateToEditPage, toggle, classes])

  const pagination: PaginationConfig = useMemo(
    () => ({
      page: effectivePage,
      rowsPerPage: limit,
      totalItems,
      rowsPerPageOptions: LIMIT_OPTIONS,
      onPageChange: handlePageChange,
      onRowsPerPageChange: handleRowsPerPageChange,
    }),
    [effectivePage, limit, totalItems, handlePageChange, handleRowsPerPageChange],
  )

  const getRowKey = useCallback(
    (row: WebhookEntry, index: number) => row.inum ?? `no-inum-${index}`,
    [],
  )

  const emptyMessage = useMemo(() => {
    if (!pattern && totalItems === 0) {
      return t('messages.no_webhooks_found')
    }
    return t('messages.no_data')
  }, [pattern, totalItems, t])

  const loading = isLoading || isDeleting

  return (
    <GluuLoader blocking={loading}>
      <div className={classes.page}>
        <GluuViewWrapper canShow={canReadWebhooks}>
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
                onRefresh={canReadWebhooks ? handleRefresh : undefined}
                refreshLoading={isLoading}
                primaryAction={primaryAction}
              />
            </div>
          </div>

          <div className={classes.tableCard}>
            <GluuTable<WebhookEntry>
              columns={columns}
              data={webhooks}
              loading={false}
              pagination={pagination}
              onPagingSizeSync={handlePagingSizeSync}
              actions={actions}
              sortColumn={clientSort?.column ?? null}
              sortDirection={clientSort ? (clientSort.desc ? 'desc' : 'asc') : null}
              onSort={handleSort}
              getRowKey={getRowKey}
              emptyMessage={emptyMessage}
            />
          </div>
        </GluuViewWrapper>
        <GluuCommitDialog
          handler={toggle}
          modal={modal}
          onAccept={submitForm}
          label={
            modal && deleteData
              ? `${t('messages.action_deletion_for')} ${t('messages.webhook_entity')} (${[deleteData.url, deleteData.inum].filter(Boolean).join('-')})`
              : ''
          }
        />
      </div>
    </GluuLoader>
  )
}

export default memo(WebhookListPage)
