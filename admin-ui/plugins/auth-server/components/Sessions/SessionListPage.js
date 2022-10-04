import React, { useState, useEffect, useContext } from 'react'
import moment from 'moment'
import isEmpty from 'lodash/isEmpty'
import MaterialTable from '@material-table/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { Paper, TextField, Box } from '@material-ui/core'
import { connect } from 'react-redux'
import { Button } from 'reactstrap'
import { Card, CardBody } from 'Components'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import { useTranslation } from 'react-i18next'
import { getSessions, revokeSession } from 'Plugins/auth-server/redux/actions/SessionActions'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import {
  hasPermission,
  SESSION_DELETE,
} from 'Utils/PermChecker'

function SessionListPage({ sessions, permissions, loading, dispatch }) {
  const { t } = useTranslation()
  const myActions = []
  const [item, setItem] = useState({})
  const [modal, setModal] = useState(false)
  const pageSize = localStorage.getItem('paggingSize') || 10
  const toggle = () => setModal(!modal)
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }
  const sessionUsername = sessions.map(session => session.sessionAttributes.auth_user)
  const usernames = [...new Set(sessionUsername)]
  const [revokeUsername, setRevokeUsername] = useState()

  SetTitle(t('menus.sessions'))

  const tableColumns = [
    { title: `${t('fields.s_id')}`, field: 'sessionAttributes.sid' },
    { title: `${t('fields.username')}`, field: 'sessionAttributes.auth_user' },
    { title: `${t('fields.ip_address')}`, field: 'sessionAttributes.remote_ip' },
    { title: `${t('fields.client_id_used')}`, field: 'sessionAttributes.client_id' },
    { 
      title: `${t('fields.auth_time')}`,
      field: 'authenticationTime',
      render: (rowData) => (
        <span>
          { moment(rowData.authenticationTime).format("ddd, MMM DD, YYYY h:mm:ss A") }
        </span>
      ),
    },
    { title: `ACR`, field: 'sessionAttributes.acr_values' },
    {
      title: `${t('fields.session_expired')}`,
      field: 'expirationDate',
      hidden: true,
      render: (rowData) => (
        <span>
          { moment(rowData.expirationDate).format("ddd, MMM DD, YYYY h:mm:ss A") }
        </span>
      ),
    },
    { title: `${t('fields.state')}`, field: 'state' },
  ]

  useEffect(() => {
    dispatch(getSessions())
  }, [])

  const handleRevoke = () => {
    const row = !isEmpty(sessions) ? sessions.find(({ sessionAttributes }) => sessionAttributes.auth_user === revokeUsername) : null
    if (row) {
      setItem(row)
      toggle()
    }
  }

  const onRevokeConfirmed = (message) => {
    const { userDn } = item
    const params = { userDn, action_message: message }
    dispatch(revokeSession(params))
    toggle()
  }

  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <GluuViewWrapper canShow>
          {hasPermission(permissions, SESSION_DELETE) && (
            <Box display="flex" justifyContent="flex-end">
              <Box display="flex" alignItems="center" fontSize="16px" mr="20px">
                {t('fields.selectUserRevoke')}
              </Box>
              <Autocomplete
                id="combo-box-demo"
                options={usernames}
                getOptionLabel={(option) => option}
                style={{ width: 300 }}
                onChange={(_, value) => setRevokeUsername(value)}
                renderInput={(params) => <TextField {...params} label="Username" variant="outlined" />}
              />
              {revokeUsername && (
                <Button
                  color={`danger`}
                  style={{ marginLeft: 20 }}
                  onClick={handleRevoke}
                >
                  {t('actions.revoke')}
                </Button>
              )}
            </Box>
          )}
          <MaterialTable
            components={{
              Container: (props) => <Paper {...props} elevation={0} />,
            }}
            columns={tableColumns}
            data={sessions}
            isLoading={loading}
            title=""
            actions={myActions}
            options={{
              columnsButton: true,
              search: true,
              searchFieldAlignment: 'left',
              selection: false,
              pageSize: pageSize,
              headerStyle: { ...applicationStyle.tableHeaderStyle, ...bgThemeColor },
              actionsColumnIndex: -1
            }}
          />
        </GluuViewWrapper>
        {!isEmpty(item) && (
          <GluuDialog
            row={item}
            name={item.sessionAttributes.auth_user}
            handler={toggle}
            modal={modal}
            subject="user session revoke"
            onAccept={onRevokeConfirmed}
          />
        )}
      </CardBody>
    </Card>
  )
}

const mapStateToProps = (state) => {
  return {
    sessions: state.sessionReducer.items,
    loading: state.sessionReducer.loading,
    permissions: state.authReducer.permissions,
  }
}
export default connect(mapStateToProps)(SessionListPage)
