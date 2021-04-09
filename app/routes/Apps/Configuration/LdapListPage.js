import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { Badge } from 'reactstrap'
import GluuDialog from '../Gluu/GluuDialog'
import LdapDetailPage from './LdapDetailPage'
import { Button } from './../../../components'
import GluuAlert from '../Gluu/GluuAlert'
import {
  hasPermission,
  LDAP_READ,
  LDAP_WRITE,
  LDAP_DELETE,
} from '../../../utils/PermChecker'
import {
  getLdapConfig,
  setCurrentItem,
  deleteLdap,
  testLdap,
} from '../../../redux/actions/LdapActions'

function LdapListPage({ ldapConfigurations, permissions, loading, dispatch, testStatus }) {
  useEffect(() => {
    dispatch(getLdapConfig())
  }, [])

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
      tooltip: 'Edit Ldap',
      onClick: (event, rowData) => handleGoToLdapEditPage(rowData),
      disabled: !hasPermission(permissions, LDAP_WRITE),
    }))
  }

  if (hasPermission(permissions, LDAP_READ)) {
    myActions.push({
      icon: 'refresh',
      tooltip: 'Refresh Data',
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
      tooltip: 'Delete record',
      onClick: (event, rowData) => handleLdapDelete(rowData),
      disabled: !hasPermission(permissions, LDAP_DELETE),
    }))
  }

  function getBadgeTheme(status) {
    if (status) {
      return 'primary'
    } else {
      return 'warning'
    }
  }
  function onDeletionConfirmed() {
    // perform delete request
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
          setAlertObj({ ...alertObj, severity: 'success', message: 'LDAP Connection successful!', show: true })
        } else {
          setAlertObj({ ...alertObj, severity: 'error', message: 'LDAP Connection Failed!', show: true })
        }
      })
  }
  return (
    <React.Fragment>
      {/* START Content */}
      <div>
        <Button color="primary" onClick={handleGoToLdapAddPage}>Add LDAP Configuration</Button>
      </div>
      <hr/>
      <MaterialTable
        columns={[
          { title: 'Configuration Id', field: 'configId' },
          { title: 'Bind DN', field: 'bindDN' },
          {
            title: 'Status',
            field: 'enabled',
            type: 'boolean',
            render: (rowData) => (
              <Badge color={getBadgeTheme(rowData.enabled)}>
                {rowData.enabled ? "Enable" : "Disable"}
              </Badge>
            ),
          },
        ]}
        data={ldapConfigurations}
        isLoading={loading}
        title="Ldap Authentication"
        actions={myActions}
        options={{
          search: true,
          selection: false,
          pageSize: 10,
          headerStyle: {
            backgroundColor: '#1EB7FF', //#1EB7FF 01579b
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
