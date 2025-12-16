import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react'
import MaterialTable from '@material-table/core'
import { DeleteOutlined } from '@mui/icons-material'
import { useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { Link, Paper, TablePagination } from '@mui/material'
import { Card, CardBody, Badge } from 'Components'
import { getScopes, getScopeByInum } from 'Plugins/auth-server/redux/features/scopeSlice'
import { resetUMAResources } from 'Plugins/auth-server/redux/features/umaResourceSlice'
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
  WITH_ASSOCIATED_CLIENTS,
} from 'Plugins/auth-server/common/Constants'
import {
  getOpenidClients,
  setCurrentItem,
  deleteClient,
  viewOnly,
} from 'Plugins/auth-server/redux/features/oidcSlice'
import { buildPayload } from 'Utils/PermChecker'
import { useCedarling } from '@/cedarling'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import ClientShowScopes from './ClientShowScopes'
import { findAndFilterScopeClients } from './ClientScopeUtils'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import customColors from '@/customColors'

function ClientListPage() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { navigateToRoute } = useAppNavigation()
  const { search } = useLocation()
  const theme = useContext(ThemeContext)
  const {
    hasCedarReadPermission,
    hasCedarWritePermission,
    hasCedarDeletePermission,
    authorizeHelper,
  } = useCedarling()

  const nonExtensibleClients = useSelector((state) => state.oidcReducer.items) || []
  const { totalItems } = useSelector((state) => state.oidcReducer)
  const scopes = useSelector((state) => state.scopeReducer.items) || []
  const scopeItem = useSelector((state) => state.scopeReducer.item)
  const clientLoading = useSelector((state) => state.oidcReducer.loading)
  const scopeLoading = useSelector((state) => state.scopeReducer.loading)

  const [pageNumber, setPageNumber] = useState(0)
  const [limit, setLimit] = useState(10)
  const [pattern, setPattern] = useState(null)
  const [item, setItem] = useState({})
  const [modal, setModal] = useState(false)
  const [scopesModal, setScopesModal] = useState({
    data: [],
    show: false,
  })

  const clientResourceId = useMemo(() => ADMIN_UI_RESOURCES.Clients, [])
  const selectedTheme = useMemo(() => theme?.state?.theme || 'light', [theme?.state?.theme])
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const bgThemeColor = useMemo(
    () => ({ background: themeColors.background }),
    [themeColors.background],
  )

  const scopeInumParam = useMemo(() => {
    const params = new URLSearchParams(search)
    return params.get('scopeInum')
  }, [search])
  const haveScopeINUMParam = useMemo(() => !!scopeInumParam, [scopeInumParam])

  const clientScopes = useMemo(
    () => CEDAR_RESOURCE_SCOPES[clientResourceId] || [],
    [clientResourceId],
  )

  const canReadClient = useMemo(
    () => hasCedarReadPermission(clientResourceId),
    [hasCedarReadPermission, clientResourceId],
  )

  const canWriteClient = useMemo(
    () => hasCedarWritePermission(clientResourceId),
    [hasCedarWritePermission, clientResourceId],
  )

  const canDeleteClient = useMemo(
    () => hasCedarDeletePermission(clientResourceId),
    [hasCedarDeletePermission, clientResourceId],
  )

  const addOrg = useCallback((client) => {
    if (!client) return client
    const clientCopy = { ...client }
    let org = '-'
    if (Object.prototype.hasOwnProperty.call(clientCopy, 'o')) {
      clientCopy.organization = clientCopy.o
      return clientCopy
    }
    if (
      Object.prototype.hasOwnProperty.call(clientCopy, 'customAttributes') &&
      Array.isArray(clientCopy.customAttributes)
    ) {
      const results = clientCopy.customAttributes.filter(
        (item) => item.name === 'o' || item.name === 'organization',
      )
      if (results.length !== 0) {
        org = results[0].values[0]
      }
    }
    clientCopy.organization = org
    return clientCopy
  }, [])

  const shouldHideOrgColumn = useCallback(
    (clientsList) => !clientsList?.some((client) => client.organization !== '-'),
    [],
  )

  const filterClientsByScope = useCallback(
    (scopeInum, scopeDn) => {
      const normalizedScopeDn =
        typeof scopeDn === 'string' && scopeDn.trim().length > 0 ? scopeDn : null

      return nonExtensibleClients.filter((client) => {
        if (!client.scopes || !Array.isArray(client.scopes)) return false
        return client.scopes.some((clientScope) => {
          return (
            (normalizedScopeDn && clientScope === normalizedScopeDn) ||
            clientScope.includes(`inum=${scopeInum}`) ||
            clientScope === scopeInum
          )
        })
      })
    },
    [nonExtensibleClients],
  )

  const getTrustedTheme = useCallback(
    (status) => (status ? `primary-${selectedTheme}` : 'secondary'),
    [selectedTheme],
  )

  const clients = useMemo(
    () => nonExtensibleClients.map((client) => addOrg(client)),
    [nonExtensibleClients, addOrg],
  )

  const scopeClients = useMemo(() => {
    if (!haveScopeINUMParam || !scopeInumParam) {
      return []
    }

    if (scopeItem?.inum === scopeInumParam && Array.isArray(scopeItem.clients)) {
      return scopeItem.clients.map(addOrg)
    }

    const clientsForScope = findAndFilterScopeClients(
      scopeInumParam,
      scopes,
      nonExtensibleClients,
      filterClientsByScope,
      addOrg,
    )

    return clientsForScope || []
  }, [
    haveScopeINUMParam,
    scopeInumParam,
    scopeItem,
    scopes,
    nonExtensibleClients,
    filterClientsByScope,
    addOrg,
  ])

  const isScopeLoading = useMemo(
    () => haveScopeINUMParam && scopeLoading && scopeClients.length === 0,
    [haveScopeINUMParam, scopeLoading, scopeClients.length],
  )

  const handleCloseScopesModal = useCallback(() => {
    setScopesModal({
      data: [],
      show: false,
    })
  }, [])

  const handleSetScopeData = useCallback((data) => {
    setScopesModal({
      data: data,
      show: true,
    })
  }, [])

  const toggle = useCallback(() => setModal((prev) => !prev), [])

  const makeOptions = useCallback(() => {
    const baseOptions = {
      [LIMIT]: limit,
    }

    if (pattern && pattern !== '') {
      return { ...baseOptions, [PATTERN]: pattern }
    }

    return baseOptions
  }, [limit, pattern])

  const handleOptionsChange = useCallback(
    (event) => {
      if (event.target.name === 'limit') {
        setLimit(event.target.value)
      } else if (event.target.name === 'pattern') {
        const nextPattern = event.target.value
        setPattern(nextPattern)
        if (event.keyCode === 13) {
          const newOptions = makeOptions()
          dispatch(getOpenidClients({ action: newOptions }))
        }
      }
    },
    [makeOptions, dispatch],
  )

  const handleGoToClientEditPage = useCallback(
    (row, edition) => {
      dispatch(viewOnly({ view: edition }))
      dispatch(setCurrentItem({ item: row }))
      return navigateToRoute(ROUTES.AUTH_SERVER_CLIENT_EDIT(row.inum.substring(0, 4)))
    },
    [dispatch, navigateToRoute],
  )

  const handleGoToClientAddPage = useCallback(() => {
    return navigateToRoute(ROUTES.AUTH_SERVER_CLIENT_ADD)
  }, [navigateToRoute])

  const handleClientDelete = useCallback(
    (row) => {
      dispatch(setCurrentItem({ item: row }))
      setItem(row)
      toggle()
    },
    [dispatch, toggle],
  )

  const onDeletionConfirmed = useCallback(
    (message) => {
      const userAction = {}
      buildPayload(userAction, message, item)
      dispatch(deleteClient({ action: userAction }))
      if (!haveScopeINUMParam) {
        navigateToRoute(ROUTES.AUTH_SERVER_CLIENTS_LIST)
      }
      toggle()
    },
    [dispatch, haveScopeINUMParam, item, navigateToRoute, toggle],
  )

  const onPageChangeClick = useCallback(
    (page) => {
      const baseOptions = makeOptions()
      const startCount = page * limit
      const updatedOptions = {
        ...baseOptions,
        startIndex: parseInt(startCount, 10),
        limit,
      }
      setPageNumber(page)
      dispatch(getOpenidClients({ action: updatedOptions }))
    },
    [makeOptions, limit, dispatch],
  )

  const onRowCountChangeClick = useCallback(
    (count) => {
      const baseOptions = makeOptions()
      const updatedOptions = {
        ...baseOptions,
        startIndex: 0,
        limit: count,
      }
      setPageNumber(0)
      setLimit(count)
      dispatch(getOpenidClients({ action: updatedOptions }))
    },
    [makeOptions, dispatch],
  )

  const handleRefresh = useCallback(() => {
    const newOptions = makeOptions()
    dispatch(getOpenidClients({ action: newOptions }))
  }, [makeOptions, dispatch])

  const tableColumns = useMemo(
    () => [
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
            <Link className="common-link" onClick={() => handleSetScopeData(rowData.scopes)}>
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
    ],
    [t, selectedTheme, getTrustedTheme, handleSetScopeData, shouldHideOrgColumn, clients],
  )

  const tableOptions = useMemo(
    () => ({
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
    }),
    [limit, bgThemeColor],
  )

  const ContainerComponent = useCallback((props) => <Paper {...props} elevation={0} />, [])

  const PaginationComponent = useCallback(
    () => (
      <TablePagination
        count={haveScopeINUMParam ? scopeClients.length : totalItems}
        page={pageNumber}
        onPageChange={(_prop, page) => {
          onPageChangeClick(page)
        }}
        rowsPerPage={limit}
        onRowsPerPageChange={(_prop, count) => onRowCountChangeClick(count.props.value)}
      />
    ),
    [
      haveScopeINUMParam,
      scopeClients.length,
      totalItems,
      pageNumber,
      limit,
      onPageChangeClick,
      onRowCountChangeClick,
    ],
  )

  const tableComponents = useMemo(
    () => ({
      Container: ContainerComponent,
      Pagination: haveScopeINUMParam ? () => null : PaginationComponent,
    }),
    [ContainerComponent, PaginationComponent, haveScopeINUMParam],
  )

  const detailPanel = useCallback(
    (rowData) => <ClientDetailPage row={rowData.rowData} scopes={scopes} />,
    [scopes],
  )

  const myActions = useMemo(() => {
    const actions = []

    if (canWriteClient) {
      actions.push({
        'icon': 'add',
        'tooltip': `${t('messages.add_client')}`,
        'iconProps': { color: 'primary' },
        'data-testid': `${t('messages.add_client')}`,
        'isFreeAction': true,
        'onClick': handleGoToClientAddPage,
      })
      actions.push((rowData) => ({
        icon: 'edit',
        iconProps: {
          id: `editClient${rowData.inum}`,
          style: { color: customColors.darkGray },
        },
        tooltip: `${t('messages.edit_client')}`,
        onClick: (_event, rowData) => handleGoToClientEditPage(rowData, false),
        disabled: false,
      }))
    }

    if (canReadClient) {
      actions.push({
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
        iconProps: {
          color: 'primary',
          style: {
            borderColor: customColors.lightBlue,
          },
        },
        isFreeAction: true,
        onClick: () => {},
      })
      actions.push({
        'icon': 'refresh',
        'tooltip': `${t('messages.refresh')}`,
        'iconProps': { color: 'primary', style: { color: customColors.lightBlue } },
        'data-testid': `${t('messages.refresh')}`,
        'isFreeAction': true,
        'onClick': handleRefresh,
      })
      actions.push((rowData) => ({
        icon: 'visibility',
        iconProps: {
          id: `viewClient${rowData.inum}`,
          style: { color: customColors.darkGray },
        },
        tooltip: `${t('messages.view_client_details')}`,
        onClick: (_event, rowData) => handleGoToClientEditPage(rowData, true),
        disabled: false,
      }))
    }

    if (canDeleteClient) {
      actions.push((rowData) => ({
        icon: () => <DeleteOutlined />,
        iconProps: {
          color: 'secondary',
          id: `deleteClient${rowData.inum}`,
          style: { color: customColors.darkGray },
        },
        tooltip: rowData.deletable
          ? `${t('messages.delete_client')}`
          : `${t('messages.not_deletable_client')}`,
        onClick: (_event, rowData) => handleClientDelete(rowData),
        disabled: false,
      }))
    }

    return actions
  }, [
    canWriteClient,
    canReadClient,
    canDeleteClient,
    t,
    limit,
    pattern,
    handleGoToClientAddPage,
    handleGoToClientEditPage,
    handleClientDelete,
    handleOptionsChange,
    handleRefresh,
  ])

  SetTitle(t('titles.oidc_clients'))

  useEffect(() => {
    authorizeHelper(clientScopes)
  }, [authorizeHelper, clientScopes])

  useEffect(() => {
    dispatch(resetUMAResources())
  }, [dispatch])

  useEffect(() => {
    if (haveScopeINUMParam && scopeInumParam) {
      if (scopes.length === 0) {
        const scopeApiAction = {
          [LIMIT]: 100,
          [WITH_ASSOCIATED_CLIENTS]: true,
        }
        dispatch(getScopes({ action: scopeApiAction }))

        if (nonExtensibleClients.length === 0) {
          const options = makeOptions()
          dispatch(getOpenidClients({ action: options }))
        }
        return
      }

      if (!scopeItem || scopeItem.inum !== scopeInumParam) {
        dispatch(getScopeByInum({ action: scopeInumParam }))
      }
    } else {
      if (nonExtensibleClients.length === 0) {
        const options = makeOptions()
        dispatch(getOpenidClients({ action: options }))
      }

      if (scopes.length === 0) {
        const scopesApiAction = {
          [LIMIT]: 100,
          [WITH_ASSOCIATED_CLIENTS]: true,
        }
        dispatch(getScopes({ action: scopesApiAction }))
      }
    }
  }, [
    haveScopeINUMParam,
    scopeInumParam,
    dispatch,
    scopes.length,
    nonExtensibleClients.length,
    scopeItem,
    makeOptions,
  ])

  const tableData = useMemo(
    () => (haveScopeINUMParam ? scopeClients : clients),
    [haveScopeINUMParam, scopeClients, clients],
  )

  const isLoading = useMemo(() => clientLoading || isScopeLoading, [clientLoading, isScopeLoading])

  return (
    <Card style={applicationStyle.mainCard}>
      <ClientShowScopes
        handler={handleCloseScopesModal}
        isOpen={scopesModal?.show}
        data={scopesModal?.data}
      />
      <CardBody>
        <GluuViewWrapper canShow={canReadClient}>
          <MaterialTable
            key={limit || 0}
            components={tableComponents}
            columns={tableColumns}
            data={tableData}
            isLoading={isLoading}
            title=""
            actions={myActions}
            options={tableOptions}
            detailPanel={detailPanel}
          />
        </GluuViewWrapper>
        {canDeleteClient && (
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
