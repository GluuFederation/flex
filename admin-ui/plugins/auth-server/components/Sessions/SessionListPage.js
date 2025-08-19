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
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'reactstrap'
import { Card, CardBody } from 'Components'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import { useTranslation } from 'react-i18next'
import {
  getSessions,
  deleteSession,
  revokeSession,
} from 'Plugins/auth-server/redux/features/sessionSlice'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import SessionDetailPage from '../Sessions/SessionDetailPage'
import { SESSION_DELETE } from 'Utils/PermChecker'
import { useCedarling } from '@/cedarling'
import { searchSessions } from '../../redux/features/sessionSlice'
import dayjs from 'dayjs'
import { Button as MaterialButton } from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import GetAppIcon from '@mui/icons-material/GetApp'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import { DeleteOutlined } from '@mui/icons-material'
import PropTypes from 'prop-types'
import customColors from '@/customColors'

function SessionListPage() {
  const { hasCedarPermission, authorize } = useCedarling()
  const sessions = useSelector((state) => state.sessionReducer.items)
  const loading = useSelector((state) => state.sessionReducer.loading)
  const { permissions: cedarPermissions } = useSelector((state) => state.cedarPermissions)

  const dispatch = useDispatch()

  const { t } = useTranslation()
  const [myActions, setMyActions] = useState([])
  const [item, setItem] = useState({})
  const [modal, setModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const pageSize = localStorage.getItem('paggingSize') || 10
  const toggle = () => setModal(!modal)
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }

  // Permission initialization
  useEffect(() => {
    const authorizePermissions = async () => {
      try {
        await authorize([SESSION_DELETE])
      } catch (error) {
        console.error('Error authorizing session permissions:', error)
      }
    }

    authorizePermissions()
  }, [])
  useEffect(() => {}, [cedarPermissions])

  useEffect(() => {
    const actions = []

    if (hasCedarPermission(SESSION_DELETE)) {
      actions.push((rowData) => ({
        icon: () => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <DeleteOutlined />
          </div>
        ),
        iconProps: {
          color: 'secondary',
          id: 'deleteSession' + rowData.sessionAttributes?.auth_user,
        },
        tooltip: `${t('actions.delete')}`,
        onClick: (event, rowData) => handleDeleteSession(rowData),
        disabled: !hasCedarPermission(SESSION_DELETE),
      }))
    }

    setMyActions(actions)
  }, [hasCedarPermission, t, handleDeleteSession])

  const sessionUsername = useMemo(
    () => sessions.map((session) => session.sessionAttributes.auth_user),
    [sessions],
  )
  const usernames = useMemo(() => [...new Set(sessionUsername)], [sessionUsername])
  const [revokeUsername, setRevokeUsername] = useState()
  const [limit, setLimit] = useState(10)
  const [pattern, setPattern] = useState(null)
  const [searchFilter, setSearchFilter] = useState(null)
  const [date, setDate] = useState(null)
  const [checkedColumns, setCheckedColumns] = useState([])
  const [updatedColumns, setUpdatedColumns] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const memoLimit = limit
  let memoPattern = pattern

  SetTitle(t('menus.sessions'))

  const tableColumns = useMemo(
    () => [
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
        render: (rowData) => (
          <span>{moment(rowData.authenticationTime).format('ddd, MMM DD, YYYY h:mm:ss A')}</span>
        ),
      },
      {
        title: `${t('fields.acr')}`,
        field: 'sessionAttributes.acr_values',
      },
      { title: `${t('fields.state')}`, field: 'state' },
    ],
    [t, hasCedarPermission],
  )

  const handleCheckboxChange = useCallback(
    (title) => {
      setCheckedColumns((prev) => {
        const newCheckedColumns = prev.includes(title)
          ? prev.filter((item) => item !== title)
          : [...prev, title]
        const newUpdatedColumns = tableColumns.filter((column) =>
          newCheckedColumns.includes(column.title),
        )
        setUpdatedColumns(newUpdatedColumns)
        return newCheckedColumns
      })
    },
    [tableColumns],
  )

  useEffect(() => {
    dispatch(getSessions())
    const initialCheckedColumns = tableColumns.map((column) => column.title)
    setCheckedColumns(initialCheckedColumns)
    setUpdatedColumns(tableColumns)
  }, [])

  const handleRevoke = useCallback(() => {
    const row = !isEmpty(sessions)
      ? sessions.find(({ sessionAttributes }) => sessionAttributes.auth_user === revokeUsername)
      : null
    if (row) {
      setItem(row)
      toggle()
    }
  }, [sessions, revokeUsername])

  const handleDeleteSession = useCallback(
    (rowData) => {
      setItem(rowData)
      setDeleteModal(true)
    },
    [setDeleteModal],
  )

  const onRevokeConfirmed = useCallback(
    (message) => {
      const { userDn } = item
      const params = { userDn, action_message: message }
      dispatch(revokeSession(params))
      toggle()
    },
    [item, dispatch, toggle],
  )

  const onDeleteConfirmed = useCallback(
    (message) => {
      const sessionId = item.id || item.sessionAttributes?.sid
      const params = { sessionId, action_message: message }
      dispatch(deleteSession(params))
      setDeleteModal(false)
    },
    [item, dispatch],
  )

  //export csv
  const convertToCSV = useCallback(
    (data) => {
      const keys = updatedColumns.map((item) => item.title)

      const header = keys.map((item) => item.replace(/-/g, ' ').toUpperCase()).join(',')

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
    [updatedColumns, t],
  )

  // Function to handle file download
  const downloadCSV = useCallback(() => {
    const csv = convertToCSV(sessions)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `client-tokens.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [convertToCSV, sessions])

  // Stable callback references to avoid dependency array size changes
  const handleUsernameChange = useCallback((_, value) => {
    setRevokeUsername(value)
  }, [])

  const handleFilterToggle = useCallback(() => {
    setShowFilter(!showFilter)
  }, [showFilter])

  const handleColumnMenuOpen = useCallback((event) => {
    setAnchorEl(event.currentTarget)
  }, [])

  const handleColumnMenuClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const handleFilterApply = useCallback(() => {
    setLimit(memoLimit)
    setPattern(memoPattern)
    if (memoPattern || date) {
      dispatch(
        searchSessions({
          action: {
            fieldValuePair: `${searchFilter}=${
              searchFilter !== 'expirationDate' && searchFilter !== 'authenticationTime'
                ? memoPattern
                : dayjs(date).format('YYYY-MM-DD')
            }`,
          },
        }),
      )
    } else {
      dispatch(getSessions())
    }
  }, [searchFilter, date, dispatch])

  const handleFilterClose = useCallback(() => {
    setShowFilter(false)
    dispatch(getSessions())
  }, [dispatch])

  const handleDetailPanel = useCallback((rowData) => {
    return <SessionDetailPage row={rowData.rowData} />
  }, [])

  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <GluuViewWrapper canShow>
          <div className="d-flex justify-content-between align-items-center">
            {hasCedarPermission(SESSION_DELETE) && (
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
                          checked={checkedColumns.includes(column.title)}
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
                        value={searchFilter}
                        onChange={(e) => {
                          if (e.target.value === null) {
                            dispatch(getSessions())
                          }
                          setPattern(null)
                          setDate(null)
                          setSearchFilter(e.target.value)
                        }}
                        variant="outlined"
                        style={{ width: 150, marginTop: -3 }}
                      >
                        <MenuItem value={null}>None</MenuItem>
                        <MenuItem value="client_id">{t('fields.client_id_used')}</MenuItem>
                        <MenuItem value="auth_user">{t('fields.username')}</MenuItem>
                        <MenuItem value="expirationDate">{t('titles.expiration_date')}</MenuItem>
                        <MenuItem value="authenticationTime">
                          {t('titles.authentication_date')}
                        </MenuItem>
                      </TextField>
                    </Grid>

                    {searchFilter === 'expirationDate' || searchFilter === 'authenticationTime' ? (
                      <Grid item xs={4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            format="MM/DD/YYYY"
                            label={t('dashboard.start_date')}
                            value={date}
                            style={{
                              borderColor: customColors.lightBlue,
                            }}
                            onChange={(val) => {
                              setDate(val)
                            }}
                            renderInput={(params) => <TextField {...params} fullWidth />}
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
                          onChange={(event) => (memoPattern = event.target.value)}
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

          <MaterialTable
            components={{
              Container: (props) => <Paper {...props} elevation={0} />,
            }}
            columns={updatedColumns}
            data={sessions}
            isLoading={loading}
            title=""
            actions={myActions}
            options={useMemo(
              () => ({
                idSynonym: 'username',
                columnsButton: false,
                search: false,
                searchFieldAlignment: 'left',
                selection: false,
                pageSize: pageSize,
                headerStyle: {
                  ...applicationStyle.tableHeaderStyle,
                  ...bgThemeColor,
                },
                actionsColumnIndex: -1,
              }),
              [pageSize, bgThemeColor],
            )}
            detailPanel={handleDetailPanel}
          />
        </GluuViewWrapper>
        {!isEmpty(item) && modal && (
          <GluuDialog
            row={item}
            name={item.sessionAttributes?.auth_user}
            handler={toggle}
            modal={modal}
            subject="user session revoke"
            onAccept={onRevokeConfirmed}
            style={{ marginRight: '0px' }}
          />
        )}
        {!isEmpty(item) && deleteModal && (
          <GluuDialog
            row={item}
            name={`${item.sessionAttributes?.auth_user} (${item.id || item.sessionAttributes?.sid})`}
            handler={() => setDeleteModal(false)}
            modal={deleteModal}
            subject="session delete"
            onAccept={onDeleteConfirmed}
            style={{ marginRight: '0px' }}
          />
        )}
      </CardBody>
    </Card>
  )
}

SessionListPage.propTypes = {
  row: PropTypes.any,
}
export default SessionListPage
