import React, { useEffect, useState, useContext, useCallback, useMemo, useRef } from 'react'
import MaterialTable from '@material-table/core'
import {
  DeleteOutlined,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  SwapVert as SwapVertIcon,
  Clear as ClearIcon,
} from '@mui/icons-material'
import {
  Paper,
  TablePagination,
  Box,
  TextField,
  IconButton,
  InputAdornment,
  MenuItem,
  Button,
} from '@mui/material'
import customColors from '@/customColors'
import { Card, CardBody } from 'Components'
import { useCedarling } from '@/cedarling'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { WEBHOOK_WRITE, WEBHOOK_READ, WEBHOOK_DELETE, buildPayload } from 'Utils/PermChecker'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import SetTitle from 'Utils/SetTitle'
import { useNavigate } from 'react-router'
import { useGetAllWebhooks, useDeleteWebhookByInum, getGetAllWebhooksQueryKey } from 'JansConfigApi'
import type { WebhookEntry, TableAction, WebhookTableColumn, PagedResult } from './types'
import { postUserAction } from 'Redux/api/backend-api'
import { addAdditionalData } from 'Utils/TokenController'
import { DELETION } from '@/audit/UserActionType'
import { useQueryClient } from '@tanstack/react-query'
import { updateToast } from 'Redux/features/toastSlice'

interface RootState {
  authReducer: {
    config: { clientId: string }
    location: { IPv4: string }
    userinfo: { name: string; inum: string }
    token: { access_token: string }
  }
  cedarPermissions: {
    permissions: Record<string, boolean>
  }
}

interface ThemeState {
  state: {
    theme: string
  }
}

const DEFAULT_PAGE_SIZE = 10
const MAX_PAGE_SIZE = 100
const MIN_PAGE_SIZE = 1

const getErrorMessage = (
  error: Error,
  defaultMessage: string,
  t: (key: string) => string,
): string => {
  const errorWithResponse = error as Error & {
    response?: { body?: { responseMessage?: string }; status?: number }
  }

  const status = errorWithResponse.response?.status
  const responseMessage = errorWithResponse.response?.body?.responseMessage

  if (status === 400) {
    return responseMessage || t('messages.bad_request')
  } else if (status === 401) {
    return t('messages.unauthorized')
  } else if (status === 403) {
    return t('messages.forbidden')
  } else if (status === 404) {
    return t('messages.not_found')
  } else if (status === 409) {
    return responseMessage || t('messages.conflict')
  } else if (status && status >= 500) {
    return t('messages.server_error')
  }

  return responseMessage || error.message || defaultMessage
}

const WebhookListPage: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { hasCedarPermission, authorize } = useCedarling()
  const { t } = useTranslation()
  const [pageNumber, setPageNumber] = useState(0)
  const { permissions: cedarPermissions } = useSelector(
    (state: RootState) => state.cedarPermissions,
  )

  const PaperContainer = useCallback(
    (props: React.ComponentProps<typeof Paper>) => <Paper {...props} elevation={0} />,
    [],
  )

  const theme = useContext(ThemeContext) as ThemeState
  const themeColors = getThemeColor(theme.state.theme)
  const bgThemeColor = { background: themeColors.background }
  SetTitle(t('titles.webhooks'))

  const authData = useSelector((state: RootState) => ({
    clientId: state.authReducer.config.clientId,
    ipAddress: state.authReducer.location.IPv4,
    userinfo: state.authReducer.userinfo,
    token: state.authReducer.token.access_token,
  }))

  const [modal, setModal] = useState(false)
  const [deleteData, setDeleteData] = useState<WebhookEntry | null>(null)
  const toggle = (): void => setModal((prev) => !prev)
  const userMessageRef = useRef<string>('')

  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE)
  const [pattern, setPattern] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string | undefined>(undefined)
  const [sortOrder, setSortOrder] = useState<'ascending' | 'descending'>('ascending')

  const {
    data: webhooksResponse,
    isLoading,
    refetch,
  } = useGetAllWebhooks({
    limit,
    pattern: pattern || undefined,
    startIndex: pageNumber * limit,
    sortBy: sortBy || undefined,
    sortOrder: sortBy ? sortOrder : undefined,
  })

  const webhooksData = webhooksResponse as PagedResult | undefined
  const webhooks = (webhooksData?.entries as unknown as WebhookEntry[]) || []
  const totalItems = webhooksData?.totalEntriesCount || 0

  const deleteWebhookMutation = useDeleteWebhookByInum({
    mutation: {
      onSuccess: async (data, variables) => {
        const audit = {
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
          client_id: authData.clientId,
          ip_address: authData.ipAddress,
          status: 'success',
          performedBy: {
            user_inum: authData.userinfo.inum,
            userId: authData.userinfo.name,
          },
        }

        const payload = {
          action: {
            action_message: userMessageRef.current,
            action_data: { inum: variables.webhookId },
          },
        }

        addAdditionalData(audit, DELETION, 'webhook', payload)

        try {
          await postUserAction(audit)
        } catch (auditError) {
          console.error('Audit logging failed:', auditError)
        }

        dispatch(updateToast(true, 'success'))

        await queryClient.invalidateQueries({ queryKey: getGetAllWebhooksQueryKey() })
      },
      onError: (error: Error) => {
        const errorMessage = getErrorMessage(error, 'Failed to delete webhook', t)
        dispatch(updateToast(true, 'error', errorMessage))
      },
    },
  })

  const submitForm = (userMessage: string): void => {
    if (!deleteData?.inum) return

    userMessageRef.current = userMessage

    toggle()
    deleteWebhookMutation.mutate({ webhookId: deleteData.inum })
  }

  useEffect(() => {
    const initPermissions = async (): Promise<void> => {
      const permissions = [WEBHOOK_READ, WEBHOOK_WRITE, WEBHOOK_DELETE]
      for (const permission of permissions) {
        await authorize([permission])
      }
    }
    initPermissions()
  }, [authorize])

  const handlePatternChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setPattern(event.target.value)
  }, [])

  const handlePatternKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        refetch()
      }
    },
    [refetch],
  )

  const handleSortByChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSortBy(value === 'none' ? undefined : value)
    setPageNumber(0)
  }, [])

  const handleSortOrderToggle = useCallback(() => {
    setSortOrder((prevOrder) => (prevOrder === 'ascending' ? 'descending' : 'ascending'))
  }, [])

  const handleClearFilters = useCallback(() => {
    setPattern(null)
    setSortBy(undefined)
    setSortOrder('ascending')
    setPageNumber(0)
  }, [])

  const onPageChangeClick = (page: number): void => {
    const maxPage = Math.max(0, Math.ceil(totalItems / limit) - 1)
    const validPage = Math.min(Math.max(0, page), maxPage)
    setPageNumber(validPage)
  }

  const onRowCountChangeClick = (count: number): void => {
    const validCount = Math.max(MIN_PAGE_SIZE, Math.min(count, MAX_PAGE_SIZE))
    setPageNumber(0)
    setLimit(validCount)
  }

  const PaginationWrapper = useCallback(
    () => (
      <TablePagination
        count={totalItems}
        page={pageNumber}
        onPageChange={(_, page) => {
          onPageChangeClick(page)
        }}
        rowsPerPage={limit}
        onRowsPerPageChange={(event) => onRowCountChangeClick(Number(event.target.value))}
      />
    ),
    [pageNumber, totalItems, limit],
  )

  const navigateToAddPage = useCallback(() => {
    navigate('/adm/webhook/add')
  }, [navigate])

  const navigateToEditPage = useCallback(
    (webhook: WebhookEntry) => {
      navigate(`/adm/webhook/edit/${webhook.inum}`, { state: { webhook } })
    },
    [navigate],
  )

  const myActions = useMemo<Array<TableAction | ((rowData: WebhookEntry) => TableAction)>>(() => {
    const actions: Array<TableAction | ((rowData: WebhookEntry) => TableAction)> = []

    const canWrite = hasCedarPermission(WEBHOOK_WRITE)
    const canDelete = hasCedarPermission(WEBHOOK_DELETE)

    if (canWrite) {
      actions.push({
        icon: 'add',
        tooltip: `${t('messages.add_webhook')}`,
        iconProps: { color: 'primary', style: { color: customColors.lightBlue } },
        isFreeAction: true,
        onClick: navigateToAddPage,
      })

      actions.push((rowData: WebhookEntry) => ({
        icon: 'edit',
        tooltip: `${t('messages.edit')}`,
        iconProps: {
          color: 'primary',
          id: 'editWebhook' + rowData.inum,
          style: { color: customColors.darkGray },
        },
        onClick: (_: React.MouseEvent, rowData: WebhookEntry | WebhookEntry[]) => {
          if (!Array.isArray(rowData)) {
            navigateToEditPage(rowData)
          }
        },
        disabled: !canWrite,
      }))
    }

    if (canDelete) {
      actions.push((rowData: WebhookEntry) => ({
        icon: () => <DeleteOutlined />,
        tooltip: `${t('messages.delete')}`,
        iconProps: {
          style: { color: customColors.darkGray },
          id: 'deleteWebhook' + rowData.inum,
        },
        onClick: (_: React.MouseEvent, rowData: WebhookEntry | WebhookEntry[]) => {
          if (!Array.isArray(rowData)) {
            setDeleteData(rowData)
            toggle()
          }
        },
        disabled: false,
      }))
    }

    return actions
  }, [cedarPermissions, t, navigateToAddPage, navigateToEditPage, hasCedarPermission])

  const columns: WebhookTableColumn[] = useMemo(
    () => [
      {
        title: `${t('fields.name')}`,
        field: 'displayName',
      },
      {
        title: `${t('fields.url')}`,
        field: 'url',
        width: '40%',
        render: (rowData: WebhookEntry) => (
          <div style={{ wordWrap: 'break-word', maxWidth: '420px' }}>{rowData.url}</div>
        ),
      },
      { title: `${t('fields.http_method')}`, field: 'httpMethod' },
      { title: `${t('fields.enabled')}`, field: 'jansEnabled' },
    ],
    [t],
  )

  return (
    <GluuLoader blocking={isLoading || deleteWebhookMutation.isPending}>
      <Card style={applicationStyle.mainCard}>
        <CardBody>
          <GluuViewWrapper canShow={hasCedarPermission(WEBHOOK_READ)}>
            <Box
              sx={{
                mb: '10px',
                p: 1,
                backgroundColor: '#fff',
                borderRadius: 1,
                border: '1px solid #e0e0e0',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <TextField
                    size="small"
                    placeholder={t('placeholders.search_pattern')}
                    value={pattern ?? ''}
                    onChange={handlePatternChange}
                    onKeyDown={handlePatternKeyDown}
                    sx={{ width: '250px' }}
                    aria-label={t('placeholders.search_pattern')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" sx={{ color: customColors.lightBlue }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    select
                    size="small"
                    value={sortBy || 'none'}
                    onChange={handleSortByChange}
                    sx={{ width: '180px' }}
                    label={t('fields.sort_by')}
                    aria-label={t('fields.sort_by')}
                  >
                    <MenuItem value="none">{t('options.none')}</MenuItem>
                    <MenuItem value="displayName">{t('fields.displayname')}</MenuItem>
                    <MenuItem value="url">{t('fields.url')}</MenuItem>
                    <MenuItem value="httpMethod">{t('fields.http_method')}</MenuItem>
                    <MenuItem value="jansEnabled">{t('fields.enabled')}</MenuItem>
                  </TextField>

                  {sortBy && sortBy !== 'none' && (
                    <IconButton
                      size="small"
                      onClick={handleSortOrderToggle}
                      title={
                        sortOrder === 'ascending' ? t('options.ascending') : t('options.descending')
                      }
                      aria-label={
                        sortOrder === 'ascending' ? t('options.ascending') : t('options.descending')
                      }
                      sx={{
                        'color': customColors.lightBlue,
                        '&:hover': {
                          backgroundColor: 'rgba(0, 123, 255, 0.08)',
                        },
                      }}
                    >
                      <SwapVertIcon />
                    </IconButton>
                  )}

                  <Button
                    size="small"
                    startIcon={<ClearIcon />}
                    onClick={handleClearFilters}
                    aria-label={t('tooltips.clear_filters')}
                    sx={{
                      'textTransform': 'none',
                      'color': customColors.lightBlue,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 123, 255, 0.08)',
                      },
                    }}
                  >
                    {t('actions.clear')}
                  </Button>
                </Box>

                <IconButton
                  onClick={() => {
                    setPageNumber(0)
                    refetch()
                  }}
                  size="small"
                  sx={{
                    'color': customColors.lightBlue,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 123, 255, 0.08)',
                    },
                  }}
                  title={t('messages.refresh')}
                  aria-label={t('messages.refresh')}
                >
                  <RefreshIcon />
                </IconButton>
              </Box>
            </Box>

            <MaterialTable
              components={{
                Container: PaperContainer,
                Pagination: PaginationWrapper,
              }}
              columns={columns}
              data={webhooks}
              isLoading={isLoading}
              title=""
              actions={myActions as never[]}
              options={{
                idSynonym: 'inum',
                search: false,
                searchFieldAlignment: 'left',
                selection: false,
                pageSize: limit,
                rowStyle: (rowData: WebhookEntry) => ({
                  backgroundColor: rowData.jansEnabled ? customColors.logo : customColors.white,
                }),
                headerStyle: {
                  ...(applicationStyle.tableHeaderStyle as React.CSSProperties),
                  ...bgThemeColor,
                },
                actionsColumnIndex: -1,
              }}
            />
          </GluuViewWrapper>
        </CardBody>
        <GluuCommitDialog handler={toggle} modal={modal} onAccept={submitForm} />
      </Card>
    </GluuLoader>
  )
}

export default WebhookListPage
