import React, { useState, useEffect, useContext } from 'react'
import MaterialTable from '@material-table/core'
import { DeleteOutlined } from '@material-ui/icons'
import { Paper } from '@material-ui/core'
import { connect } from 'react-redux'
import { Card, CardBody } from 'Components'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useTranslation } from 'react-i18next'
import { getSessions } from 'Plugins/auth-server/redux/actions/SessionActions'
import { buildPayload } from 'Utils/PermChecker'
import {
  LIMIT,
  PATTERN,
  FETCHING_SESSIONS,
  WITH_ASSOCIATED_CLIENTS,
} from 'Plugins/auth-server/common/Constants'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import styles from './styles'

function SessionListPage({ sessions, loading, dispatch }) {
  const { t } = useTranslation()
  const userAction = {}
  const options = {}
  const myActions = []
  const [item, setItem] = useState({})
  const [modal, setModal] = useState(false)
  const pageSize = localStorage.getItem('paggingSize') || 10
  const [limit, setLimit] = useState(500)
  const [pattern, setPattern] = useState(null)
  const toggle = () => setModal(!modal)
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }

  SetTitle(t('menus.sessions'))

  const tableColumns = [
    { title: `${t('fields.s_id')}`, field: 'sid' },
    { title: `${t('fields.username')}`, field: 'auth_user' },
    { title: `${t('fields.ip_address')}`, field: 'remote_ip' },
    { title: `${t('fields.client_id_used')}`, field: 'client_id' },
    { title: `${t('fields.auth_time')}`, field: 'authenticationTime' },
    { title: `${t('fields.session_expired')}`, field: 'expirationDate' },
    { title: `${t('fields.state')}`, field: 'state' },
  ]

  useEffect(() => {
    makeOptions()
    buildPayload(userAction, FETCHING_SESSIONS, options)
    dispatch(getSessions(userAction))
  }, [])

  function makeOptions() {
    setLimit(limit)
    setPattern(pattern)
    options[LIMIT] = limit
    options[WITH_ASSOCIATED_CLIENTS] = true
    if (pattern) {
      options[PATTERN] = pattern
    }
  }

  function handleRevoke(row) {
    console.log('row', row)
  }

  myActions.push((rowData) => ({
    icon: () => <DeleteOutlined />,
    iconProps: {
      color: 'secondary',
      id: 'deleteScope' + rowData.inum,
    },
    tooltip: `${t('Delete Scope')}`,
    onClick: (event, rowData) => handleRevoke(rowData),
    disabled: false,
  }))

  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <GluuViewWrapper canShow>
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
              actionsColumnIndex: -1,
            }}
          />
        </GluuViewWrapper>
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
