import React, { useState, useEffect, useContext } from 'react'
import MaterialTable from '@material-table/core'
import { DeleteOutlined } from '@material-ui/icons'
import { useHistory, useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import { Paper } from '@material-ui/core'
import { Card, CardBody, Badge } from 'Components'
import { getScopes } from 'Plugins/auth-server/redux/actions/ScopeActions'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import ClientDetailPage from '../Clients/ClientDetailPage'
import GluuAdvancedSearch from 'Routes/Apps/Gluu/GluuAdvancedSearch'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useTranslation } from 'react-i18next'
import {
  LIMIT_ID,
  LIMIT,
  PATTERN,
  PATTERN_ID,
  SEARCHING_OIDC_CLIENTS,
  FETCHING_OIDC_CLIENTS,
} from 'Plugins/auth-server/common/Constants'
import {
  getOpenidClients,
  searchClients,
  setCurrentItem,
  deleteClient,
  viewOnly,
} from 'Plugins/auth-server/redux/actions/OIDCActions'
import {
  hasPermission,
  buildPayload,
  CLIENT_WRITE,
  CLIENT_READ,
  CLIENT_DELETE,
} from 'Utils/PermChecker'
import ClientShowScopes from './ClientShowScopes'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'

function ClientListPage({ clients, permissions, scopes, loading, dispatch }) {
  const { t } = useTranslation()
  const userAction = {}
  const options = {}
  const myActions = []
  const history = useHistory()
  const { search } = useLocation();
  const pageSize = localStorage.getItem('paggingSize') || 10
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }
  const [scopeClients, setScopeClients] = useState()
  const [haveScopeINUMParam] = useState(search.indexOf('?scopeInum=') > -1)
  const [isPageLoading, setIsPageLoading] = useState(loading)

  SetTitle(t('titles.oidc_clients'))

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
        return rowData?.grantTypes?.map((data) => {
          return (
            // eslint-disable-next-line react/jsx-key
            <div style={{ maxWidth: 120, overflow: 'auto' }}>
              <Badge color={`primary-${selectedTheme}`}>{data}</Badge>
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
            color={`primary-${selectedTheme}`}
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
    if (haveScopeINUMParam) {
      const scopeInumParam = search.replace('?scopeInum=', '')
      
      if (scopeInumParam.length > 0) {
        const clientsScope = scopes.find(({ inum }) => inum === scopeInumParam)?.clients || []
        setScopeClients(clientsScope)
      }
    } else {
      setIsPageLoading(true)
      makeOptions()
      buildPayload(userAction, FETCHING_OIDC_CLIENTS, options)
      dispatch(getOpenidClients(userAction))

      buildPayload(userAction, '', options)
      dispatch(getScopes(userAction))

      setTimeout(() => {
        setIsPageLoading(false)
      }, 3000);
    }
  }, [haveScopeINUMParam])

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

  function getTrustedTheme(status) {
    if (status) {
      return `primary-${selectedTheme}`
    } else {
      return 'dimmed'
    }
  }

  return (
    <Card style={applicationStyle.mainCard}>
      <ClientShowScopes
        handler={handler}
        isOpen={scopesModal.show}
        data={scopesModal.data}
      />
      <CardBody>
        <GluuViewWrapper canShow={hasPermission(permissions, CLIENT_READ)}>
          <MaterialTable
            components={{
              Container: (props) => <Paper {...props} elevation={0} />,
            }}
            columns={tableColumns}
            data={haveScopeINUMParam ? scopeClients : clients}
            isLoading={isPageLoading}
            title=""
            actions={myActions}
            options={{
              search: true,
              searchFieldAlignment: 'left',
              selection: false,
              pageSize: pageSize,
              headerStyle: { ...applicationStyle.tableHeaderStyle, ...bgThemeColor },
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
