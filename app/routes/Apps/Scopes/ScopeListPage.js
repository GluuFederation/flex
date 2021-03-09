import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { Badge } from 'reactstrap'
import GluuDialog from '../Gluu/GluuDialog'
import ClientDetailPage from '../Scopes/ScopeDetailPage'
import { getScopes, deleteScope } from '../../../redux/actions/ScopeActions'
//import scopes from './scopes'

function ScopeListPage({ scopes, permissions, loading, dispatch }) {
  useEffect(() => {
    dispatch(getScopes())
  }, [])
  const history = useHistory()
  const [item, setItem] = useState({})
  const [modal, setModal] = useState(false)
  const toggle = () => setModal(!modal)

  function handleGoToScopeAddPage() {
    return history.push('/scope/new')
  }
  function handleGoToScopeEditPage(row) {
    return history.push(`/scope/edit:` + row.inum)
  }
  function handleScopeDelete(row) {
    setItem(row)
    toggle()
  }
  function onDeletionConfirmed() {
    dispatch(deleteScope(item))
    toggle()
  }
  return (
    <React.Fragment>
      {/* START Content */}
      <MaterialTable
        columns={[
          { title: 'Inum', field: 'inum' },
          { title: 'ID', field: 'id' },
          { title: 'Type', field: 'scopeType' },
          {
            title: 'IS Default',
            field: 'defaultScope',
            render: (rowData) => (
              <Badge color={rowData.defaultScope ? 'primary' : 'info'}>
                {rowData.defaultScope ? 'Yes' : 'No'}
              </Badge>
            ),
          },
        ]}
        data={scopes}
        isLoading={loading}
        title=" Scopes"
        actions={[
          (rowData) => ({
            icon: 'edit',
            iconProps: {
              color: 'primary',
              id: 'editScope' + rowData.inum,
            },
            tooltip: 'Edit Scope',
            onClick: (event, rowData) => handleGoToScopeEditPage(rowData),
            disabled: false,
          }),
          {
            icon: 'add',
            tooltip: 'Add Scope',
            iconProps: { color: 'primary' },
            isFreeAction: true,
            onClick: () => handleGoToScopeAddPage(),
          },
          {
            icon: 'refresh',
            tooltip: 'Refresh Data',
            iconProps: { color: 'primary' },
            isFreeAction: true,
            onClick: () => {
              dispatch(getScopes())
            },
          },
          (rowData) => ({
            icon: 'delete',
            iconProps: {
              color: 'secondary',
              id: 'deleteScope' + rowData.inum,
            },
            tooltip: rowData.deletable
              ? 'Delete Scope'
              : "This Scope can't be detele",
            onClick: (event, rowData) => handleScopeDelete(rowData),
            disabled: rowData.defaultScope,
          }),
        ]}
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
        handler={toggle}
        modal={modal}
        subject="scope"
        onAccept={onDeletionConfirmed}
      />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    scopes: state.scopeReducer.items,
    loading: state.scopeReducer.loading,
    permissions: state.authReducer.permissions,
  }
}
export default connect(mapStateToProps)(ScopeListPage)
