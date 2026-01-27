import React, { useState, useEffect, useContext, useCallback, useMemo, useRef } from 'react'
import MaterialTable from '@material-table/core'
import type { Column, Action } from '@material-table/core'
import { DeleteOutlined } from '@mui/icons-material'
import {
  Paper,
  TablePagination,
  Box,
  TextField,
  MenuItem,
  IconButton,
  Button,
  InputAdornment,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import ClearIcon from '@mui/icons-material/Clear'
import RefreshIcon from '@mui/icons-material/Refresh'
import { useDispatch } from 'react-redux'
import { Badge } from 'reactstrap'
import { Link } from 'react-router-dom'
import { Card, CardBody } from 'Components'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import ScopeDetailPage from './ScopeDetailPage'
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
  useGetOauthScopes,
  useDeleteOauthScopesByInum,
  getGetOauthScopesQueryKey,
} from 'JansConfigApi'
import type { Scope } from 'JansConfigApi'
import type { ScopeWithClients, ScopeTableRow } from './types'
import { useScopeActions } from './hooks'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { DEFAULT_THEME } from '@/context/theme/constants'

interface DetailPanelProps {
  rowData: ScopeTableRow
}

const FILTER_BOX_STYLES = {
  mb: '10px',
  p: 1,
  backgroundColor: customColors.white,
  borderRadius: 1,
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

const TEXT_FIELD_WIDTH = { width: '250px' } as const

const SELECT_FIELD_WIDTH = { width: '180px' } as const

const ScopeListPage: React.FC = () => {
  const { t } = useTranslation()
  const { navigateToRoute } = useAppNavigation()
  const theme = useContext(ThemeContext)
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  const {
    hasCedarReadPermission,
    hasCedarWritePermission,
    hasCedarDeletePermission,
    authorizeHelper,
  } = useCedarling()
  const { logScopeDeletion } = useScopeActions()

  const getInitialPageSize = (): number => {
    const stored = localStorage.getItem('paggingSize')
    return stored ? parseInt(stored) : 10
  }

  const [limit, setLimit] = useState<number>(getInitialPageSize())
  const [pageNumber, setPageNumber] = useState<number>(0)
  const [searchInput, setSearchInput] = useState<string>('')
  const [pattern, setPattern] = useState<string | null>(null)
  const [startIndex, setStartIndex] = useState<number>(0)
  const [scopeType, setScopeType] = useState<string | undefined>(undefined)
  const [sortBy, setSortBy] = useState<string | undefined>(undefined)
  const [sortOrder, setSortOrder] = useState<'ascending' | 'descending'>('ascending')
  const [item, setItem] = useState<Scope | null>(null)
  const [modal, setModal] = useState(false)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const scopesQueryParams = useMemo(
    () => ({
      limit,
      pattern: pattern || undefined,
      startIndex,
      type: scopeType || undefined,
      sortBy: sortBy || undefined,
      sortOrder: sortBy ? sortOrder : undefined,
      withAssociatedClients: true as const,
    }),
    [limit, pattern, startIndex, scopeType, sortBy, sortOrder],
  )

  const scopesQueryOptions = useMemo(
    () => ({
      query: {
        refetchOnMount: 'always' as const,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        staleTime: 30000, // 30 seconds
      },
    }),
    [],
  )

  const {
    data: scopesResponse,
    isLoading,
    isFetching,
  } = useGetOauthScopes(scopesQueryParams, scopesQueryOptions)

  const loading = isLoading || isFetching

  const handleDeleteSuccess = useCallback(() => {
    dispatch(updateToast(true, 'success', 'Scope deleted successfully'))
    queryClient.invalidateQueries({
      predicate: (query) => {
        const queryKey = query.queryKey[0] as string
        return queryKey === getGetOauthScopesQueryKey()[0] || queryKey === 'getOauthScopesByInum'
      },
    })
  }, [dispatch, queryClient])

  const handleDeleteError = useCallback(
    (error: Error) => {
      const errorMessage = error?.message || 'Failed to delete scope'
      dispatch(updateToast(true, 'error', errorMessage))
    },
    [dispatch],
  )

  const deleteScope = useDeleteOauthScopesByInum({
    mutation: {
      onSuccess: handleDeleteSuccess,
      onError: handleDeleteError,
    },
  })

  const scopesResourceId = ADMIN_UI_RESOURCES.Scopes

  const selectedTheme = useMemo(() => theme?.state?.theme || DEFAULT_THEME, [theme?.state?.theme])

  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])

  const bgThemeColor = useMemo(
    () => ({ background: themeColors.background }),
    [themeColors.background],
  )

  const scopesScopes = useMemo(
    () => CEDAR_RESOURCE_SCOPES[scopesResourceId] || [],
    [scopesResourceId],
  )

  const canReadScopes = useMemo(
    () => hasCedarReadPermission(scopesResourceId),
    [hasCedarReadPermission, scopesResourceId],
  )

  const canWriteScopes = useMemo(
    () => hasCedarWritePermission(scopesResourceId),
    [hasCedarWritePermission, scopesResourceId],
  )

  const canDeleteScopes = useMemo(
    () => hasCedarDeletePermission(scopesResourceId),
    [hasCedarDeletePermission, scopesResourceId],
  )

  const scopes = useMemo<ScopeWithClients[]>(
    () => (scopesResponse?.entries || []) as ScopeWithClients[],
    [scopesResponse?.entries],
  )

  const totalItems = useMemo(
    () => scopesResponse?.totalEntriesCount || 0,
    [scopesResponse?.totalEntriesCount],
  )

  const tableOptions = useMemo(
    () => ({
      idSynonym: 'inum',
      columnsButton: true,
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
        color: themeColors.fontColor,
      },
      actionsColumnIndex: -1,
    }),
    [limit, bgThemeColor, themeColors.fontColor],
  )

  const toggle = useCallback(() => setModal((prev) => !prev), [])

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

  const handleScopeTypeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value
    setScopeType(value === 'all' ? undefined : value)
    setPageNumber(0)
    setStartIndex(0)
  }, [])

  const handleSortByChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value
    setSortBy(value === 'none' ? undefined : value)
    setPageNumber(0)
    setStartIndex(0)
  }, [])

  const handleSortOrderToggle = useCallback((): void => {
    setSortOrder((prev) => (prev === 'ascending' ? 'descending' : 'ascending'))
  }, [])

  const handleClearFilters = useCallback((): void => {
    setSearchInput('')
    setPattern(null)
    setScopeType(undefined)
    setSortBy(undefined)
    setSortOrder('ascending')
    setPageNumber(0)
    setStartIndex(0)
  }, [])

  const handleRefresh = useCallback((): void => {
    setStartIndex(0)
    setPageNumber(0)
    queryClient.invalidateQueries({
      predicate: (query) => {
        const queryKey = query.queryKey[0] as string
        return queryKey === getGetOauthScopesQueryKey()[0] || queryKey === 'getOauthScopesByInum'
      },
    })
  }, [queryClient])

  const renderClientsColumn = useCallback((rowData: ScopeTableRow) => {
    if (!rowData.clients || !rowData.inum) {
      return rowData.clients?.length || 0
    }
    return (
      <Link to={ROUTES.AUTH_SERVER_CLIENTS_LIST_WITH_SCOPE(rowData.inum)} className="common-link">
        {rowData.clients.length}
      </Link>
    )
  }, [])

  const renderScopeTypeColumn = useCallback(
    (rowData: ScopeTableRow) => (
      <Badge
        key={rowData.inum}
        color={`primary-${selectedTheme}`}
        style={{
          color: customColors.primaryDark,
        }}
      >
        {rowData.scopeType}
      </Badge>
    ),
    [selectedTheme, themeColors.fontColor],
  )

  const handleGoToScopeAddPage = useCallback(() => {
    navigateToRoute(ROUTES.AUTH_SERVER_SCOPE_ADD)
  }, [navigateToRoute])

  const handleGoToScopeEditPage = useCallback(
    (row: ScopeTableRow) => {
      if (row.inum) {
        navigateToRoute(ROUTES.AUTH_SERVER_SCOPE_EDIT(row.inum))
      }
    },
    [navigateToRoute],
  )

  const handleScopeDelete = useCallback(
    (row: ScopeTableRow) => {
      setItem(row as Scope)
      toggle()
    },
    [toggle],
  )

  const onDeletionConfirmed = useCallback(
    async (message: string) => {
      if (!item?.inum) return

      try {
        await deleteScope.mutateAsync({ inum: item.inum })
        dispatch(triggerWebhook({ createdFeatureValue: item }))
        await logScopeDeletion(item, message)
        toggle()
      } catch (error) {
        console.error('Error deleting scope:', error)
      }
    },
    [item, deleteScope, logScopeDeletion, toggle, dispatch],
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
    (data: ScopeTableRow | ScopeTableRow[]) => {
      if (data && !Array.isArray(data)) {
        handleGoToScopeEditPage(data)
      }
    },
    [handleGoToScopeEditPage],
  )

  const handleDeleteClick = useCallback(
    (data: ScopeTableRow | ScopeTableRow[]) => {
      if (data && !Array.isArray(data)) {
        handleScopeDelete(data)
      }
    },
    [handleScopeDelete],
  )

  const DeleteIcon = () => <DeleteOutlined />

  const detailPanel = useCallback(
    (props: DetailPanelProps): React.ReactElement => (
      <ScopeDetailPage row={props.rowData as Scope} />
    ),
    [],
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

  const tableColumns = useMemo<Column<ScopeTableRow>[]>(
    () => [
      { title: `${t('fields.id')}`, field: 'id' },
      {
        title: `${t('menus.clients')}`,
        field: 'dn',
        render: renderClientsColumn,
      },
      { title: `${t('fields.description')}`, field: 'description' },
      {
        title: `${t('fields.scope_type')}`,
        field: 'scopeType',
        render: renderScopeTypeColumn,
      },
    ],
    [t, renderClientsColumn, renderScopeTypeColumn],
  )

  const myActions = useMemo<
    Array<Action<ScopeTableRow> | ((rowData: ScopeTableRow) => Action<ScopeTableRow>)>
  >(() => {
    const actions: Array<
      Action<ScopeTableRow> | ((rowData: ScopeTableRow) => Action<ScopeTableRow>)
    > = []

    if (canWriteScopes) {
      actions.push((rowData: ScopeTableRow) => ({
        icon: 'edit',
        iconProps: {
          id: `editScope${rowData.inum}`,
        },
        tooltip: `${t('messages.edit_scope')}`,
        onClick: (_event, data) => handleEditClick(data),
        disabled: !canWriteScopes,
      }))
      actions.push({
        icon: 'add',
        tooltip: `${t('messages.add_scope')}`,
        iconProps: { color: 'primary', style: { color: customColors.lightBlue } },
        isFreeAction: true,
        onClick: handleGoToScopeAddPage,
        disabled: !canWriteScopes,
      })
    }

    if (canDeleteScopes) {
      actions.push((rowData: ScopeTableRow) => ({
        icon: DeleteIcon,
        iconProps: {
          color: 'secondary',
          id: `deleteScope${rowData.inum}`,
        },
        tooltip: `${t('Delete Scope')}`,
        onClick: (_event, data) => handleDeleteClick(data),
        disabled: !canDeleteScopes,
      }))
    }

    return actions
  }, [
    canWriteScopes,
    canDeleteScopes,
    t,
    handleEditClick,
    handleGoToScopeAddPage,
    handleDeleteClick,
  ])

  const tableComponents = useMemo(
    () => ({
      Container: PaperContainer,
      Pagination: PaginationComponent,
    }),
    [PaperContainer, PaginationComponent],
  )

  SetTitle(t('titles.scopes'))

  useEffect(() => {
    authorizeHelper(scopesScopes)
  }, [authorizeHelper, scopesScopes])

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
          <GluuViewWrapper canShow={canReadScopes}>
            <Box sx={FILTER_BOX_STYLES}>
              <Box sx={FILTER_CONTAINER_STYLES}>
                <Box sx={FILTER_ITEMS_STYLES}>
                  <TextField
                    size="small"
                    placeholder={t('placeholders.search_pattern')}
                    name="pattern"
                    value={searchInput}
                    onChange={handlePatternChange}
                    onKeyDown={handlePatternKeyDown}
                    sx={TEXT_FIELD_WIDTH}
                    inputProps={{ 'aria-label': t('placeholders.search_pattern') }}
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

                  <TextField
                    select
                    size="small"
                    value={scopeType || 'all'}
                    onChange={handleScopeTypeChange}
                    sx={SELECT_FIELD_WIDTH}
                    label={t('fields.scope_type')}
                  >
                    <MenuItem value="all">{t('options.all')}</MenuItem>
                    <MenuItem value="oauth">OAuth</MenuItem>
                    <MenuItem value="openid">OpenID</MenuItem>
                    <MenuItem value="dynamic">Dynamic</MenuItem>
                    <MenuItem value="spontaneous">Spontaneous</MenuItem>
                    <MenuItem value="uma">UMA</MenuItem>
                  </TextField>

                  <TextField
                    select
                    size="small"
                    value={sortBy || 'none'}
                    onChange={handleSortByChange}
                    sx={SELECT_FIELD_WIDTH}
                    label={t('fields.sort_by')}
                  >
                    <MenuItem value="none">{t('options.none')}</MenuItem>
                    <MenuItem value="inum">{t('fields.inum')}</MenuItem>
                    <MenuItem value="displayName">{t('fields.displayname')}</MenuItem>
                  </TextField>

                  {sortBy && sortBy !== 'none' && (
                    <IconButton
                      size="small"
                      onClick={handleSortOrderToggle}
                      title={
                        sortOrder === 'ascending' ? t('options.ascending') : t('options.descending')
                      }
                      aria-label={
                        sortOrder === 'ascending'
                          ? t('tooltips.sort_descending')
                          : t('tooltips.sort_ascending')
                      }
                      sx={ICON_BUTTON_STYLES}
                    >
                      <SwapVertIcon />
                    </IconButton>
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
              data={scopes}
              isLoading={loading}
              title=""
              actions={myActions}
              options={tableOptions}
              detailPanel={detailPanel}
            />
          </GluuViewWrapper>
          {canDeleteScopes && item && (
            <GluuDialog
              row={item}
              name={item.id}
              handler={toggle}
              modal={modal}
              subject="scope"
              onAccept={onDeletionConfirmed}
              feature={adminUiFeatures.scopes_delete}
            />
          )}
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default ScopeListPage
