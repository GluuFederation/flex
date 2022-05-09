import React, { useState, useEffect } from 'react'
import MaterialTable from '@material-table/core'
import { DeleteOutlined } from '@material-ui/icons'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { Paper } from '@material-ui/core'
import { Card, CardBody, FormGroup, Badge } from '../../../../app/components'
import { getScopes } from '../../redux/actions/ScopeActions'
import GluuRibbon from '../../../../app/routes/Apps/Gluu/GluuRibbon'
import GluuDialog from '../../../../app/routes/Apps/Gluu/GluuDialog'
import ClientDetailPage from '../Clients/ClientDetailPage'
import GluuAdvancedSearch from '../../../../app/routes/Apps/Gluu/GluuAdvancedSearch'
import GluuViewWrapper from '../../../../app/routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from '../../../../app/routes/Apps/Gluu/styles/applicationstyle'
import { useTranslation } from 'react-i18next'
import {
  LIMIT_ID,
  LIMIT,
  PATTERN,
  PATTERN_ID,
  SEARCHING_OIDC_CLIENTS,
  FETCHING_OIDC_CLIENTS,
} from '../../common/Constants'
import {
  getOpenidClients,
  searchClients,
  setCurrentItem,
  deleteClient,
  viewOnly,
} from '../../redux/actions/OIDCActions'
import {
  hasPermission,
  buildPayload,
  CLIENT_WRITE,
  CLIENT_READ,
  CLIENT_DELETE,
} from '../../../../app/utils/PermChecker'
import ClientShowScopes from './ClientShowScopes'

function ClientListPage({ clients, permissions, scopes, loading, dispatch }) {
  const { t } = useTranslation()
  const userAction = {}
  const options = {}
  const myActions = []
  const history = useHistory()
  const pageSize = localStorage.getItem('paggingSize') || 10

  const [scopesModal, setScopesModal] = useState({
    data: [],
    show: false,
  })
  const [limit, setLimit] = useState(200)
  const [pattern, setPattern] = useState(null)
  const [item, setItem] = useState({})
  const [modal, setModal] = useState(false)
  const toggle = () => setModal(!modal)

  let memoLimit = limit
  let memoPattern = pattern

  const handler = () => {
    setScopesModal({
      data: [],
      show: false,
    })
  }
  const setScopeData = (data) => {
    setScopesModal({
      data: data,
      show: true,
    })
  }
  const tableColumns = [
    {
      title: `${t('fields.inum')}`,
      field: 'inum',
      hidden: true,
      sorting: true,
      searchable: true,
    },
    { title: `${t('fields.client_id')}`, field: 'inum' },
    { title: `${t('fields.client_name')}`, field: 'displayName' },
    {
      title: `${t('fields.grant_types')}`,
      field: 'grantTypes',
      render: (rowData) => {
        return rowData.grantTypes.map((data) => {
          return (
            <div style={{ maxWidth: 120, overflow: 'auto' }}>
              <Badge color="primary">{data}</Badge>
            </div>
          )
        })
      },
    },
    {
      title: `${t('fields.scopes')}`,
      field: 'scopes',
      render: (rowData) => {
        return (
          <Badge
            color="primary"
            role={'button'}
            onClick={() => setScopeData(rowData.scopes)}
          >
            {rowData.scopes?.length || '0'}
          </Badge>
        )
      },
    },
    {
      title: `${t('fields.is_trusted_client')}`,
      field: 'trustedClient',
      type: 'boolean',
      render: (rowData) => (
        <Badge color={getTrustedTheme(rowData.trustedClient)}>
          {rowData.trustedClient ? t('options.yes') : t('options.no')}
        </Badge>
      ),
    },
  ]
  useEffect(() => {
    makeOptions()
    buildPayload(userAction, FETCHING_OIDC_CLIENTS, options)
    dispatch(getOpenidClients(userAction))
  }, [])
  useEffect(() => {
    buildPayload(userAction, '', options)
    dispatch(getScopes(userAction))
  }, [])
  function handleOptionsChange(event) {
    if (event.target.name == 'limit') {
      memoLimit = event.target.value
    } else if (event.target.name == 'pattern') {
      memoPattern = event.target.value
    }
  }
  function handleGoToClientEditPage(row, edition) {
    dispatch(viewOnly(edition))
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
    setLimit(memoLimit)
    setPattern(memoPattern)
    options[LIMIT] = memoLimit
    if (memoPattern) {
      options[PATTERN] = memoPattern
    }
  }
  function onDeletionConfirmed(message) {
    buildPayload(userAction, message, item.inum)
    dispatch(deleteClient(userAction))
    history.push('/auth-server/clients')
    toggle()
  }

  if (hasPermission(permissions, CLIENT_WRITE)) {
    myActions.push((rowData) => ({
      icon: 'edit',
      iconProps: {
        id: 'editClient' + rowData.inum,
      },
      tooltip: `${t('messages.edit_client')}`,
      onClick: (event, rowData) => handleGoToClientEditPage(rowData, false),
      disabled: false,
    }))
  }
  if (hasPermission(permissions, CLIENT_READ)) {
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
  if (hasPermission(permissions, CLIENT_READ)) {
    myActions.push({
      icon: 'refresh',
      tooltip: `${t('messages.refresh')}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => {
        makeOptions()
        buildPayload(userAction, SEARCHING_OIDC_CLIENTS, options)
        dispatch(searchClients(userAction))
      },
    })
  }
  if (hasPermission(permissions, CLIENT_READ)) {
    myActions.push((rowData) => ({
      icon: 'visibility',
      iconProps: {
        id: 'viewClient' + rowData.inum,
      },
      tooltip: `${t('messages.view_client_details')}`,
      onClick: (event, rowData) => handleGoToClientEditPage(rowData, true),
      disabled: false,
    }))
  }
  if (hasPermission(permissions, CLIENT_DELETE)) {
    myActions.push((rowData) => ({
      icon: () => <DeleteOutlined />,
      iconProps: {
        color: 'secondary',
        id: 'deleteClient' + rowData.inum,
      },
      tooltip: rowData.deletable
        ? `${t('messages.delete_client')}`
        : `${t('messages.not_deletable_client')}`,
      onClick: (event, rowData) => handleClientDelete(rowData),
      disabled: false,
    }))
  }
  if (hasPermission(permissions, CLIENT_WRITE)) {
    myActions.push({
      icon: 'add',
      tooltip: `${t('messages.add_client')}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => handleGoToClientAddPage(),
    })
  }
  //ToDo to be deleted
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
  //ToDo to be deleted
  function getClientStatus(status) {
    if (!status) {
      return t('options.enabled')
    } else {
      return t('options.disabled')
    }
  }

  return (
    <Card>
      <ClientShowScopes
        handler={handler}
        isOpen={scopesModal.show}
        data={scopesModal.data}
      />
      <GluuRibbon title={t('titles.oidc_clients')} fromLeft />
      <CardBody>
        <FormGroup row />
        <FormGroup row />
        <GluuViewWrapper canShow={hasPermission(permissions, CLIENT_READ)}>
          <MaterialTable
            components={{
              Container: (props) => <Paper {...props} elevation={0} />,
            }}
            columns={tableColumns}
            data={clients}
            isLoading={loading}
            title=""
            actions={myActions}
            options={{
              search: true,
              searchFieldAlignment: 'left',
              selection: false,
              pageSize: pageSize,
              headerStyle: applicationStyle.tableHeaderStyle,
              actionsColumnIndex: -1,
            }}
            detailPanel={(rowData) => {
              return <ClientDetailPage row={rowData.rowData} scopes={scopes} />
            }}
          />
        </GluuViewWrapper>
        {hasPermission(permissions, CLIENT_DELETE) && (
          <GluuDialog
            row={item}
            name={item.clientName}
            handler={toggle}
            modal={modal}
            subject="openid connect client"
            onAccept={onDeletionConfirmed}
          />
        )}
      </CardBody>
    </Card>
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
