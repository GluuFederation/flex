import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react'
import MaterialTable from '@material-table/core'
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
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Badge } from 'reactstrap'
import { Link } from 'react-router-dom'
import { Card, CardBody } from 'Components'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
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
import {
  useGetOauthScopes,
  useDeleteOauthScopesByInum,
  getGetOauthScopesQueryKey,
} from 'JansConfigApi'
import type { Scope } from 'JansConfigApi'
import type { ScopeWithClients, ScopeTableRow } from './types'
import { useScopeActions } from './hooks'
import type { Column, Action } from '@material-table/core'

const ScopeListPage: React.FC = () => {
  const { t } = useTranslation()
  const {
    hasCedarReadPermission,
    hasCedarWritePermission,
    hasCedarDeletePermission,
    authorizeHelper,
  } = useCedarling()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const dispatch = useDispatch()

  const getInitialPageSize = (): number => {
    const stored = localStorage.getItem('paggingSize')
    return stored ? parseInt(stored) : 10
  }

  const [limit, setLimit] = useState<number>(getInitialPageSize())
  const [pageNumber, setPageNumber] = useState<number>(0)
  const [pattern, setPattern] = useState<string | null>(null)
  const [startIndex, setStartIndex] = useState<number>(0)
  const [scopeType, setScopeType] = useState<string | undefined>(undefined)
  const [sortBy, setSortBy] = useState<string | undefined>(undefined)
  const [sortOrder, setSortOrder] = useState<'ascending' | 'descending'>('ascending')
  const [item, setItem] = useState<Scope | null>(null)
  const [modal, setModal] = useState(false)
  const [myActions, setMyActions] = useState<
    Array<Action<ScopeTableRow> | ((rowData: ScopeTableRow) => Action<ScopeTableRow>)>
  >([])

  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'light'
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }

  const { logScopeDeletion } = useScopeActions()

  const { data: scopesResponse, isLoading: loading } = useGetOauthScopes({
    limit,
    pattern: pattern || undefined,
    startIndex,
    type: scopeType || undefined,
    sortBy: sortBy || undefined,
    sortOrder: sortBy ? sortOrder : undefined,
    withAssociatedClients: true,
  })

  const scopes = (scopesResponse?.entries || []) as ScopeWithClients[]
  const totalItems = scopesResponse?.totalEntriesCount || 0

  const deleteScope = useDeleteOauthScopesByInum({
    mutation: {
      onSuccess: () => {
        dispatch(updateToast(true, 'success'))
        queryClient.invalidateQueries({ queryKey: getGetOauthScopesQueryKey() })
      },
      onError: (error: unknown) => {
        const errorMessage = (error as Error)?.message || 'Failed to delete scope'
        dispatch(updateToast(true, 'error', errorMessage))
      },
    },
  })

  const toggle = useCallback(() => setModal((prev) => !prev), [])

  SetTitle(t('titles.scopes'))

  const scopesResourceId = ADMIN_UI_RESOURCES.Scopes
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

  useEffect(() => {
    authorizeHelper(scopesScopes)
  }, [authorizeHelper, scopesScopes])

  const handlePatternChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value
    setPattern(value)
  }

  const handlePatternKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter') {
      setPageNumber(0)
      setStartIndex(0)
    }
  }

  const handleScopeTypeChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value
    setScopeType(value === 'all' ? undefined : value)
    setPageNumber(0)
    setStartIndex(0)
  }

  const handleSortByChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value
    setSortBy(value === 'none' ? undefined : value)
    setPageNumber(0)
    setStartIndex(0)
  }

  const handleSortOrderToggle = (): void => {
    setSortOrder(sortOrder === 'ascending' ? 'descending' : 'ascending')
  }

  const handleClearFilters = (): void => {
    setPattern(null)
    setScopeType(undefined)
    setSortBy(undefined)
    setSortOrder('ascending')
    setPageNumber(0)
    setStartIndex(0)
  }

  const tableColumns = useMemo<Column<ScopeTableRow>[]>(
    () => [
      { title: `${t('fields.id')}`, field: 'id' },
      {
        title: `${t('menus.clients')}`,
        field: 'dn',
        render: (rowData) => {
          if (!rowData.clients) {
            return 0
          }
          return (
            <Link to={`/auth-server/clients?scopeInum=${rowData.inum}`} className="common-link">
              {rowData.clients?.length}
            </Link>
          )
        },
      },
      { title: `${t('fields.description')}`, field: 'description' },
      {
        title: `${t('fields.scope_type')}`,
        field: 'scopeType',
        render: (rowData) => (
          <Badge key={rowData.inum} color={`primary-${selectedTheme}`}>
            {rowData.scopeType}
          </Badge>
        ),
      },
    ],
    [t, selectedTheme],
  )

  const handleGoToScopeAddPage = useCallback(() => {
    return navigate('/auth-server/scope/new')
  }, [navigate])

  const handleGoToScopeEditPage = useCallback(
    (row: ScopeTableRow) => {
      return navigate(`/auth-server/scope/edit/${row.inum}`)
    },
    [navigate],
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
        await logScopeDeletion(item, message)
        toggle()
      } catch (error) {
        console.error('Error deleting scope:', error)
      }
    },
    [item, deleteScope, logScopeDeletion, toggle],
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

  useEffect(() => {
    const actions: Array<
      Action<ScopeTableRow> | ((rowData: ScopeTableRow) => Action<ScopeTableRow>)
    > = []

    if (canWriteScopes) {
      actions.push((rowData: ScopeTableRow) => ({
        icon: 'edit',
        iconProps: {
          id: 'editScope' + rowData.inum,
        },
        tooltip: `${t('messages.edit_scope')}`,
        onClick: (_event: unknown, rowData: ScopeTableRow | ScopeTableRow[]) => {
          if (rowData && !Array.isArray(rowData)) {
            handleGoToScopeEditPage(rowData)
          }
        },
        disabled: !canWriteScopes,
      }))
      actions.push({
        icon: 'add',
        tooltip: `${t('messages.add_scope')}`,
        iconProps: { color: 'primary', style: { color: customColors.lightBlue } },
        isFreeAction: true,
        onClick: () => handleGoToScopeAddPage(),
        disabled: !canWriteScopes,
      })
    }

    if (canDeleteScopes) {
      actions.push((rowData: ScopeTableRow) => ({
        icon: () => <DeleteOutlined />,
        iconProps: {
          color: 'secondary',
          id: 'deleteScope' + rowData.inum,
        },
        tooltip: `${t('Delete Scope')}`,
        onClick: (_event: unknown, rowData: ScopeTableRow | ScopeTableRow[]) => {
          if (rowData && !Array.isArray(rowData)) {
            handleScopeDelete(rowData)
          }
        },
        disabled: !canDeleteScopes,
      }))
    }

    setMyActions(actions)
  }, [
    canWriteScopes,
    canDeleteScopes,
    t,
    handleGoToScopeAddPage,
    handleGoToScopeEditPage,
    handleScopeDelete,
  ])

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
      },
      actionsColumnIndex: -1,
    }),
    [limit, bgThemeColor],
  )

  const detailPanel = useCallback((rowData: { rowData: ScopeTableRow }) => {
    return <ScopeDetailPage row={rowData.rowData as Scope} />
  }, [])

  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <GluuViewWrapper canShow={canReadScopes}>
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
                  name="pattern"
                  value={pattern ?? ''}
                  onChange={handlePatternChange}
                  onKeyDown={handlePatternKeyDown}
                  sx={{ width: '250px' }}
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
                  sx={{ width: '180px' }}
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
                  sx={{ width: '180px' }}
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
                    sx={{ color: customColors.lightBlue }}
                  >
                    <SwapVertIcon />
                  </IconButton>
                )}

                <Button
                  size="small"
                  startIcon={<ClearIcon />}
                  onClick={handleClearFilters}
                  aria-label={t('tooltips.clear_filters')}
                  sx={{ color: customColors.lightBlue }}
                >
                  {t('actions.clear')}
                </Button>
              </Box>

              <IconButton
                size="small"
                onClick={() => {
                  setStartIndex(0)
                  setPageNumber(0)
                }}
                title={t('tooltips.refresh_data')}
                aria-label={t('tooltips.refresh_data')}
                sx={{ color: customColors.lightBlue }}
              >
                <RefreshIcon />
              </IconButton>
            </Box>
          </Box>

          <MaterialTable
            key={limit ? limit : 0}
            components={{
              Container: (props) => <Paper {...props} elevation={0} />,
              Pagination: () => (
                <TablePagination
                  count={totalItems}
                  page={pageNumber}
                  onPageChange={(prop, page) => {
                    onPageChangeClick(page)
                  }}
                  rowsPerPage={limit}
                  onRowsPerPageChange={(event) =>
                    onRowCountChangeClick(parseInt(event.target.value, 10))
                  }
                />
              ),
            }}
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
  )
}

export default ScopeListPage
