import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { Badge } from 'reactstrap'
import GluuDialog from '../../../../app/routes/Apps/Gluu/GluuDialog'
import ClientDetailPage from '../Clients/ClientDetailPage'
import GluuAdvancedSearch from '../../../../app/routes/Apps/Gluu/GluuAdvancedSearch'
import {
  getOpenidClients,
  searchClients,
  setCurrentItem,
  deleteClient,
} from '../../redux/actions/OIDCActions'
import {
  hasPermission,
  buildPayload,
  CLIENT_WRITE,
  CLIENT_READ,
  CLIENT_DELETE,
} from '../../../../app/utils/PermChecker'
function ClientListPage({ clients, permissions, scopes, loading, dispatch }) {
  const userAction = {}
  const options = {}
  const [limit, setLimit] = useState(50)
  const [pattern, setPattern] = useState(null)
  useEffect(() => {
    makeOptions()
    buildPayload(userAction, options)
    dispatch(getOpenidClients(userAction))
  }, [])
  const myActions = []
  const limitId = 'searchLimit'
  const patternId = 'searchPattern'
  const history = useHistory()
  const [item, setItem] = useState({})
  const [modal, setModal] = useState(false)
  const toggle = () => setModal(!modal)
  function handleOptionsChange() {
    setLimit(document.getElementById(limitId).value)
    setPattern(document.getElementById(patternId).value)
  }
  function handleGoToClientEditPage(row) {
    dispatch(setCurrentItem(row))
    return history.push(`/auth-server/client/edit:` + row.inum.substring(0, 4))
  }
  function handleGoToClientAddPage() {
    return history.push('/auth-server/client/new')
  }
  function handleClientDelete(row) {
    dispatch(setCurrentItem(row))
    setItem(row)
    toggle()
  }
  function makeOptions() {
    options['limit'] = limit
    if (pattern) {
      options['pattern'] = pattern
    }
  }
  function onDeletionConfirmed() {
    buildPayload(userAction, item.inum)
    dispatch(deleteClient(userAction))
    history.push('/auth-server/clients')
    toggle()
  }

  if (hasPermission(permissions, CLIENT_WRITE)) {
    myActions.push((rowData) => ({
      icon: 'edit',
      iconProps: {
        color: 'primary',
        id: 'editClient' + rowData.inum,
      },
      tooltip: 'Edit Client',
      onClick: (event, rowData) => handleGoToClientEditPage(rowData),
      disabled: false,
    }))
  }
  if (hasPermission(permissions, CLIENT_READ)) {
    myActions.push({
      icon: () => (
        <GluuAdvancedSearch
          limitId={limitId}
          patternId={patternId}
          limit={limit}
          handler={handleOptionsChange}
        />
      ),
      tooltip: 'Advanced search options',
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => {},
    })
  }
  if (hasPermission(permissions, CLIENT_READ)) {
    myActions.push({
      icon: 'refresh',
      tooltip: 'Refresh Data',
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => {
        makeOptions()
        buildPayload(userAction, options)
        dispatch(searchClients(userAction))
      },
    })
  }
  if (hasPermission(permissions, CLIENT_READ)) {
    myActions.push((rowData) => ({
      icon: 'visibility',
      iconProps: {
        color: 'primary',
        id: 'viewClient' + rowData.inum,
      },
      tooltip: 'View client details',
      onClick: (event, rowData) => handleGoToClientEditPage(rowData),
      disabled: false,
    }))
  }
  if (hasPermission(permissions, CLIENT_DELETE)) {
    myActions.push((rowData) => ({
      icon: 'delete',
      iconProps: {
        color: 'secondary',
        id: 'deleteClient' + rowData.inum,
      },
      tooltip: rowData.deletable
        ? 'Delete Client'
        : "This Client can't be detele",
      onClick: (event, rowData) => handleClientDelete(rowData),
      disabled: false,
    }))
  }
  if (hasPermission(permissions, CLIENT_WRITE)) {
    myActions.push({
      icon: 'add',
      tooltip: 'Add Client',
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => handleGoToClientAddPage(),
    })
  }

  function getBadgeTheme(status) {
    if (!status) {
      return 'primary'
    } else {
      return 'warning'
    }
  }

  function getTrustedTheme(status) {
    if (status) {
      return 'success'
    } else {
      return 'info'
    }
  }
  function getClientStatus(status) {
    if (!status) {
      return 'Enabled'
    } else {
      return 'Disabled'
    }
  }
  return (
    <React.Fragment>
      {/* START Content */}
      <MaterialTable
        columns={[
          { title: 'Client Name', field: 'clientName' },
          { title: 'App Type', field: 'applicationType' },
          { title: 'Subject Type', field: 'subjectType' },
          {
            title: 'Status',
            field: 'disabled',
            type: 'boolean',
            render: (rowData) => (
              <Badge color={getBadgeTheme(rowData.disabled)}>
                {getClientStatus(rowData.disabled)}
              </Badge>
            ),
          },
          {
            title: 'Trusted',
            field: 'trustedClient',
            type: 'boolean',
            render: (rowData) => (
              <Badge color={getTrustedTheme(rowData.trustedClient)}>
                {rowData.trustedClient ? 'Yes' : 'No'}
              </Badge>
            ),
          },
        ]}
        data={clients}
        isLoading={loading}
        title="OIDC Clients"
        actions={myActions}
        options={{
          search: true,
          searchFieldAlignment: 'left',
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
          return <ClientDetailPage row={rowData} scopes={scopes} />
        }}
      />
      {/* END Content */}
      <GluuDialog
        row={item}
        name={item.clientName}
        handler={toggle}
        modal={modal}
        subject="openid connect client"
        onAccept={onDeletionConfirmed}
      />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    clients: state.oidcReducer.items,
    scopes: state.scopeReducer.items,
    loading: state.oidcReducer.loading,
    permissions: state.authReducer.permissions,
  }
}
export default connect(mapStateToProps)(ClientListPage)
