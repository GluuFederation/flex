import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react'
import moment from 'moment'
import isEmpty from 'lodash/isEmpty'
import MaterialTable from '@material-table/core'
import Autocomplete from '@mui/material/Autocomplete'
import {
  Paper,
  TextField,
  Box,
  MenuItem,
  Grid,
  Menu,
  Checkbox,
  FormControl,
  ListItemText,
  Button as MaterialButton,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useSelector } from 'react-redux'
import { Button } from 'reactstrap'
import { Card, CardBody } from 'Components'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import SessionDetailPage from '../Sessions/SessionDetailPage'
import { useCedarling } from '@/cedarling'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import dayjs, { Dayjs } from 'dayjs'
import FilterListIcon from '@mui/icons-material/FilterList'
import GetAppIcon from '@mui/icons-material/GetApp'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import { DeleteOutlined } from '@mui/icons-material'
import customColors from '@/customColors'
import { getPagingSize } from '@/utils/pagingUtils'
import {
  useGetSessions,
  useDeleteSession,
  useRevokeUserSession,
  useSearchSession,
} from 'JansConfigApi'
import type { SessionId, SearchSessionParams } from 'JansConfigApi'
import type { Session, TableColumn, SessionListPageProps, FilterState, ColumnState } from './types'
import { logAuditUserAction } from 'Utils/AuditLogger'
import { DELETION } from '../../../../app/audit/UserActionType'
import { SESSION } from '../../redux/audit/Resources'

const SessionListPage: React.FC<SessionListPageProps> = () => {
  const { hasCedarDeletePermission, authorizeHelper } = useCedarling()
  const { t } = useTranslation()
  const {
    data: sessionsData,
    isLoading: sessionsLoading,
    refetch: refetchSessions,
  } = useGetSessions()
  const deleteSessionMutation = useDeleteSession()
  const revokeSessionMutation = useRevokeUserSession()

  const authState = useSelector((state: any) => state.authReducer)
  const token = authState?.token?.access_token
  const client_id = authState?.config?.clientId
  const userinfo = authState?.userinfo

  const [searchParams, setSearchParams] = useState<SearchSessionParams | undefined>(undefined)
  const { data: searchData, isLoading: searchLoading } = useSearchSession(searchParams, {
    query: {
      enabled: !!searchParams,
    },
  })

  const [filterState, setFilterState] = useState<FilterState>({
    limit: 10,
    pattern: null,
    searchFilter: null,
    date: null,
  })

  const [isFilterApplied, setIsFilterApplied] = useState(false)

  const adaptSessionIdToSession = useCallback((sessionId: SessionId): Session => {
    return {
      id: sessionId.id,
      userDn: sessionId.userDn,
      authenticationTime: sessionId.authenticationTime || '',
      state: sessionId.state as 'authenticated' | 'unauthenticated',
      sessionState: sessionId.sessionState,
      sessionAttributes: {
        auth_user: sessionId.sessionAttributes?.auth_user || '',
        remote_ip: sessionId.sessionAttributes?.remote_ip || '',
        client_id: sessionId.sessionAttributes?.client_id || '',
        acr_values: sessionId.sessionAttributes?.acr_values || '',
        sid: sessionId.sessionAttributes?.sid,
        ...sessionId.sessionAttributes,
      },
      expirationDate: sessionId.expirationDate,
      permissionGrantedMap: sessionId.permissionGrantedMap?.permissionGranted,
    }
  }, [])

  const sessions = useMemo(() => {
    let rawSessions: SessionId[] = []
    if (searchParams && searchData) {
      rawSessions = searchData.entries || []
    } else if (!searchParams && sessionsData?.entries) {
      rawSessions = sessionsData.entries
    }
    return rawSessions.map(adaptSessionIdToSession)
  }, [sessionsData, searchData, searchParams, adaptSessionIdToSession])

  const loading = sessionsLoading || searchLoading

  const tableKey = useMemo(() => {
    if (searchParams) {
      return `search-${JSON.stringify(searchParams)}`
    } else if (
      isFilterApplied &&
      filterState.pattern &&
      (filterState.searchFilter === 'client_id' || filterState.searchFilter === 'auth_user')
    ) {
      return `filter-${filterState.searchFilter}-${filterState.pattern}`
    }
    return 'all-sessions'
  }, [searchParams, filterState.pattern, filterState.searchFilter, isFilterApplied])

  const authenticatedSessions = useMemo(() => {
    let filtered = sessions.filter((session) => session.state === 'authenticated')

    if (
      isFilterApplied &&
      filterState.pattern &&
      (filterState.searchFilter === 'client_id' || filterState.searchFilter === 'auth_user')
    ) {
      const searchValue = filterState.pattern.toLowerCase()
      filtered = filtered.filter((session) => {
        const fieldValue =
          filterState.searchFilter === 'client_id'
            ? session.sessionAttributes?.client_id
            : session.sessionAttributes?.auth_user
        return fieldValue?.toLowerCase().includes(searchValue)
      })
    }

    return filtered
  }, [sessions, filterState.pattern, filterState.searchFilter, isFilterApplied])

  const [myActions, setMyActions] = useState<Array<(rowData: Session) => any>>([])
  const [item, setItem] = useState<Session>({} as Session)
  const [modal, setModal] = useState<boolean>(false)
  const [deleteModal, setDeleteModal] = useState<boolean>(false)
  const [revokeUsername, setRevokeUsername] = useState<string | null>(null)
  const [showFilter, setShowFilter] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const [columnState, setColumnState] = useState<ColumnState>({
    checkedColumns: [],
    updatedColumns: [],
  })

  const pageSize = getPagingSize()
  const toggle = () => setModal(!modal)
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'default'
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }

  const sessionResourceId = ADMIN_UI_RESOURCES.Session
  const sessionScopes = useMemo(
    () => CEDAR_RESOURCE_SCOPES[sessionResourceId] || [],
    [sessionResourceId],
  )

  const canDeleteSession = useMemo(
    () => hasCedarDeletePermission(sessionResourceId),
    [hasCedarDeletePermission, sessionResourceId],
  )

  useEffect(() => {
    if (sessionScopes && sessionScopes.length > 0) {
      authorizeHelper(sessionScopes)
    }
  }, [authorizeHelper, sessionScopes])

  const handleDeleteSession = useCallback((rowData: Session) => {
    setItem(rowData)
    setDeleteModal(true)
  }, [])

  const DeleteIcon = useCallback(
    () => (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <DeleteOutlined />
      </div>
    ),
    [],
  )

  const createDeleteAction = useCallback(
    (rowData: Session) => ({
      icon: DeleteIcon,
      iconProps: {
        color: 'secondary',
        id: 'deleteSession' + rowData.sessionAttributes?.auth_user,
      },
      tooltip: `${t('actions.delete')}`,
      onClick: (event: React.MouseEvent, rowData: Session) => handleDeleteSession(rowData),
      disabled: !canDeleteSession,
    }),
    [t, handleDeleteSession, canDeleteSession, DeleteIcon],
  )

  useEffect(() => {
    const actions: Array<(rowData: Session) => any> = []

    if (canDeleteSession) {
      actions.push(createDeleteAction)
    }

    setMyActions(actions)
  }, [canDeleteSession, createDeleteAction])

  const sessionUsername = useMemo(
    () =>
      authenticatedSessions.map((session) => session.sessionAttributes?.auth_user).filter(Boolean),
    [authenticatedSessions],
  )
  const usernames = useMemo(() => [...new Set(sessionUsername)], [sessionUsername])

  SetTitle(t('menus.sessions'))

  const tableColumns = useMemo(
    (): TableColumn[] => [
      { title: `${t('fields.username')}`, field: 'sessionAttributes.auth_user' },
      {
        title: `${t('fields.ip_address')}`,
        field: 'sessionAttributes.remote_ip',
      },
      {
        title: `${t('fields.client_id_used')}`,
        field: 'sessionAttributes.client_id',
      },
      {
        title: `${t('fields.auth_time')}`,
        field: 'authenticationTime',
        render: (rowData: Session) => (
          <span>{moment(rowData.authenticationTime).format('ddd, MMM DD, YYYY h:mm:ss A')}</span>
        ),
      },
      {
        title: `${t('fields.acr')}`,
        field: 'sessionAttributes.acr_values',
      },
      { title: `${t('fields.state')}`, field: 'state' },
    ],
    [t],
  )

  const handleCheckboxChange = useCallback(
    (title: string) => {
      setColumnState((prev) => {
        const newCheckedColumns = prev.checkedColumns.includes(title)
          ? prev.checkedColumns.filter((item) => item !== title)
          : [...prev.checkedColumns, title]
        const newUpdatedColumns = tableColumns.filter((column) =>
          newCheckedColumns.includes(column.title),
        )
        return {
          checkedColumns: newCheckedColumns,
          updatedColumns: newUpdatedColumns,
        }
      })
    },
    [tableColumns],
  )

  useEffect(() => {
    const initialCheckedColumns = tableColumns.map((column) => column.title)
    setColumnState({
      checkedColumns: initialCheckedColumns,
      updatedColumns: tableColumns,
    })
  }, [tableColumns])

  const handleRevoke = useCallback(() => {
    if (isEmpty(authenticatedSessions)) {
      return
    }
    const row = authenticatedSessions.find(
      ({ sessionAttributes }) => sessionAttributes?.auth_user === revokeUsername,
    )
    if (row) {
      setItem(row)
      toggle()
    }
  }, [authenticatedSessions, revokeUsername])

  const onRevokeConfirmed = useCallback(
    async (message: string) => {
      try {
        const { userDn } = item
        if (userDn) {
          await revokeSessionMutation.mutateAsync({ userDn })
          await logAuditUserAction({
            token,
            userinfo,
            action: DELETION,
            resource: SESSION,
            message: message || 'Session revoked',
            client_id,
            payload: { userDn, username: item.sessionAttributes?.auth_user },
          })
          refetchSessions()
        }
        toggle()
      } catch (error) {
        console.error('Error revoking session:', error)
      }
    },
    [item, revokeSessionMutation, refetchSessions, toggle, token, userinfo, client_id],
  )

  const onDeleteConfirmed = useCallback(
    async (message: string) => {
      try {
        const sessionId = item.id || item.sessionAttributes?.sid
        if (sessionId) {
          await deleteSessionMutation.mutateAsync({ sid: sessionId })
          await logAuditUserAction({
            token,
            userinfo,
            action: DELETION,
            resource: SESSION,
            message: message || 'Session deleted',
            client_id,
            payload: { sessionId, username: item.sessionAttributes?.auth_user },
          })
          refetchSessions()
        }
        setDeleteModal(false)
      } catch (error) {
        console.error('Error deleting session:', error)
      }
    },
    [item, deleteSessionMutation, refetchSessions, token, userinfo, client_id],
  )

  const convertToCSV = useCallback(
    (data: Session[]) => {
      const keys = columnState.updatedColumns.map((item) => item.title)

      const header = keys.map((item) => item.replaceAll('-', ' ').toUpperCase()).join(',')

      const updateData = data.map((row) => {
        return {
          [t('fields.username')]: row.sessionAttributes.auth_user,
          [t('fields.ip_address')]: row.sessionAttributes.remote_ip,
          [t('fields.client_id_used')]: row.sessionAttributes.client_id,
          [t('fields.auth_time')]: moment(row.authenticationTime).format('YYYY-MM-DD h:mm:ss A'),
          [t('fields.acr')]: row.sessionAttributes.acr_values,
          [t('fields.state')]: row.state,
        }
      })

      const rows = updateData.map((row) => {
        return keys.map((key) => row[key]).join(',')
      })

      return [header, ...rows].join('\n')
    },
    [columnState.updatedColumns, t],
  )

  const downloadCSV = useCallback(() => {
    const csv = convertToCSV(authenticatedSessions)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `client-tokens.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  }, [convertToCSV, authenticatedSessions])

  const handleUsernameChange = useCallback((_: any, value: string | null) => {
    setRevokeUsername(value)
  }, [])

  const handleFilterToggle = useCallback(() => {
    setShowFilter(!showFilter)
  }, [showFilter])

  const handleColumnMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }, [])

  const handleColumnMenuClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const handleFilterApply = useCallback(() => {
    const { pattern, searchFilter, date } = filterState
    if (pattern || date) {
      const searchValue =
        searchFilter !== 'expirationDate' && searchFilter !== 'authenticationTime'
          ? pattern
          : dayjs(date).format('YYYY-MM-DD')

      const isSessionAttribute = searchFilter === 'client_id' || searchFilter === 'auth_user'

      if (isSessionAttribute) {
        setSearchParams(undefined)
        setIsFilterApplied(true)
      } else if (searchFilter === 'expirationDate' || searchFilter === 'authenticationTime') {
        const searchParams: SearchSessionParams = {
          fieldValuePair: `${searchFilter}=${searchValue}`,
          limit: 100,
        }
        setSearchParams(searchParams)
        setIsFilterApplied(false)
      }
    } else {
      setSearchParams(undefined)
      setIsFilterApplied(false)
    }
  }, [filterState])

  const handleFilterClose = useCallback(() => {
    setShowFilter(false)
    setSearchParams(undefined)
    setIsFilterApplied(false)
    setFilterState({
      limit: 10,
      pattern: null,
      searchFilter: null,
      date: null,
    })
  }, [])

  const handleDetailPanel = useCallback((rowData: { rowData: Session }) => {
    return <SessionDetailPage row={rowData.rowData} />
  }, [])

  const TableContainer = useCallback((props: any) => <Paper {...props} elevation={0} />, [])

  const tableOptions = useMemo(
    () => ({
      idSynonym: 'username',
      columnsButton: false,
      search: false,
      searchFieldAlignment: 'left' as const,
      selection: false,
      pageSize: pageSize,
      headerStyle: {
        ...applicationStyle.tableHeaderStyle,
        ...bgThemeColor,
        textTransform: 'uppercase' as const,
      },
      actionsColumnIndex: -1,
    }),
    [pageSize, bgThemeColor],
  )

  const renderContent = useCallback(() => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>{t('messages.loading')}...</p>
        </div>
      )
    }

    if (authenticatedSessions.length === 0) {
      const isFiltering =
        searchParams ||
        (isFilterApplied &&
          filterState.pattern &&
          (filterState.searchFilter === 'client_id' || filterState.searchFilter === 'auth_user'))
      const message = isFiltering
        ? 'No sessions found matching your search criteria'
        : t('messages.no_sessions_found')
      return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>{message}</p>
        </div>
      )
    }

    return (
      <MaterialTable
        key={tableKey}
        components={{
          Container: TableContainer,
        }}
        columns={columnState.updatedColumns}
        data={authenticatedSessions}
        isLoading={loading}
        title=""
        actions={myActions}
        options={tableOptions}
        detailPanel={handleDetailPanel}
      />
    )
  }, [
    loading,
    authenticatedSessions,
    columnState.updatedColumns,
    myActions,
    tableOptions,
    handleDetailPanel,
    TableContainer,
    tableKey,
    searchParams,
    isFilterApplied,
    filterState.pattern,
    filterState.searchFilter,
    t,
  ])

  const handleSearchFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === 'null' ? null : e.target.value
    if (value === null) {
      setSearchParams(undefined)
      setIsFilterApplied(false)
    }
    setFilterState((prev) => ({
      ...prev,
      pattern: null,
      date: null,
      searchFilter: value,
    }))
  }, [])

  const handlePatternChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterState((prev) => ({
      ...prev,
      pattern: e.target.value,
    }))
  }, [])

  const handleDateChange = useCallback((val: Dayjs | null) => {
    setFilterState((prev) => ({
      ...prev,
      date: val,
    }))
  }, [])

  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <GluuViewWrapper canShow>
          <div className="d-flex justify-content-between align-items-center">
            {canDeleteSession && (
              <Box display="flex" justifyContent="flex-end">
                <Box display="flex" alignItems="center" fontSize="16px" mr="20px">
                  {t('fields.selectUserRevoke')}
                </Box>

                <Autocomplete
                  id="combo-box-demo"
                  options={usernames}
                  getOptionLabel={(option) => option}
                  style={{ width: 300 }}
                  onChange={handleUsernameChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      style={{
                        borderColor: customColors.lightBlue,
                      }}
                      label="Username"
                      variant="outlined"
                    />
                  )}
                />
                {revokeUsername && (
                  <Button
                    style={{
                      marginLeft: 20,
                      backgroundColor: customColors.accentRed,
                      border: 'none',
                    }}
                    onClick={handleRevoke}
                  >
                    {t('actions.revoke')}
                  </Button>
                )}
              </Box>
            )}
            {/* searchFilter */}
            <Box position="relative">
              <Box display="flex" justifyContent="flex-end" alignItems="center" p={2} width="500px">
                <MaterialButton
                  sx={{
                    color: customColors.lightBlue,
                  }}
                  startIcon={<FilterListIcon />}
                  onClick={handleFilterToggle}
                >
                  {t('titles.filters')}
                </MaterialButton>
                <MaterialButton
                  onClick={downloadCSV}
                  sx={{
                    color: customColors.lightBlue,
                    ml: 2,
                  }}
                  startIcon={<GetAppIcon />}
                >
                  {t('titles.export_csv')}
                </MaterialButton>

                <MaterialButton
                  sx={{ ml: 2, color: customColors.lightBlue }}
                  onClick={handleColumnMenuOpen}
                  startIcon={<ViewColumnIcon />}
                >
                  Columns
                </MaterialButton>
              </Box>

              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleColumnMenuClose}>
                <FormControl sx={{ m: 1, width: 200 }}>
                  <div className="d-flex flex-column gap-2 mt-2">
                    {tableColumns.map((column) => (
                      <MenuItem key={column.title} value={column.title}>
                        <Checkbox
                          checked={columnState.checkedColumns.includes(column.title)}
                          onChange={() => handleCheckboxChange(column.title)}
                        />
                        <ListItemText primary={column.title} />
                      </MenuItem>
                    ))}
                  </div>
                </FormControl>
              </Menu>

              {showFilter && (
                <Box
                  sx={{
                    p: 2,
                    mt: 2,
                    borderRadius: 1,
                    position: 'absolute',
                    top: '50%',
                    zIndex: 2,
                    backgroundColor: customColors.white,
                    width: '500px',
                  }}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  border={`1px solid ${customColors.lightGray}`}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={4}>
                      <TextField
                        select
                        label="Search Filter"
                        value={filterState.searchFilter || ''}
                        onChange={handleSearchFilterChange}
                        variant="outlined"
                        style={{ width: 150, marginTop: -3 }}
                      >
                        <MenuItem value="">None</MenuItem>
                        <MenuItem value="client_id">{t('fields.client_id_used')}</MenuItem>
                        <MenuItem value="auth_user">{t('fields.username')}</MenuItem>
                        <MenuItem value="expirationDate">{t('titles.expiration_date')}</MenuItem>
                        <MenuItem value="authenticationTime">
                          {t('titles.authentication_date')}
                        </MenuItem>
                      </TextField>
                    </Grid>

                    {filterState.searchFilter === 'expirationDate' ||
                    filterState.searchFilter === 'authenticationTime' ? (
                      <Grid item xs={4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            format="MM/DD/YYYY"
                            label={t('dashboard.start_date')}
                            value={filterState.date}
                            onChange={handleDateChange}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                style: {
                                  borderColor: customColors.lightBlue,
                                },
                              },
                            }}
                          />
                        </LocalizationProvider>
                      </Grid>
                    ) : (
                      <Grid item xs={4}>
                        <TextField
                          label="Value"
                          name="value"
                          variant="outlined"
                          fullWidth
                          value={filterState.pattern || ''}
                          onChange={handlePatternChange}
                          style={{
                            borderColor: customColors.lightBlue,
                          }}
                        />
                      </Grid>
                    )}

                    <Grid item xs={2}>
                      <Button
                        style={{
                          backgroundColor: customColors.lightBlue,
                          color: customColors.white,
                        }}
                        variant="contained"
                        color="primary"
                        onClick={handleFilterApply}
                      >
                        {t('actions.apply')}
                      </Button>
                    </Grid>

                    <Grid item xs={2}>
                      <Button
                        style={{
                          backgroundColor: customColors.lightBlue,
                          color: customColors.white,
                        }}
                        variant="contained"
                        color="primary"
                        onClick={handleFilterClose}
                      >
                        {t('actions.close')}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          </div>

          {renderContent()}
        </GluuViewWrapper>
        {!isEmpty(item) && modal ? (
          <GluuDialog
            row={item}
            name={item.sessionAttributes?.auth_user}
            handler={toggle}
            modal={modal}
            subject="user session revoke"
            onAccept={onRevokeConfirmed}
            style={{ marginRight: '0px' }}
          />
        ) : null}
        {!isEmpty(item) && deleteModal ? (
          <GluuDialog
            row={item}
            name={`${item.sessionAttributes?.auth_user} (${item.id || item.sessionAttributes?.sid})`}
            handler={() => setDeleteModal(false)}
            modal={deleteModal}
            subject="session delete"
            onAccept={onDeleteConfirmed}
            style={{ marginRight: '0px' }}
          />
        ) : null}
      </CardBody>
    </Card>
  )
}

export default SessionListPage
