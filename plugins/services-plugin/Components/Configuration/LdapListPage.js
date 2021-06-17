import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { Badge } from 'reactstrap'
import GluuDialog from '../../../../app/routes/Apps/Gluu/GluuDialog'
import LdapDetailPage from './LdapDetailPage'
import { Button } from '../../../../app/components'
import GluuAlert from '../../../../app/routes/Apps/Gluu/GluuAlert'
import {
  hasPermission,
  buildPayload,
  LDAP_READ,
  LDAP_WRITE,
  LDAP_DELETE,
} from '../../../../app/utils/PermChecker'
import {
  getLdapConfig,
  setCurrentItem,
  deleteLdap,
  testLdap,
} from '../../redux/actions/LdapActions'
import { useTranslation } from 'react-i18next'

function LdapListPage({ ldapConfigurations, permissions, loading, dispatch, testStatus }) {
  useEffect(() => {
    dispatch(getLdapConfig())
  }, [])
  const { t } = useTranslation()
  const userAction = {}
  const myActions = []
  const history = useHistory()
  const [item, setItem] = useState({})
  const [modal, setModal] = useState(false)
  const [alertObj, setAlertObj] = useState({ severity: '', message: '', show: false })
  const toggle = () => setModal(!modal)

  function handleGoToLdapEditPage(row) {
    dispatch(setCurrentItem(row))
    return history.push(`/config/ldap/edit:` + row.configId)
  }

  function handleLdapDelete(row) {
    setItem(row);
    toggle()
  }
  function handleGoToLdapAddPage() {
    return history.push('/config/ldap/new')
  }

  if (hasPermission(permissions, LDAP_WRITE)) {
    myActions.push((rowData) => ({
      icon: 'edit',
      iconProps: {
        color: 'primary',
        id: 'editLdap' + rowData.configId,
      },
      tooltip: `${t("tooltips.edit_ldap")}`,
      onClick: (event, rowData) => handleGoToLdapEditPage(rowData),
      disabled: !hasPermission(permissions, LDAP_WRITE),
    }))
  }

  if (hasPermission(permissions, LDAP_READ)) {
    myActions.push({
      icon: 'refresh',
      tooltip: `${t("tooltips.refresh_data")}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => {
        dispatch(getLdapConfig())
      },
    })
  }
  if (hasPermission(permissions, LDAP_DELETE)) {
    myActions.push((rowData) => ({
      icon: 'delete',
      iconProps: {
        color: 'secondary',
        id: 'deleteLdap' + rowData.configId,
      },
      tooltip: `${t("tooltips.delete_record")}`,
      onClick: (event, rowData) => handleLdapDelete(rowData),
      disabled: !hasPermission(permissions, LDAP_DELETE),
    }))
  }
  if (hasPermission(permissions, LDAP_WRITE)) {
    myActions.push({
      icon: 'add',
      tooltip: `${t("tooltips.add_ldap")}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => handleGoToLdapAddPage(),
    })
  }

  function getBadgeTheme(status) {
    if (status) {
      return 'primary'
    } else {
      return 'warning'
    }
  }
  function onDeletionConfirmed(message) {
    // perform delete request
    buildPayload(userAction, message, item.configId)
    dispatch(deleteLdap(item.configId))
    history.push('/config/ldap')
    toggle()
  }
  function testLdapConnect(row) {

    const testPromise = new Promise(function (resolve, reject) {
      setAlertObj({ ...alertObj, show: false })
      resolve();
    });

    testPromise
      .then(() => {
        dispatch(testLdap(row))
      })
      .then(() => {
        if (testStatus) {
          setAlertObj({ ...alertObj, severity: 'success', message: `${t("messages.ldap_connection_success")}`, show: true })
        } else {
          setAlertObj({ ...alertObj, severity: 'error', message: `${t("messages.ldap_connection_error")}`, show: true })
        }
      })
  }
  return (
    <React.Fragment>
      {/* START Content */}
      <div>
        <Button color="primary" onClick={handleGoToLdapAddPage}>{t("actions.add_ldap_configuration")}</Button>
      </div>
      <hr/>
      <MaterialTable
        columns={[
          { title: `${t("fields.configuration_id")}`, field: 'configId' },
          { title: `${t("fields.bind_dn")}`, field: 'bindDN' },
          {
            title: `${t("fields.status")}`,
            field: 'enabled',
            type: 'boolean',
            render: (rowData) => (
              <Badge color={getBadgeTheme(rowData.enabled)}>
                {rowData.enabled ? `${t("fields.enable")}` : `${t("fields.disable")}`}
              </Badge>
            ),
          },
        ]}
        data={ldapConfigurations}
        isLoading={loading}
        title={t("titles.ldap_authentication")}
        actions={myActions}
        options={{
          search: true,
          selection: false,
          pageSize: 10,
          headerStyle: {
            backgroundColor: '#03a96d', //#03a96d 01579b
            color: '#FFF',
            padding: '2px',
            textTransform: 'uppercase',
            fontSize: '18px',
          },
          actionsColumnIndex: -1,
        }}
        detailPanel={(rowData) => {
          return <LdapDetailPage row={rowData} testLdapConnection={testLdapConnect} />
        }}
      />
      <GluuAlert severity={alertObj.severity} message={alertObj.message} show={alertObj.show} />
      {/* END Content */}
      <GluuDialog
        row={item}
        handler={toggle}
        modal={modal}
        subject="ldap"
        onAccept={onDeletionConfirmed}
      />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    ldapConfigurations: state.ldapReducer.ldap,
    loading: state.ldapReducer.loading,
    permissions: state.authReducer.permissions,
    testStatus: state.ldapReducer.testStatus,
  }
}
export default connect(mapStateToProps)(LdapListPage)
