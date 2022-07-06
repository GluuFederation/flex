import React, { useState, useEffect } from 'react'
import MaterialTable from '@material-table/core'
import { DeleteOutlined } from '@material-ui/icons'
import { Paper } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { Badge } from 'reactstrap'
import { Card, CardBody, FormGroup } from 'Components'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import GluuAdvancedSearch from 'Routes/Apps/Gluu/GluuAdvancedSearch'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import ScopeDetailPage from '../Scopes/ScopeDetailPage'
import { useTranslation } from 'react-i18next'
import {
  getScopes,
  searchScopes,
  deleteScope,
  setCurrentItem,
} from 'Plugins/auth-server/redux/actions/ScopeActions'
import {
  hasPermission,
  buildPayload,
  SCOPE_READ,
  SCOPE_WRITE,
  SCOPE_DELETE,
} from 'Utils/PermChecker'
import {
  LIMIT_ID,
  LIMIT,
  PATTERN,
  PATTERN_ID,
  SEARCHING_SCOPES,
  FETCHING_SCOPES,
} from 'Plugins/auth-server/common/Constants'
import SetTitle from 'Utils/SetTitle'

function ScopeListPage({ scopes, permissions, loading, dispatch }) {
  const { t } = useTranslation()
  const userAction = {}
  const options = {}
  const myActions = []
  const history = useHistory()
  const [item, setItem] = useState({})
  const [modal, setModal] = useState(false)
  const pageSize = localStorage.getItem('paggingSize') || 10
  const [limit, setLimit] = useState(500)
  const [pattern, setPattern] = useState(null)
  const toggle = () => setModal(!modal)
  SetTitle(t('titles.scopes'))

  let memoLimit = limit
  let memoPattern = pattern

  const tableColumns = [
    { title: `${t('fields.inum')}`, field: 'inum' },
    { title: `${t('fields.displayname')}`, field: 'displayName' },
    { title: `${t('fields.description')}`, field: 'description' },
    {
      title: `${t('fields.scope_type')}`,
      field: 'scopeType',
      render: (rowData) => (
        <Badge key={rowData.inum} color="primary">
          {rowData.scopeType}
        </Badge>
      ),
    },
  ]

  useEffect(() => {
    makeOptions()
    buildPayload(userAction, FETCHING_SCOPES, options)
    dispatch(getScopes(userAction))
  }, [])
  function handleOptionsChange(event) {
    if (event.target.name == 'limit') {
      memoLimit = event.target.value
    } else if (event.target.name == 'pattern') {
      memoPattern = event.target.value
    }
  }

  function makeOptions() {
    setLimit(memoLimit)
    setPattern(memoPattern)
    options[LIMIT] = memoLimit
    if (memoPattern) {
      options[PATTERN] = memoPattern
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
          pattern={pattern}
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
      icon: () => <DeleteOutlined />,
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
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <GluuViewWrapper canShow={hasPermission(permissions, SCOPE_READ)}>
          <MaterialTable
            components={{
              Container: (props) => <Paper {...props} elevation={0} />,
            }}
            columns={tableColumns}
            data={scopes}
            isLoading={loading}
            title=""
            actions={myActions}
            options={{
              columnsButton: true,
              search: true,
              searchFieldAlignment: 'left',
              selection: false,
              pageSize: pageSize,
              headerStyle: applicationStyle.tableHeaderStyle,
              actionsColumnIndex: -1,
            }}
            detailPanel={(rowData) => {
              return <ScopeDetailPage row={rowData.rowData} />
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
      </CardBody>
    </Card>
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
