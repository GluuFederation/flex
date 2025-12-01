import React, { useEffect, useState, useContext, useCallback, useMemo, memo } from 'react'
import MaterialTable from '@material-table/core'
import { DeleteOutlined, Edit, Refresh, Add } from '@mui/icons-material'
import {
  Paper,
  TablePagination,
  Chip,
  Skeleton,
  Box,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material'
import customColors from '@/customColors'
import { Card, CardBody } from 'Components'
import { useCedarling } from '@/cedarling'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { ThemeContext, ThemeContextType } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import SetTitle from 'Utils/SetTitle'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { setSelectedWebhook } from 'Plugins/admin/redux/features/WebhookSlice'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { useGetAllWebhooks } from 'JansConfigApi'
import { useDeleteWebhookWithAudit } from './hooks'
import WebhookSearch from './WebhookSearch'
import type { WebhookEntry, TableAction } from './types'

const EmptyState: React.FC = () => {
  const { t } = useTranslation()
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={8}
      px={4}
    >
      <Typography variant="h6" color="textSecondary" gutterBottom>
        {t('messages.no_webhooks_found', { defaultValue: 'No webhooks found' })}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {t('messages.create_first_webhook', {
          defaultValue: 'Create your first webhook to get started',
        })}
      </Typography>
    </Box>
  )
}

const LoadingSkeleton: React.FC = () => (
  <Box p={2}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Skeleton key={i} variant="rectangular" height={50} sx={{ mb: 1, borderRadius: 1 }} />
    ))}
  </Box>
)

const getHttpMethodColor = (
  method: string,
): 'info' | 'success' | 'error' | 'warning' | 'default' => {
  const colorMap: Record<string, 'info' | 'success' | 'error' | 'warning'> = {
    GET: 'info',
    POST: 'success',
    DELETE: 'error',
  }
  return colorMap[method] || 'warning'
}

const EditIcon: React.FC<React.ComponentProps<typeof Edit>> = (props) => <Edit {...props} />
const DeleteIcon: React.FC<React.ComponentProps<typeof DeleteOutlined>> = (props) => (
  <DeleteOutlined {...props} style={{ color: 'red', ...props.style }} />
)
const PaperContainer = (props: React.ComponentProps<typeof Paper>) => (
  <Paper {...props} elevation={0} />
)

interface PaginationWrapperProps {
  count: number
  page: number
  rowsPerPage: number
  onPageChange: (page: number) => void
  onRowsPerPageChange: (count: number) => void
}

const PaginationWrapper: React.FC<PaginationWrapperProps> = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => (
  <TablePagination
    count={count}
    page={page}
    onPageChange={(_, p) => onPageChange(p)}
    rowsPerPage={rowsPerPage}
    onRowsPerPageChange={(e) => onRowsPerPageChange(Number(e.target.value))}
  />
)

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
  const [pageNumber, setPageNumber] = useState(0)
  const [limit, setLimit] = useState(10)
  const [pattern, setPattern] = useState('')
  const [sortBy, setSortBy] = useState('displayName')
  const [sortOrder, setSortOrder] = useState<'ascending' | 'descending'>('ascending')
  const [modal, setModal] = useState(false)
  const [deleteData, setDeleteData] = useState<WebhookEntry | null>(null)

  const theme = useContext(ThemeContext) as ThemeContextType
  const themeColors = getThemeColor(theme.state.theme)
  const bgThemeColor = { background: themeColors.background }
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
      sortBy,
      sortOrder,
    },
    {
      query: {
        enabled: canReadWebhooks,
      },
    },
  )

  const webhooks = useMemo(() => (data?.entries || []) as unknown as WebhookEntry[], [data])
  const totalItems = useMemo(() => data?.totalEntriesCount || 0, [data])

  // Clamp pageNumber when it becomes out of range (e.g., after deleting the last item on the last page)
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

  const handlePatternChange = useCallback((newPattern: string) => {
    setPattern(newPattern)
    setPageNumber(0)
  }, [])

  const handleSortByChange = useCallback((newSortBy: string) => {
    setSortBy(newSortBy)
    setPageNumber(0)
  }, [])

  const handleSortOrderChange = useCallback((newSortOrder: 'ascending' | 'descending') => {
    setSortOrder(newSortOrder)
    setPageNumber(0)
  }, [])

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit)
    setPageNumber(0)
  }, [])

  const handleRefresh = useCallback(() => {
    refetch()
  }, [refetch])

  const onPageChangeClick = useCallback((page: number) => {
    setPageNumber(page)
  }, [])

  const TablePaginationComponent = useMemo(
    () => () => (
      <PaginationWrapper
        count={totalItems}
        page={pageNumber}
        rowsPerPage={limit}
        onPageChange={onPageChangeClick}
        onRowsPerPageChange={handleLimitChange}
      />
    ),
    [totalItems, pageNumber, limit, onPageChangeClick, handleLimitChange],
  )

  const rowActions = useMemo(() => {
    const actions: ((rowData: WebhookEntry) => TableAction)[] = []

    if (canWriteWebhooks) {
      actions.push((rowData: WebhookEntry) => ({
        icon: EditIcon,
        tooltip: t('actions.edit'),
        iconProps: {
          color: 'primary',
          id: 'editWebhook' + rowData.inum,
          style: { color: customColors.darkGray },
        },
        onClick: () => navigateToEditPage(rowData),
        disabled: false,
      }))
    }

    if (canDeleteWebhooks) {
      actions.push((rowData: WebhookEntry) => ({
        icon: DeleteIcon,
        tooltip: t('actions.delete'),
        iconProps: {
          id: 'deleteWebhook' + rowData.inum,
        },
        onClick: () => {
          setDeleteData(rowData)
          toggle()
        },
        disabled: false,
      }))
    }

    return actions
  }, [canWriteWebhooks, canDeleteWebhooks, t, navigateToEditPage, toggle])

  const columns = useMemo(
    () => [
      {
        title: t('fields.name'),
        field: 'displayName',
        render: (rowData: WebhookEntry) => (
          <Typography
            variant="body2"
            fontWeight={500}
            sx={{ color: rowData.jansEnabled ? 'black !important' : 'gray !important' }}
          >
            {rowData.displayName}
          </Typography>
        ),
      },
      {
        title: t('fields.url'),
        field: 'url',
        width: '35%',
        render: (rowData: WebhookEntry) => (
          <Typography
            variant="body2"
            sx={{
              color: rowData.jansEnabled ? 'black !important' : 'gray !important',
              wordBreak: 'break-all',
              maxWidth: '350px',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
            }}
          >
            {rowData.url}
          </Typography>
        ),
      },
      {
        title: t('fields.http_method'),
        field: 'httpMethod',
        render: (rowData: WebhookEntry) => (
          <Chip
            label={rowData.httpMethod}
            size="small"
            color={getHttpMethodColor(rowData.httpMethod || '')}
            variant="outlined"
          />
        ),
      },
      {
        title: t('fields.status'),
        field: 'jansEnabled',
        render: (rowData: WebhookEntry) => (
          <Chip
            label={rowData.jansEnabled ? t('options.enabled') : t('options.disabled')}
            size="small"
            sx={
              rowData.jansEnabled
                ? {
                    backgroundColor: themeColors.background,
                    color: customColors.white,
                  }
                : undefined
            }
            color={rowData.jansEnabled ? undefined : 'default'}
            variant={rowData.jansEnabled ? 'filled' : 'outlined'}
          />
        ),
      },
    ],
    [t, themeColors],
  )

  const renderTableContent = useCallback(() => {
    if (isLoading || isDeleting) {
      return <LoadingSkeleton />
    }

    if (!pattern && totalItems === 0) {
      return <EmptyState />
    }

    return (
      <MaterialTable
        components={{
          Container: PaperContainer,
          Pagination: TablePaginationComponent,
        }}
        columns={columns}
        data={webhooks}
        isLoading={isLoading}
        title=""
        actions={rowActions}
        options={{
          idSynonym: 'inum',
          search: false,
          searchFieldAlignment: 'left',
          selection: false,
          pageSize: limit,
          rowStyle: (rowData: WebhookEntry) => ({
            backgroundColor: rowData?.jansEnabled
              ? themeColors.lightBackground
              : customColors.white,
          }),
          headerStyle: {
            ...(applicationStyle.tableHeaderStyle as React.CSSProperties),
            ...bgThemeColor,
          },
          actionsColumnIndex: -1,
        }}
      />
    )
  }, [
    isLoading,
    isDeleting,
    webhooks,
    pattern,
    totalItems,
    TablePaginationComponent,
    columns,
    rowActions,
    limit,
    themeColors,
    bgThemeColor,
  ])

  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <GluuViewWrapper canShow={canReadWebhooks}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
            flexWrap="wrap"
            gap={2}
          >
            <WebhookSearch
              pattern={pattern}
              sortBy={sortBy}
              sortOrder={sortOrder}
              limit={limit}
              onPatternChange={handlePatternChange}
              onSortByChange={handleSortByChange}
              onSortOrderChange={handleSortOrderChange}
              onLimitChange={handleLimitChange}
            />
            <Box display="flex" gap={1}>
              {canReadWebhooks && (
                <Tooltip title={t('messages.refresh')}>
                  <IconButton onClick={handleRefresh} color="primary">
                    <Refresh />
                  </IconButton>
                </Tooltip>
              )}
              {canWriteWebhooks && (
                <Tooltip title={t('messages.add_webhook')}>
                  <IconButton onClick={navigateToAddPage} color="primary">
                    <Add />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>

          {renderTableContent()}
        </GluuViewWrapper>
      </CardBody>
      <GluuCommitDialog handler={toggle} modal={modal} onAccept={submitForm} />
    </Card>
  )
}

export default memo(WebhookListPage)
