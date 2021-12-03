import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { Paper } from '@material-ui/core'
import { Badge } from 'reactstrap'
import { Card, CardBody, FormGroup } from '../../../../app/components'
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

function ClientListPage({ clients, permissions, scopes, loading, dispatch }) {
  const { t } = useTranslation()
  const userAction = {}
  const options = {}
  const myActions = []
  const history = useHistory()
  const pageSize = localStorage.getItem('paggingSize') || 10
  const [limit, setLimit] = useState(200)
  const [pattern, setPattern] = useState(null)
  const [item, setItem] = useState({})
  const [modal, setModal] = useState(false)
  const toggle = () => setModal(!modal)
  useEffect(() => {
    makeOptions()
    buildPayload(userAction, FETCHING_OIDC_CLIENTS, options)
    dispatch(getOpenidClients(userAction))
  }, [])
  function handleOptionsChange() {
    setLimit(document.getElementById(LIMIT_ID).value)
    setPattern(document.getElementById(PATTERN_ID).value)
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
    options[LIMIT] = limit
    if (pattern) {
      options[PATTERN] = pattern
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
        color: 'primary',
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
        color: 'primary',
        id: 'viewClient' + rowData.inum,
      },
      tooltip: `${t('messages.view_client_details')}`,
      onClick: (event, rowData) => handleGoToClientEditPage(rowData, true),
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
      return t('options.enabled')
    } else {
      return t('options.disabled')
    }
  }
  return (
    <Card>
      <GluuRibbon title={t('titles.oidc_clients')} fromLeft />
      <CardBody>
        <FormGroup row />
        <FormGroup row />
        <GluuViewWrapper canShow={hasPermission(permissions, CLIENT_READ)}>
          <MaterialTable
            components={{
              Container: (props) => <Paper {...props} elevation={0} />,
            }}
            columns={[
              {
                title: `${t('fields.inum')}`,
                field: 'inum',
                hidden: true,
                sorting: true,
                searchable: true,
              },
              { title: `${t('fields.client_name')}`, field: 'clientName' },
              {
                title: `${t('fields.application_type')}`,
                field: 'applicationType',
              },
              { title: `${t('fields.subject_type')}`, field: 'subjectType' },
              {
                title: `${t('fields.status')}`,
                field: 'disabled',
                type: 'boolean',
                render: (rowData) => (
                  <Badge color={getBadgeTheme(rowData.disabled)}>
                    {getClientStatus(rowData.disabled)}
                  </Badge>
                ),
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
            ]}
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
              return <ClientDetailPage row={rowData} scopes={scopes} />
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
