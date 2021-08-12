import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { Badge } from 'reactstrap'
import GluuDialog from '../../../../app/routes/Apps/Gluu/GluuDialog'
import GluuAdvancedSearch from '../../../../app/routes/Apps/Gluu/GluuAdvancedSearch'
import GluuViewWrapper from '../../../../app/routes/Apps/Gluu/GluuViewWrapper'
import ScopeDetailPage from '../Scopes/ScopeDetailPage'
import { useTranslation } from 'react-i18next'
import {
  getScopes,
  searchScopes,
  deleteScope,
  setCurrentItem,
} from '../../redux/actions/ScopeActions'
import {
  hasPermission,
  buildPayload,
  SCOPE_READ,
  SCOPE_WRITE,
  SCOPE_DELETE,
} from '../../../../app/utils/PermChecker'
import {
  LIMIT_ID,
  LIMIT,
  PATTERN,
  PATTERN_ID,
  SEARCHING_SCOPES,
  FETCHING_SCOPES,
} from '../../common/Constants'

function ScopeListPage({ scopes, permissions, loading, dispatch }) {
  const { t } = useTranslation()
  const userAction = {}
  const options = {}
  const myActions = []
  const history = useHistory()
  const [item, setItem] = useState({})
  const [modal, setModal] = useState(false)
  const [limit, setLimit] = useState(100000)
  const [pattern, setPattern] = useState(null)
  const [pageSize, setPageSize] = useState(localStorage.getItem('paggingSize'))
  const toggle = () => setModal(!modal)

  useEffect(() => {
    makeOptions()
    buildPayload(userAction, FETCHING_SCOPES, options)
    dispatch(getScopes(userAction))
  }, [])

  function handleOptionsChange(i) {
    setLimit(document.getElementById(LIMIT_ID).value)
    setPattern(document.getElementById(PATTERN_ID).value)
  }

  function makeOptions() {
    options[LIMIT] = limit
    if (pattern) {
      options[PATTERN] = pattern
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
      tooltip: `${t('messages.edit_scope')}`,
      onClick: (event, rowData) => handleGoToScopeEditPage(rowData),
      disabled: !hasPermission(permissions, SCOPE_WRITE),
    }))
  }

  if (hasPermission(permissions, SCOPE_READ)) {
    myActions.push({
      icon: () => (
        <GluuAdvancedSearch
          limitId={LIMIT_ID}
          patternId={PATTERN_ID}
          limit={limit}
          handler={handleOptionsChange}
        />
      ),
      tooltip: `${t('messages.advanced_search')}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => {},
    })
  }
  if (hasPermission(permissions, SCOPE_READ)) {
    myActions.push({
      icon: 'refresh',
      tooltip: `${t('messages.refresh')}`,
      iconProps: { color: 'primary', fontSize: 'large' },
      isFreeAction: true,
      onClick: () => {
        makeOptions()
        buildPayload(userAction, SEARCHING_SCOPES, options)
        dispatch(searchScopes(userAction))
      },
    })
  }
  if (hasPermission(permissions, SCOPE_WRITE)) {
    myActions.push({
      icon: 'add',
      tooltip: `${t('messages.add_scope')}`,
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
      tooltip: `${t('Delete Scope')}`,
      onClick: (event, rowData) => handleScopeDelete(rowData),
      disabled: !hasPermission(permissions, SCOPE_DELETE),
    }))
  }

  return (
    <React.Fragment>
      <GluuViewWrapper canShow={hasPermission(permissions, SCOPE_READ)}>
        <MaterialTable
          columns={[
            { title: `${t('fields.inum')}`, field: 'inum' },
            { title: `${t('fields.displayname')}`, field: 'displayName' },
            { title: `${t('fields.description')}`, field: 'description' },
            {
              title: `${t('fields.scope_type')}`,
              field: 'scopeType',
              render: (rowData) => (
                <Badge color="primary">{rowData.scopeType}</Badge>
              ),
            },
          ]}
          data={scopes}
          isLoading={loading}
          title={t('titles.scopes')}
          actions={myActions}
          options={{
            search: true,
            searchFieldAlignment: 'left',
            selection: false,
            pageSize: pageSize,
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
      </GluuViewWrapper>
      {hasPermission(permissions, SCOPE_DELETE) && (
        <GluuDialog
          row={item}
          name={item.id}
          handler={toggle}
          modal={modal}
          subject="scope"
          onAccept={onDeletionConfirmed}
        />
      )}
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
