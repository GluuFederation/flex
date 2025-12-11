import React, { useState, useCallback, useMemo, useContext, useEffect, useRef } from 'react'
import MaterialTable from '@material-table/core'
import type { Column, Action } from '@material-table/core'
import { DeleteOutlined, Visibility } from '@mui/icons-material'
import {
  Paper,
  TablePagination,
  Box,
  TextField,
  IconButton,
  Button,
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import RefreshIcon from '@mui/icons-material/Refresh'
import SortIcon from '@mui/icons-material/Sort'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Badge } from 'reactstrap'
import { Card, CardBody } from 'Components'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useTranslation } from 'react-i18next'
import { useCedarling } from '@/cedarling'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import customColors from '@/customColors'
import { useQueryClient } from '@tanstack/react-query'
import { updateToast } from 'Redux/features/toastSlice'
import { triggerWebhook } from 'Plugins/admin/redux/features/WebhookSlice'
import {
  useGetOauthOpenidClients,
  useDeleteOauthOpenidClientByInum,
  getGetOauthOpenidClientsQueryKey,
  useGetOauthScopes,
} from 'JansConfigApi'
import type { Client, ClientTableRow } from './types'
import { useClientActions } from './hooks'
import ClientDetailView from './components/ClientDetailView'
import { formatGrantTypeLabel, truncateText } from './helper/utils'
import { CLIENT_ROUTES, DEFAULT_PAGE_SIZE } from './helper/constants'

interface DetailPanelProps {
  rowData: ClientTableRow
}

const FILTER_BOX_STYLES = {
  mb: '10px',
  p: 1,
  backgroundColor: customColors.white,
  borderRadius: 1,
  border: `1px solid ${customColors.lightGray}`,
} as const

const FILTER_CONTAINER_STYLES = {
  display: 'flex',
  gap: 2,
  alignItems: 'center',
  justifyContent: 'space-between',
} as const

const FILTER_ITEMS_STYLES = {
  display: 'flex',
  gap: 2,
  alignItems: 'center',
  flexWrap: 'wrap',
} as const

const ICON_BUTTON_STYLES = { color: customColors.lightBlue } as const

const TEXT_FIELD_WIDTH = { width: '300px' } as const

const ClientListPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useContext(ThemeContext)
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  const scopeInumFilter = useMemo(() => {
    const searchParams = new URLSearchParams(location.search)
    return searchParams.get('scopeInum')
  }, [location.search])

  const {
    hasCedarReadPermission,
    hasCedarWritePermission,
    hasCedarDeletePermission,
    authorizeHelper,
  } = useCedarling()
  const { logClientDeletion, navigateToClientAdd, navigateToClientEdit, navigateToClientView } =
    useClientActions()

  const getInitialPageSize = (): number => {
    const stored = localStorage.getItem('paggingSize')
    if (!stored) return DEFAULT_PAGE_SIZE
    const parsed = parseInt(stored, 10)
    return Number.isNaN(parsed) ? DEFAULT_PAGE_SIZE : parsed
  }

  const [limit, setLimit] = useState<number>(getInitialPageSize())
  const [pageNumber, setPageNumber] = useState<number>(0)
  const [searchInput, setSearchInput] = useState<string>('')
  const [pattern, setPattern] = useState<string | null>(null)
  const [startIndex, setStartIndex] = useState<number>(0)
  const [sortBy, setSortBy] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<'ascending' | 'descending'>('ascending')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const clientsQueryParams = useMemo(
    () => ({
      limit,
      pattern: pattern || undefined,
      startIndex,
      sortBy: sortBy || undefined,
      sortOrder: sortBy ? sortOrder : undefined,
    }),
    [limit, pattern, startIndex, sortBy, sortOrder],
  )

  const clientsQueryOptions = useMemo(
    () => ({
      query: {
        refetchOnMount: 'always' as const,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        staleTime: 30000,
      },
    }),
    [],
  )

  const {
    data: clientsResponse,
    isLoading,
    isFetching,
  } = useGetOauthOpenidClients(clientsQueryParams, clientsQueryOptions)

  const loading = isLoading || isFetching

  const handleDeleteSuccess = useCallback(
    (_data: unknown, variables: { inum: string }) => {
      dispatch(updateToast(true, 'success'))
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey[0] as string
          return queryKey === getGetOauthOpenidClientsQueryKey()[0]
        },
      })
      dispatch(triggerWebhook({ createdFeatureValue: { inum: variables.inum } }))
    },
    [dispatch, queryClient],
  )

  const handleDeleteError = useCallback(
    (error: Error) => {
      const errorMessage = error?.message || 'Failed to delete client'
      dispatch(updateToast(true, 'error', errorMessage))
    },
    [dispatch],
  )

  const deleteClient = useDeleteOauthOpenidClientByInum({
    mutation: {
      onSuccess: handleDeleteSuccess,
      onError: handleDeleteError,
    },
  })

  const { data: scopesData } = useGetOauthScopes({ limit: 200 }, { query: { staleTime: 60000 } })

  const scopesList = useMemo(() => {
    return (scopesData?.entries || []) as Array<{ dn?: string; id?: string; displayName?: string }>
  }, [scopesData?.entries])

  const clientResourceId = ADMIN_UI_RESOURCES.Clients

  const selectedTheme = useMemo(() => theme?.state?.theme || 'light', [theme?.state?.theme])

  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])

  const bgThemeColor = useMemo(
    () => ({ background: themeColors.background }),
    [themeColors.background],
  )

  const clientScopes = useMemo(
    () => CEDAR_RESOURCE_SCOPES[clientResourceId] || [],
    [clientResourceId],
  )

  const canReadClients = useMemo(
    () => hasCedarReadPermission(clientResourceId),
    [hasCedarReadPermission, clientResourceId],
  )

  const canWriteClients = useMemo(
    () => hasCedarWritePermission(clientResourceId),
    [hasCedarWritePermission, clientResourceId],
  )

  const canDeleteClients = useMemo(
    () => hasCedarDeletePermission(clientResourceId),
    [hasCedarDeletePermission, clientResourceId],
  )

  const clients = useMemo<ClientTableRow[]>(() => {
    const allClients = (clientsResponse?.entries || []) as ClientTableRow[]
    if (scopeInumFilter) {
      return allClients.filter((client) => {
        const clientScopes = client.scopes || []
        return clientScopes.some((scope) => {
          if (typeof scope === 'string') {
            return scope.includes(scopeInumFilter)
          }
          return false
        })
      })
    }
    return allClients
  }, [clientsResponse?.entries, scopeInumFilter])

  const totalItems = useMemo(
    () => clientsResponse?.totalEntriesCount || 0,
    [clientsResponse?.totalEntriesCount],
  )

  const tableOptions = useMemo(
    () => ({
      idSynonym: 'inum',
      search: false,
      selection: false,
      pageSize: limit,
      headerStyle: {
        ...applicationStyle.tableHeaderStyle,
        ...bgThemeColor,
        textTransform: applicationStyle.tableHeaderStyle.textTransform as
          | 'uppercase'
          | 'lowercase'
          | 'none'
          | 'capitalize'
          | undefined,
      },
      actionsColumnIndex: -1,
    }),
    [limit, bgThemeColor],
  )

  const toggleDeleteModal = useCallback(() => setDeleteModalOpen((prev) => !prev), [])

  const handlePatternChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchInput(event.target.value)
  }, [])

  const handlePatternKeyDown = useCallback(
    (event: React.KeyboardEvent): void => {
      if (event.key === 'Enter') {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current)
          debounceTimerRef.current = null
        }
        setPattern(searchInput || null)
        setPageNumber(0)
        setStartIndex(0)
      }
    },
    [searchInput],
  )

  const handleClearFilters = useCallback((): void => {
    setSearchInput('')
    setPattern(null)
    setSortBy('')
    setSortOrder('ascending')
    setPageNumber(0)
    setStartIndex(0)
    if (scopeInumFilter) {
      navigate(location.pathname, { replace: true })
    }
  }, [scopeInumFilter, navigate, location.pathname])

  const handleClearScopeFilter = useCallback((): void => {
    navigate(location.pathname, { replace: true })
  }, [navigate, location.pathname])

  // Get scope display name for the filter indicator
  const scopeFilterDisplayName = useMemo(() => {
    if (!scopeInumFilter) return null
    const scope = scopesList.find(
      (s) => s.dn?.includes(scopeInumFilter) || s.dn === scopeInumFilter,
    )
    return scope?.id || scope?.displayName || scopeInumFilter
  }, [scopeInumFilter, scopesList])

  const handleSortByChange = useCallback((event: SelectChangeEvent<string>): void => {
    setSortBy(event.target.value)
    setPageNumber(0)
    setStartIndex(0)
  }, [])

  const handleSortOrderChange = useCallback((event: SelectChangeEvent<string>): void => {
    setSortOrder(event.target.value as 'ascending' | 'descending')
    setPageNumber(0)
    setStartIndex(0)
  }, [])

  const handleRefresh = useCallback((): void => {
    setStartIndex(0)
    setPageNumber(0)
    queryClient.invalidateQueries({
      predicate: (query) => {
        const queryKey = query.queryKey[0] as string
        return queryKey === getGetOauthOpenidClientsQueryKey()[0]
      },
    })
  }, [queryClient])

  const handleGoToClientAddPage = useCallback(() => {
    navigateToClientAdd()
  }, [navigateToClientAdd])

  const handleGoToClientEditPage = useCallback(
    (row: ClientTableRow) => {
      if (row.inum) {
        navigateToClientEdit(row.inum)
      }
    },
    [navigateToClientEdit],
  )

  const handleGoToClientViewPage = useCallback(
    (row: ClientTableRow) => {
      if (row.inum) {
        navigateToClientView(row.inum)
      }
    },
    [navigateToClientView],
  )

  const handleClientDelete = useCallback(
    (row: ClientTableRow) => {
      setSelectedClient(row as Client)
      toggleDeleteModal()
    },
    [toggleDeleteModal],
  )

  const onDeletionConfirmed = useCallback(
    async (message: string) => {
      if (!selectedClient?.inum) return

      try {
        await deleteClient.mutateAsync({ inum: selectedClient.inum })
        await logClientDeletion(selectedClient, message)
        toggleDeleteModal()
      } catch (error) {
        console.error('Error deleting client:', error)
      }
    },
    [selectedClient, deleteClient, logClientDeletion, toggleDeleteModal],
  )

  const onPageChangeClick = useCallback(
    (page: number): void => {
      const newStartIndex = page * limit
      setStartIndex(newStartIndex)
      setPageNumber(page)
    },
    [limit],
  )

  const onRowCountChangeClick = useCallback((count: number): void => {
    setStartIndex(0)
    setPageNumber(0)
    setLimit(count)
  }, [])

  const handleEditClick = useCallback(
    (data: ClientTableRow | ClientTableRow[]) => {
      if (data && !Array.isArray(data)) {
        handleGoToClientEditPage(data)
      }
    },
    [handleGoToClientEditPage],
  )

  const handleDeleteClick = useCallback(
    (data: ClientTableRow | ClientTableRow[]) => {
      if (data && !Array.isArray(data)) {
        handleClientDelete(data)
      }
    },
    [handleClientDelete],
  )

  const DeleteIcon = () => <DeleteOutlined sx={{ color: 'error.main' }} />

  const detailPanel = useCallback(
    (props: DetailPanelProps): React.ReactElement => (
      <ClientDetailView client={props.rowData as Client} scopes={scopesList} />
    ),
    [scopesList],
  )

  const PaperContainer = useCallback(
    (props: React.ComponentProps<typeof Paper>) => <Paper {...props} elevation={0} />,
    [],
  )

  const handlePageChange = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
      onPageChangeClick(page)
    },
    [onPageChangeClick],
  )

  const handleRowsPerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onRowCountChangeClick(parseInt(event.target.value, 10))
    },
    [onRowCountChangeClick],
  )

  const PaginationComponent = useCallback(
    () => (
      <TablePagination
        count={totalItems}
        page={pageNumber}
        onPageChange={handlePageChange}
        rowsPerPage={limit}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    ),
    [totalItems, pageNumber, handlePageChange, limit, handleRowsPerPageChange],
  )

  const renderGrantTypesColumn = useCallback((rowData: ClientTableRow) => {
    const grants = rowData.grantTypes || []
    if (grants.length === 0) return '-'
    const displayGrants = grants.slice(0, 2)
    const remaining = grants.length - 2
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {displayGrants.map((grant, index) => (
          <Chip
            key={index}
            label={formatGrantTypeLabel(grant)}
            size="small"
            sx={{ backgroundColor: '#fff3e0', fontSize: '0.7rem' }}
          />
        ))}
        {remaining > 0 && <Chip label={`+${remaining}`} size="small" sx={{ fontSize: '0.7rem' }} />}
      </Box>
    )
  }, [])

  const renderStatusColumn = useCallback(
    (rowData: ClientTableRow) => (
      <Badge color={rowData.disabled ? `danger-${selectedTheme}` : `primary-${selectedTheme}`}>
        {rowData.disabled ? t('fields.disabled') : t('fields.active')}
      </Badge>
    ),
    [selectedTheme, t],
  )

  const tableColumns = useMemo<Column<ClientTableRow>[]>(
    () => [
      {
        title: t('fields.client_name'),
        field: 'clientName',
        render: (rowData) => truncateText(rowData.clientName || rowData.displayName || '-', 30),
      },
      {
        title: t('fields.application_type'),
        field: 'applicationType',
        render: (rowData) => rowData.applicationType || '-',
      },
      {
        title: t('fields.grant_types'),
        field: 'grantTypes',
        render: renderGrantTypesColumn,
      },
      {
        title: t('fields.status'),
        field: 'disabled',
        render: renderStatusColumn,
      },
    ],
    [t, renderGrantTypesColumn, renderStatusColumn],
  )

  const handleViewClick = useCallback(
    (data: ClientTableRow | ClientTableRow[]) => {
      if (data && !Array.isArray(data)) {
        handleGoToClientViewPage(data)
      }
    },
    [handleGoToClientViewPage],
  )

  const ViewIcon = useCallback(
    () => <Visibility sx={{ color: themeColors?.background }} />,
    [themeColors?.background],
  )

  const myActions = useMemo<
    Array<Action<ClientTableRow> | ((rowData: ClientTableRow) => Action<ClientTableRow>)>
  >(() => {
    const actions: Array<
      Action<ClientTableRow> | ((rowData: ClientTableRow) => Action<ClientTableRow>)
    > = []

    if (canWriteClients) {
      actions.push((rowData: ClientTableRow) => ({
        icon: 'edit',
        iconProps: {
          id: `editClient${rowData.inum}`,
        },
        tooltip: t('messages.edit_client'),
        onClick: (_event, data) => handleEditClick(data),
        disabled: !canWriteClients,
      }))
      actions.push({
        icon: 'add',
        tooltip: t('messages.add_client'),
        iconProps: { color: 'primary', style: { color: customColors.lightBlue } },
        isFreeAction: true,
        onClick: handleGoToClientAddPage,
        disabled: !canWriteClients,
      })
    }

    if (canReadClients) {
      actions.push((rowData: ClientTableRow) => ({
        icon: ViewIcon,
        iconProps: {
          id: `viewClient${rowData.inum}`,
        },
        tooltip: t('messages.view_client'),
        onClick: (_event, data) => handleViewClick(data),
        disabled: !canReadClients,
      }))
    }

    if (canDeleteClients) {
      actions.push((rowData: ClientTableRow) => ({
        icon: DeleteIcon,
        iconProps: {
          color: 'secondary',
          id: `deleteClient${rowData.inum}`,
        },
        tooltip: t('messages.delete_client'),
        onClick: (_event, data) => handleDeleteClick(data),
        disabled: !canDeleteClients,
      }))
    }

    return actions
  }, [
    canReadClients,
    canWriteClients,
    canDeleteClients,
    t,
    handleViewClick,
    handleEditClick,
    handleGoToClientAddPage,
    handleDeleteClick,
    ViewIcon,
  ])

  const tableComponents = useMemo(
    () => ({
      Container: PaperContainer,
      Pagination: PaginationComponent,
    }),
    [PaperContainer, PaginationComponent],
  )

  SetTitle(t('titles.openid_connect_clients'))

  useEffect(() => {
    authorizeHelper(clientScopes)
  }, [authorizeHelper, clientScopes])

  useEffect(() => {
    debounceTimerRef.current = setTimeout(() => {
      setPattern(searchInput || null)
      if (searchInput !== (pattern || '')) {
        setPageNumber(0)
        setStartIndex(0)
      }
      debounceTimerRef.current = null
    }, 500)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
        debounceTimerRef.current = null
      }
    }
  }, [searchInput, pattern])

  return (
    <GluuLoader blocking={loading}>
      <Card style={applicationStyle.mainCard}>
        <CardBody>
          <GluuViewWrapper canShow={canReadClients}>
            <Box sx={FILTER_BOX_STYLES}>
              <Box sx={FILTER_CONTAINER_STYLES}>
                <Box sx={FILTER_ITEMS_STYLES}>
                  <TextField
                    size="small"
                    placeholder={t('placeholders.search_clients')}
                    name="pattern"
                    value={searchInput}
                    onChange={handlePatternChange}
                    onKeyDown={handlePatternKeyDown}
                    sx={TEXT_FIELD_WIDTH}
                    inputProps={{ 'aria-label': t('placeholders.search_clients') }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon
                            fontSize="small"
                            sx={{ color: customColors.lightBlue, pointerEvents: 'none' }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {scopeFilterDisplayName && (
                    <Chip
                      label={`${t('fields.scope')}: ${scopeFilterDisplayName}`}
                      onDelete={handleClearScopeFilter}
                      color="primary"
                      size="small"
                      sx={{
                        backgroundColor: themeColors?.background,
                        color: 'white',
                      }}
                    />
                  )}

                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel id="sort-by-label">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <SortIcon fontSize="small" />
                        {t('fields.sort_by')}
                      </Box>
                    </InputLabel>
                    <Select
                      labelId="sort-by-label"
                      value={sortBy}
                      onChange={handleSortByChange}
                      label={t('fields.sort_by')}
                    >
                      <MenuItem value="">{t('options.none')}</MenuItem>
                      <MenuItem value="displayName">{t('fields.displayname')}</MenuItem>
                      <MenuItem value="inum">{t('fields.client_id')}</MenuItem>
                    </Select>
                  </FormControl>

                  {sortBy && (
                    <FormControl size="small" sx={{ minWidth: 130 }}>
                      <InputLabel id="sort-order-label">{t('fields.sort_order')}</InputLabel>
                      <Select
                        labelId="sort-order-label"
                        value={sortOrder}
                        onChange={handleSortOrderChange}
                        label={t('fields.sort_order')}
                      >
                        <MenuItem value="ascending">{t('options.ascending')}</MenuItem>
                        <MenuItem value="descending">{t('options.descending')}</MenuItem>
                      </Select>
                    </FormControl>
                  )}

                  <Button
                    size="small"
                    startIcon={<ClearIcon />}
                    onClick={handleClearFilters}
                    aria-label={t('tooltips.clear_filters')}
                    sx={ICON_BUTTON_STYLES}
                  >
                    {t('actions.clear')}
                  </Button>
                </Box>

                <IconButton
                  size="small"
                  onClick={handleRefresh}
                  title={t('tooltips.refresh_data')}
                  aria-label={t('tooltips.refresh_data')}
                  sx={ICON_BUTTON_STYLES}
                >
                  <RefreshIcon />
                </IconButton>
              </Box>
            </Box>

            <MaterialTable
              key={limit || 0}
              components={tableComponents}
              columns={tableColumns}
              data={clients}
              isLoading={loading}
              title=""
              actions={myActions}
              options={tableOptions}
              detailPanel={detailPanel}
            />
          </GluuViewWrapper>
          {canDeleteClients && selectedClient && (
            <GluuDialog
              row={selectedClient}
              name={selectedClient.clientName || selectedClient.displayName || selectedClient.inum}
              handler={toggleDeleteModal}
              modal={deleteModalOpen}
              subject="openid connect client"
              onAccept={onDeletionConfirmed}
              feature={adminUiFeatures.oidc_clients_delete}
            />
          )}
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default ClientListPage
