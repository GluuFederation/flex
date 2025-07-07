import React, { useState, useEffect, useContext } from 'react'
import MaterialTable from '@material-table/core'
import { DeleteOutlined } from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Link, Paper, TablePagination } from '@mui/material'
import { Card, CardBody, Badge } from 'Components'
import { getScopes } from 'Plugins/auth-server/redux/features/scopeSlice'
import { resetUMAResources } from 'Plugins/auth-server/redux/features/umaResourceSlice'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import ClientDetailPage from '../Clients/ClientDetailPage'
import GluuAdvancedSearch from 'Routes/Apps/Gluu/GluuAdvancedSearch'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useTranslation } from 'react-i18next'
import { LIMIT_ID, LIMIT, PATTERN, PATTERN_ID } from 'Plugins/auth-server/common/Constants'
import {
  getOpenidClients,
  setCurrentItem,
  deleteClient,
  viewOnly,
} from 'Plugins/auth-server/redux/features/oidcSlice'
import { buildPayload, CLIENT_WRITE, CLIENT_READ, CLIENT_DELETE } from 'Utils/PermChecker'
import { useCedarling } from '@/cedarling'
import ClientShowScopes from './ClientShowScopes'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'

function ClientListPage() {
  const { t } = useTranslation()
  const { hasCedarPermission, authorize } = useCedarling()
  const dispatch = useDispatch()
  const nonExtensibleClients = useSelector((state) => state.oidcReducer.items)
  const { totalItems } = useSelector((state) => state.oidcReducer)
  const scopes = useSelector((state) => state.scopeReducer.items)
  const loading = useSelector((state) => state.oidcReducer.loading)
  const { permissions: cedarPermissions } = useSelector((state) => state.cedarPermissions)
  let clients = [...(nonExtensibleClients ?? [])]
  clients = clients?.map(addOrg)
  const userAction = {}
  const options = {}
  const myActions = []
  const navigate = useNavigate()
  const { search } = useLocation()

  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }
  const [scopeClients, setScopeClients] = useState()
  const [haveScopeINUMParam] = useState(search.indexOf('?scopeInum=') > -1)
  const [isPageLoading, setIsPageLoading] = useState(loading)
  const [pageNumber, setPageNumber] = useState(0)
  SetTitle(t('titles.oidc_clients'))

  // Permission initialization
  useEffect(() => {
    const authorizePermissions = async () => {
      const permissions = [CLIENT_READ, CLIENT_WRITE, CLIENT_DELETE]
      try {
        for (const permission of permissions) {
          await authorize([permission])
        }
      } catch (error) {
        console.error('Error authorizing LDAP permissions:', error)
      }
    }

    authorizePermissions()
  }, [])

  const [scopesModal, setScopesModal] = useState({
    data: [],
    show: false,
  })
  const [limit, setLimit] = useState(10)
  const [pattern, setPattern] = useState(null)
  const [item, setItem] = useState({})
  const [modal, setModal] = useState(false)
  const toggle = () => setModal(!modal)

  let memoLimit = limit
  let memoPattern = pattern

  function addOrg(...args) {
    const client = { ...args[0] }
    let org = '-'
    if (Object.prototype.hasOwnProperty.call(client, 'o')) {
      client['organization'] = client.o
      return client
    }
    if (
      Object.prototype.hasOwnProperty.call(client, 'customAttributes') &&
      Array.isArray(client.customAttributes)
    ) {
      const results = client.customAttributes.filter(
        (item) => item.name == 'o' || item.name == 'organization',
      )
      if (results.length !== 0) {
        org = results[0].values[0]
      }
    }
    client['organization'] = org
    return client
  }

  function shouldHideOrgColumn(clients) {
    return !clients?.some((client) => client.organization != '-')
  }

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
    { title: `${t('fields.client_name')}`, field: 'clientName' },
    {
      title: `${t('fields.grant_types')}`,
      field: 'grantTypes',
      render: (rowData) => {
        return rowData?.grantTypes?.map((data) => {
          return (
            <div key={data} style={{ maxWidth: 140, overflow: 'auto' }}>
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
          <Link className="common-link" onClick={() => setScopeData(rowData.scopes)}>
            {rowData.scopes?.length || '0'}
          </Link>
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
    {
      title: `${t('fields.organization')}`,
      field: 'organization',
      hidden: shouldHideOrgColumn(clients),
      sorting: true,
      searchable: true,
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
      dispatch(getOpenidClients({ action: options }))

      buildPayload(userAction, '', options)
      userAction['limit'] = 100
      dispatch(getScopes({ action: userAction }))

      setTimeout(() => {
        setIsPageLoading(false)
      }, 3000)
    }
  }, [haveScopeINUMParam])

  useEffect(() => {
    dispatch(resetUMAResources())
  }, [])
  useEffect(() => {}, [cedarPermissions])

  function handleOptionsChange(event) {
    if (event.target.name == 'limit') {
      memoLimit = event.target.value
    } else if (event.target.name == 'pattern') {
      memoPattern = event.target.value
      if (event.keyCode === 13) {
        makeOptions()
        dispatch(getOpenidClients({ action: options }))
      }
    }
  }
  function handleGoToClientEditPage(row, edition) {
    dispatch(viewOnly({ view: edition }))
    dispatch(setCurrentItem({ item: row }))
    return navigate(`/auth-server/client/edit/:` + row.inum.substring(0, 4))
  }
  function handleGoToClientAddPage() {
    return navigate('/auth-server/client/new')
  }
  function handleClientDelete(row) {
    dispatch(setCurrentItem({ item: row }))
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
    buildPayload(userAction, message, item)
    dispatch(deleteClient({ action: userAction }))
    navigate('/auth-server/clients')
    toggle()
  }

  if (hasCedarPermission(CLIENT_WRITE)) {
    myActions.push({
      icon: 'add',
      tooltip: `${t('messages.add_client')}`,
      iconProps: { color: 'primary' },
      ['data-testid']: `${t('messages.add_client')}`,
      isFreeAction: true,
      onClick: () => handleGoToClientAddPage(),
    })
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

  if (hasCedarPermission(CLIENT_READ)) {
    myActions.push({
      icon: () => (
        <GluuAdvancedSearch
          limitId={LIMIT_ID}
          patternId={PATTERN_ID}
          limit={limit}
          pattern={pattern}
          handler={handleOptionsChange}
          showLimit={false}
        />
      ),
      tooltip: `${t('messages.advanced_search')}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => {},
    })
    myActions.push({
      icon: 'refresh',
      tooltip: `${t('messages.refresh')}`,
      iconProps: { color: 'primary' },
      ['data-testid']: `${t('messages.refresh')}`,
      isFreeAction: true,
      onClick: () => {
        makeOptions()
        // buildPayload(userAction, SEARCHING_OIDC_CLIENTS, options)
        dispatch(getOpenidClients({ action: options }))
      },
    })
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
  if (hasCedarPermission(CLIENT_DELETE)) {
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

  function getTrustedTheme(status) {
    if (status) {
      return `primary-${selectedTheme}`
    } else {
      return 'secondary'
    }
  }

  const onPageChangeClick = (page) => {
    makeOptions()
    const startCount = page * limit
    options['startIndex'] = parseInt(startCount)
    options['limit'] = limit
    setPageNumber(page)
    dispatch(getOpenidClients({ action: options }))
  }
  const onRowCountChangeClick = (count) => {
    makeOptions()
    options['startIndex'] = 0
    options['limit'] = count
    setPageNumber(0)
    setLimit(count)
    dispatch(getOpenidClients({ action: options }))
  }

  return (
    <Card style={applicationStyle.mainCard}>
      <ClientShowScopes handler={handler} isOpen={scopesModal.show} data={scopesModal.data} />
      <CardBody>
        <GluuViewWrapper canShow={hasCedarPermission(CLIENT_READ)}>
          <MaterialTable
            key={limit ? limit : 0}
            components={{
              Container: (props) => <Paper {...props} elevation={0} />,
              Pagination: () => (
                <TablePagination
                  count={totalItems}
                  page={pageNumber}
                  onPageChange={(prop, page) => {
                    onPageChangeClick(page)
                  }}
                  rowsPerPage={limit}
                  onRowsPerPageChange={(prop, count) => onRowCountChangeClick(count.props.value)}
                />
              ),
            }}
            columns={tableColumns}
            data={haveScopeINUMParam ? scopeClients : clients}
            isLoading={isPageLoading ? isPageLoading : loading}
            title=""
            actions={myActions}
            options={{
              search: false,
              idSynonym: 'inum',
              searchFieldAlignment: 'left',
              selection: false,
              pageSize: limit,
              headerStyle: {
                ...applicationStyle.tableHeaderStyle,
                ...bgThemeColor,
              },
              actionsColumnIndex: -1,
            }}
            detailPanel={(rowData) => {
              return <ClientDetailPage row={rowData.rowData} scopes={scopes} />
            }}
          />
        </GluuViewWrapper>
        {hasCedarPermission(CLIENT_DELETE) && (
          <GluuDialog
            row={item}
            name={item?.clientName?.value || ''}
            handler={toggle}
            modal={modal}
            subject="openid connect client"
            onAccept={onDeletionConfirmed}
            feature={adminUiFeatures.oidc_clients_delete}
          />
        )}
      </CardBody>
    </Card>
  )
}

export default ClientListPage
