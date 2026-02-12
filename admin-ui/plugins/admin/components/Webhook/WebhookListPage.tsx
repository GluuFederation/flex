import React, { useEffect, useState, useCallback, useMemo, memo } from 'react'
import { DeleteOutlined, Edit, Add } from '@mui/icons-material'
import { Chip } from '@mui/material'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import customColors from '@/customColors'
import { useCedarling } from '@/cedarling'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import SetTitle from 'Utils/SetTitle'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { setSelectedWebhook } from 'Plugins/admin/redux/features/WebhookSlice'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { useGetAllWebhooks } from 'JansConfigApi'
import { useDeleteWebhookWithAudit } from './hooks'
import { GluuTable } from '@/components/GluuTable'
import { GluuSearchToolbar } from '@/components/GluuSearchToolbar'
import type { ColumnDef, PaginationConfig } from '@/components/GluuTable'
import type { FilterDef } from '@/components/GluuSearchToolbar/types'
import type { WebhookEntry } from './types'
import { fontFamily } from '@/styles/fonts'
import { useStyles } from './WebhookListPage.style'

const LIMIT_OPTIONS = [5, 10, 25, 50]
const SEARCH_FIELD_WIDTH = 280

const getHttpMethodColor = (
  method: string,
): 'info' | 'success' | 'error' | 'warning' | 'default' => {
  const colorMap: Record<string, 'info' | 'success' | 'error' | 'warning'> = {
    GET: 'info',
    POST: 'success',
    PUT: 'warning',
    PATCH: 'warning',
    DELETE: 'error',
  }
  return colorMap[method] || 'default'
}

const WebhookListPage: React.FC = () => {
  const dispatch = useDispatch()
  const { navigateToRoute } = useAppNavigation()
  const {
    hasCedarReadPermission,
    hasCedarWritePermission,
    hasCedarDeletePermission,
    authorizeHelper,
  } = useCedarling()

  const webhookResourceId = useMemo(() => ADMIN_UI_RESOURCES.Webhooks, [])
  const webhookScopes = useMemo(() => CEDAR_RESOURCE_SCOPES[webhookResourceId], [webhookResourceId])

  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const darkThemeColors = useMemo(() => getThemeColor('dark'), [])
  const lightThemeColors = useMemo(() => getThemeColor('light'), [])
  const isDarkTheme = themeState.theme === THEME_DARK
  const { classes } = useStyles({ isDark: isDarkTheme, themeColors })

  const [pageNumber, setPageNumber] = useState(0)
  const [limit, setLimit] = useState(10)
  const [pattern, setPattern] = useState('')
  const [reversed, setReversed] = useState(false)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [modal, setModal] = useState(false)
  const [deleteData, setDeleteData] = useState<WebhookEntry | null>(null)

  SetTitle(t('titles.webhooks'))

  const canReadWebhooks = useMemo(
    () => hasCedarReadPermission(webhookResourceId),
    [hasCedarReadPermission, webhookResourceId],
  )
  const canWriteWebhooks = useMemo(
    () => hasCedarWritePermission(webhookResourceId),
    [hasCedarWritePermission, webhookResourceId],
  )
  const canDeleteWebhooks = useMemo(
    () => hasCedarDeletePermission(webhookResourceId),
    [hasCedarDeletePermission, webhookResourceId],
  )

  const { data, isLoading, refetch } = useGetAllWebhooks(
    {
      limit,
      pattern: pattern || undefined,
      startIndex: pageNumber * limit,
    },
    {
      query: {
        enabled: canReadWebhooks,
      },
    },
  )

  const webhooksRaw = useMemo(() => (data?.entries || []) as unknown as WebhookEntry[], [data])
  const totalItems = useMemo(() => data?.totalEntriesCount || 0, [data])

  const webhooks = useMemo(
    () => (reversed ? [...webhooksRaw].reverse() : webhooksRaw),
    [webhooksRaw, reversed],
  )

  useEffect(() => {
    if (totalItems > 0 && pageNumber * limit >= totalItems) {
      const lastPage = Math.max(0, Math.ceil(totalItems / limit) - 1)
      setPageNumber(lastPage)
    }
  }, [totalItems, pageNumber, limit])

  const { deleteWebhook, isLoading: isDeleting } = useDeleteWebhookWithAudit()

  useEffect(() => {
    if (webhookScopes && webhookScopes.length > 0) {
      authorizeHelper(webhookScopes)
    }
  }, [authorizeHelper, webhookScopes])

  const toggle = useCallback(() => setModal((prev) => !prev), [])

  const submitForm = useCallback(
    async (userMessage: string) => {
      toggle()
      if (deleteData?.inum) {
        await deleteWebhook(deleteData.inum, userMessage)
      }
    },
    [toggle, deleteData, deleteWebhook],
  )

  const navigateToAddPage = useCallback(() => {
    dispatch(setSelectedWebhook(null))
    navigateToRoute(ROUTES.WEBHOOK_ADD)
  }, [dispatch, navigateToRoute])

  const navigateToEditPage = useCallback(
    (rowData: WebhookEntry) => {
      if (!rowData?.inum) return
      dispatch(setSelectedWebhook(rowData))
      navigateToRoute(ROUTES.WEBHOOK_EDIT(rowData.inum))
    },
    [dispatch, navigateToRoute],
  )

  const handleSearchSubmit = useCallback(() => {
    setPageNumber(0)
  }, [])

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit)
    setPageNumber(0)
  }, [])

  const handleRefresh = useCallback(() => {
    refetch()
  }, [refetch])

  const handlePageChange = useCallback((page: number) => {
    setPageNumber(page)
  }, [])

  const handleRowsPerPageChange = useCallback((rowsPerPage: number) => {
    setLimit(rowsPerPage)
    setPageNumber(0)
  }, [])

  const handleSort = useCallback((columnKey: string, direction: 'asc' | 'desc' | null) => {
    setSortColumn(direction ? columnKey : null)
    setReversed(direction === 'desc')
  }, [])

  const filters: FilterDef[] = useMemo(
    () => [
      {
        key: 'limit',
        label: `${t('fields.results_per_page')}:`,
        value: String(limit),
        options: LIMIT_OPTIONS.map((n) => ({ value: String(n), label: String(n) })),
        onChange: (v) => handleLimitChange(Number(v)),
        width: 100,
      },
    ],
    [t, limit, handleLimitChange],
  )

  const searchLabel = useMemo(
    () => `${t('placeholders.search_pattern', { defaultValue: 'Pattern' })}:`,
    [t],
  )
  const searchPlaceholder = useMemo(
    () => t('placeholders.search_pattern', { defaultValue: 'Search Pattern' }),
    [t],
  )

  const primaryAction = useMemo(
    () => ({
      label: t('messages.add_webhook', { defaultValue: 'Add Webhooks' }),
      icon: <Add sx={{ fontSize: 20 }} />,
      onClick: navigateToAddPage,
      disabled: !canWriteWebhooks,
    }),
    [t, navigateToAddPage, canWriteWebhooks],
  )

  const columns: ColumnDef<WebhookEntry>[] = useMemo(
    () => [
      {
        key: 'displayName',
        label: t('fields.name'),
        sortable: true,
        render: (_value, row) => (
          <GluuText
            variant="span"
            disableThemeColor
            style={{
              color: row.jansEnabled ? themeColors.fontColor : customColors.textSecondary,
              fontWeight: 500,
            }}
          >
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
          <GluuText
            variant="span"
            disableThemeColor
            style={{
              color: row.jansEnabled ? themeColors.fontColor : customColors.textSecondary,
              wordBreak: 'break-all',
              maxWidth: '350px',
              fontFamily: fontFamily,
            }}
          >
            {row.url}
          </GluuText>
        ),
      },
      {
        key: 'httpMethod',
        label: t('fields.http_method'),
        sortable: true,
        render: (_value, row) => (
          <Chip
            label={row.httpMethod}
            size="small"
            color={getHttpMethodColor(row.httpMethod || '')}
            variant="outlined"
            sx={
              row.jansEnabled
                ? {
                    'color': themeColors.fontColor,
                    'borderColor': themeColors.fontColor,
                    '& .MuiChip-label': { color: themeColors.fontColor },
                  }
                : undefined
            }
          />
        ),
      },
      {
        key: 'jansEnabled',
        label: t('fields.status'),
        sortable: true,
        render: (_value, row) => {
          const isEnabled = row.jansEnabled === true
          return (
            <Chip
              label={isEnabled ? t('options.enabled') : t('options.disabled')}
              size="small"
              sx={{
                minWidth: 80,
                fontWeight: 500,
                backgroundColor: darkThemeColors.background,
                color: darkThemeColors.fontColor,
                border: isEnabled
                  ? `1px solid ${lightThemeColors.borderColor}`
                  : `1px solid ${darkThemeColors.borderColor}`,
                opacity: isEnabled ? 1 : 0.6,
              }}
            />
          )
        },
      },
    ],
    [t, themeColors, darkThemeColors, lightThemeColors],
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
        icon: <Edit sx={{ fontSize: 18 }} />,
        tooltip: t('actions.edit'),
        id: 'editWebhook',
        onClick: navigateToEditPage,
      })
    }
    if (canDeleteWebhooks) {
      list.push({
        icon: <DeleteOutlined sx={{ fontSize: 18 }} />,
        tooltip: t('actions.delete'),
        id: 'deleteWebhook',
        onClick: (row) => {
          setDeleteData(row)
          toggle()
        },
      })
    }
    return list
  }, [canWriteWebhooks, canDeleteWebhooks, t, navigateToEditPage, toggle])

  const pagination: PaginationConfig = useMemo(
    () => ({
      page: pageNumber,
      rowsPerPage: limit,
      totalItems,
      rowsPerPageOptions: LIMIT_OPTIONS,
      onPageChange: handlePageChange,
      onRowsPerPageChange: handleRowsPerPageChange,
    }),
    [pageNumber, limit, totalItems, handlePageChange, handleRowsPerPageChange],
  )

  const getRowKey = useCallback((row: WebhookEntry) => row.inum ?? '', [])

  const emptyMessage = useMemo(() => {
    if (!pattern && totalItems === 0) {
      return t('messages.no_webhooks_found', { defaultValue: 'No webhooks found' })
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
                searchFieldWidth={SEARCH_FIELD_WIDTH}
                onSearch={setPattern}
                onSearchSubmit={handleSearchSubmit}
                filters={filters}
                onRefresh={canReadWebhooks ? handleRefresh : undefined}
                refreshLoading={isLoading}
                primaryAction={primaryAction}
                refreshButtonVariant="outlined"
              />
            </div>
          </div>

          <div className={classes.tableCard}>
            <GluuTable<WebhookEntry>
              columns={columns}
              data={webhooks}
              loading={false}
              pagination={pagination}
              actions={actions}
              sortColumn={sortColumn}
              sortDirection={reversed ? 'desc' : null}
              onSort={handleSort}
              getRowKey={getRowKey}
              emptyMessage={emptyMessage}
            />
          </div>
        </GluuViewWrapper>
        <GluuCommitDialog handler={toggle} modal={modal} onAccept={submitForm} />
      </div>
    </GluuLoader>
  )
}

export default memo(WebhookListPage)
