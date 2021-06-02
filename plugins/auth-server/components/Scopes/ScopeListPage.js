import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { Badge } from 'reactstrap'
import GluuDialog from '../../../../app/routes/Apps/Gluu/GluuDialog'
import ScopeDetailPage from '../Scopes/ScopeDetailPage'
import {
  getScopes,
  searchScopes,
  deleteScope,
  setCurrentItem,
} from '../../redux/actions/ScopeActions'
import GluuAdvancedSearch from '../../../../app/routes/Apps/Gluu/GluuAdvancedSearch'
import {
  hasPermission,
  buildPayload,
  SCOPE_READ,
  SCOPE_WRITE,
  SCOPE_DELETE,
} from '../../../../app/utils/PermChecker'

function ScopeListPage({ scopes, permissions, loading, dispatch }) {
  const userAction = {}
  const options = {}
  const [limit, setLimit] = useState(100000)
  const [pattern, setPattern] = useState(null)
  useEffect(() => {
    makeOptions()
    buildPayload(userAction, 'Fetch scopes', options)
    dispatch(getScopes(userAction))
  }, [])

  const myActions = []
  const history = useHistory()
  const [item, setItem] = useState({})
  const limitId = 'searchLimit'
  const patternId = 'searchPattern'
  const [modal, setModal] = useState(false)
  const toggle = () => setModal(!modal)

  function handleOptionsChange(i) {
    setLimit(document.getElementById(limitId).value)
    setPattern(document.getElementById(patternId).value)
  }
  function makeOptions() {
    options['limit'] = limit
    if (pattern) {
      options['pattern'] = pattern
    }
  }

  function handleGoToScopeAddPage() {
    return history.push('/auth-server/scope/new')
  }
  function handleGoToScopeEditPage(row) {
    dispatch(setCurrentItem(row))
    return history.push(`/auth-server/scope/edit:` + row.inum)
  }

  function handleScopeDelete(row) {
    dispatch(setCurrentItem(row))
    setItem(row)
    toggle()
  }

  function onDeletionConfirmed(message) {
    buildPayload(userAction, message, item.inum)
    dispatch(deleteScope(userAction))
    history.push('/auth-server/scopes')
    toggle()
  }

  if (hasPermission(permissions, SCOPE_WRITE)) {
    myActions.push((rowData) => ({
      icon: 'edit',
      iconProps: {
        color: 'primary',
        id: 'editScope' + rowData.inum,
      },
      tooltip: 'Edit Scope',
      onClick: (event, rowData) => handleGoToScopeEditPage(rowData),
      disabled: !hasPermission(permissions, SCOPE_WRITE),
    }))
  }

  if (hasPermission(permissions, SCOPE_READ)) {
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
  if (hasPermission(permissions, SCOPE_READ)) {
    myActions.push({
      icon: 'refresh',
      tooltip: 'search',
      iconProps: { color: 'primary', fontSize: 'large' },
      isFreeAction: true,
      onClick: () => {
        makeOptions()
        buildPayload(userAction, 'Search scopes', options)
        dispatch(searchScopes(userAction))
      },
    })
  }
  if (hasPermission(permissions, SCOPE_WRITE)) {
    myActions.push({
      icon: 'add',
      tooltip: 'Add Scope',
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => handleGoToScopeAddPage(),
      disabled: !hasPermission(permissions, SCOPE_WRITE),
    })
  }

  if (hasPermission(permissions, SCOPE_DELETE)) {
    myActions.push((rowData) => ({
      icon: 'delete',
      iconProps: {
        color: 'secondary',
        id: 'deleteScope' + rowData.inum,
      },
      tooltip: 'Delete Scope',
      onClick: (event, rowData) => handleScopeDelete(rowData),
      disabled: !hasPermission(permissions, SCOPE_DELETE),
    }))
  }

  return (
    <React.Fragment>
      <MaterialTable
        columns={[
          { title: 'iNum', field: 'inum' },
          { title: 'Display Name', field: 'displayName' },
          { title: 'Description', field: 'description' },
          {
            title: 'Type',
            field: 'scopeType',
            render: (rowData) => (
              <Badge color="primary">{rowData.scopeType}</Badge>
            ),
          },
        ]}
        data={scopes}
        isLoading={loading}
        title="Scopes"
        actions={myActions}
        options={{
          search: true,
          searchFieldAlignment: 'left',
          selection: false,
          pageSize: 10,
          headerStyle: {
            backgroundColor: '#03a96d',
            color: '#FFF',
            padding: '2px',
            textTransform: 'uppercase',
            fontSize: '18px',
          },
          actionsColumnIndex: -1,
        }}
        detailPanel={(rowData) => {
          return <ScopeDetailPage row={rowData} />
        }}
      />
      <GluuDialog
        row={item}
        name={item.id}
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
