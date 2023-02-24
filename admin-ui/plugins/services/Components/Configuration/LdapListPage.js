import React, { useState, useEffect, useContext } from 'react'
import MaterialTable from '@material-table/core'
import { DeleteOutlined } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { Badge } from 'reactstrap'
import { Paper } from '@mui/material'
import { Card, CardBody } from 'Components'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import LdapDetailPage from './LdapDetailPage'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import Alert from '@mui/lab/Alert'
import GluuAlert from 'Routes/Apps/Gluu/GluuAlert'
import {
  hasPermission,
  buildPayload,
  LDAP_READ,
  LDAP_WRITE,
  LDAP_DELETE,
} from 'Utils/PermChecker'
import {
  getLdapConfig,
  setCurrentItem,
  deleteLdap,
  testLdap,
  resetTestLdap,
} from 'Plugins/services/redux/actions/LdapActions'
import { getPersistenceType } from 'Plugins/services/redux/actions/PersistenceActions'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'

function LdapListPage({
  ldapConfigurations,
  permissions,
  loading,
  dispatch,
  testStatus,
  persistenceType,
  persistenceTypeLoading,
}) {
  useEffect(() => {
    dispatch(getLdapConfig())
    dispatch(getPersistenceType())
  }, [])
  const { t } = useTranslation()
  const userAction = {}
  const myActions = []
  const navigate =useNavigate()
  const [item, setItem] = useState({})
  const [modal, setModal] = useState(false)
  const [testRunning, setTestRunning] = useState(false)
  const pageSize = localStorage.getItem('paggingSize') || 10
  const [alertObj, setAlertObj] = useState({
    severity: '',
    message: '',
    show: false,
  })
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }
  SetTitle(t('titles.ldap_authentication'))
  const toggle = () => setModal(!modal)

  function handleGoToLdapEditPage(row) {
    dispatch(setCurrentItem(row))
    return navigate(`/config/ldap/edit:` + row.configId)
  }

  function handleLdapDelete(row) {
    setItem(row)
    toggle()
  }
  function handleGoToLdapAddPage() {
    return navigate('/config/ldap/new')
  }

  if (hasPermission(permissions, LDAP_WRITE)) {
    myActions.push((rowData) => ({
      icon: 'edit',
      iconProps: {
        id: 'editLdap' + rowData.configId,
      },
      tooltip: `${t('tooltips.edit_ldap')}`,
      onClick: (event, rowData) => handleGoToLdapEditPage(rowData),
      disabled: !hasPermission(permissions, LDAP_WRITE),
    }))
  }

  if (hasPermission(permissions, LDAP_READ)) {
    myActions.push({
      icon: 'refresh',
      tooltip: `${t('tooltips.refresh_data')}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => {
        dispatch(getLdapConfig())
      },
    })
  }
  if (hasPermission(permissions, LDAP_DELETE)) {
    myActions.push((rowData) => ({
      icon: () => <DeleteOutlined />,
      iconProps: {
        color: 'secondary',
        id: 'deleteLdap' + rowData.configId,
      },
      tooltip: `${t('tooltips.delete_record')}`,
      onClick: (event, rowData) => handleLdapDelete(rowData),
      disabled: !hasPermission(permissions, LDAP_DELETE),
    }))
  }
  if (hasPermission(permissions, LDAP_WRITE)) {
    myActions.push({
      icon: 'add',
      tooltip: `${t('tooltips.add_ldap')}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => handleGoToLdapAddPage(),
    })
  }

  function getBadgeTheme(status) {
    if (status) {
      return `primary-${selectedTheme}`
    } else {
      return 'warning'
    }
  }
  function onDeletionConfirmed(message) {
    buildPayload(userAction, message, item.configId)
    dispatch(deleteLdap(item.configId))
    navigate('/config/ldap')
    toggle()
  }
  function testLdapConnect(row) {
    const testPromise = new Promise(function (resolve, reject) {
      setAlertObj({ ...alertObj, show: false })
      dispatch(resetTestLdap())
      resolve()
    })

    testPromise
      .then(() => {
        setTestRunning(true)
        dispatch(testLdap(row))
      })
  }

  useEffect(() => {
    dispatch(resetTestLdap())
    setAlertObj({ ...alertObj, show: false })
  }, [])

  useEffect(() => {
    if (testStatus === null || !testRunning) {
      return
    }

    if (testStatus) {
      setAlertObj({
        ...alertObj,
        severity: 'success',
        message: `${t('messages.ldap_connection_success')}`,
        show: true,
      })
    } else {
      setAlertObj({
        ...alertObj,
        severity: 'error',
        message: `${t('messages.ldap_connection_error')}`,
        show: true,
      })
    }
  }, [testStatus])

  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <GluuLoader blocking={persistenceTypeLoading}>
          {persistenceType == `ldap` ? (
            <MaterialTable
              components={{
                Container: (props) => <Paper {...props} elevation={0} />,
              }}
              columns={[
                { title: `${t('fields.configuration_id')}`, field: 'configId' },
                { title: `${t('fields.bind_dn')}`, field: 'bindDN' },
                {
                  title: `${t('fields.status')}`,
                  field: 'enabled',
                  type: 'boolean',
                  render: (rowData) => (
                    <Badge color={getBadgeTheme(rowData.enabled)}>
                      {rowData.enabled
                        ? `${t('fields.enable')}`
                        : `${t('fields.disable')}`}
                    </Badge>
                  ),
                },
              ]}
              data={ldapConfigurations}
              isLoading={loading}
              title=""
              actions={myActions}
              options={{
                search: true,
                selection: false,
                pageSize: pageSize,
                headerStyle: { ...applicationStyle.tableHeaderStyle, ...bgThemeColor },
                actionsColumnIndex: -1,
              }}
              detailPanel={(rowData) => {
                return (
                  <LdapDetailPage
                    row={rowData.rowData}
                    testLdapConnection={testLdapConnect}
                  />
                )
              }}
            />
          ) : (
            <Alert severity="info">
              {!persistenceTypeLoading &&
                'The current data store provider is not LDAP based.'}
            </Alert>
          )}
          <GluuAlert
            severity={alertObj.severity}
            message={alertObj.message}
            show={alertObj.show}
          />
          <GluuDialog
            row={item}
            handler={toggle}
            modal={modal}
            subject="ldap"
            onAccept={onDeletionConfirmed}
          />
        </GluuLoader>
      </CardBody>
    </Card>
  )
}

const mapStateToProps = (state) => {
  return {
    ldapConfigurations: state.ldapReducer.ldap,
    loading: state.ldapReducer.loading,
    permissions: state.authReducer.permissions,
    testStatus: state.ldapReducer.testStatus,
    persistenceType: state.persistenceTypeReducer.type,
    persistenceTypeLoading: state.persistenceTypeReducer.loading,
  }
}
export default connect(mapStateToProps)(LdapListPage)
