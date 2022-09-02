import React, { useState, useEffect, useContext } from 'react'
import moment from 'moment'
import MaterialTable from '@material-table/core'
import { DeleteOutlined } from '@material-ui/icons'
import { Paper } from '@material-ui/core'
import { connect } from 'react-redux'
import { Card, CardBody } from 'Components'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import { useTranslation } from 'react-i18next'
import { getSessions, revokeSession } from 'Plugins/auth-server/redux/actions/SessionActions'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'

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

  const handleRevoke = (row) => {
    setItem(row)
    toggle()
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
        <GluuDialog
          row={item}
          name={item.clientName}
          handler={toggle}
          modal={modal}
          subject="openid connect client"
          onAccept={onRevokeConfirmed}
        />
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
