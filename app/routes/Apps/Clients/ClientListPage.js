import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { Badge } from 'reactstrap'
import GluuDialog from '../Gluu/GluuDialog'
import ClientDetailPage from '../Clients/ClientDetailPage'
import {
  getOpenidClients,
  setCurrentItem,
  deleteClient,
} from '../../../redux/actions/OpenidClientActions'
import {
  hasPermission,
  CLIENT_WRITE,
  CLIENT_READ,
  CLIENT_DELETE,
} from '../../../utils/PermChecker'
function ClientListPage({ clients, permissions, loading, dispatch }) {
  useEffect(() => {
    dispatch(getOpenidClients())
  }, [])

  const myActions = []
  const history = useHistory()
  const [item, setItem] = useState({})
  const [modal, setModal] = useState(false)
  const toggle = () => setModal(!modal)

  function handleGoToClientEditPage(row) {
    dispatch(setCurrentItem(row))
    return history.push(`/client/edit:` + row.inum.substring(0, 4))
  }
  function handleGoToClientAddPage() {
    return history.push('/client/new')
  }
  function handleClientDelete(row) {
    dispatch(setCurrentItem(row))
    setItem(row)
    toggle()
  }

  function onDeletionConfirmed() {
    dispatch(deleteClient(item.inum))
    history.push('/clients')
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
  if (hasPermission(permissions, CLIENT_WRITE)) {
    myActions.push({
      icon: 'add',
      tooltip: 'Add Client',
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => handleGoToClientAddPage(),
    })
  }
  if (hasPermission(permissions, CLIENT_READ)) {
    myActions.push({
      icon: 'refresh',
      tooltip: 'Refresh Data',
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => {
        dispatch(getOpenidClients())
      },
    })
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
        title="OpenId Connect Clients"
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
          return <ClientDetailPage row={rowData} />
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
    clients: state.openidClientReducer.items,
    loading: state.openidClientReducer.loading,
    permissions: state.authReducer.permissions,
  }
}
export default connect(mapStateToProps)(ClientListPage)
