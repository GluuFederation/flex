import React, { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { DeleteOutlined, Edit, Add, VisibilityOutlined } from '@mui/icons-material'
import { useLocation } from 'react-router-dom'
import { useAppSelector } from '@/redux/hooks'
import { useTranslation } from 'react-i18next'
import { Link } from '@mui/material'
import { GluuBadge } from '@/components/GluuBadge'
import { GluuTable } from '@/components/GluuTable'
import { GluuSearchToolbar } from '@/components/GluuSearchToolbar'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import SetTitle from 'Utils/SetTitle'
import { useCedarling } from '@/cedarling/hooks/useCedarling'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { devLogger } from '@/utils/devLogger'
import { getRowsPerPageOptions, usePaginationState } from '@/utils/pagingUtils'
import { useGetOauthScopes, useGetOauthScopesByInum } from 'JansConfigApi'
import { useClients, useDeleteClient } from '../hooks'
import ClientDetailPage from './ClientDetailPage'
import ClientShowScopes from './ClientShowScopes'
import { findAndFilterScopeClients } from './ClientScopeUtils'
import { useStyles } from './styles/ClientListPage.style'
import { BORDER_RADIUS } from '@/constants'
import {
  CLIENT_ACTION_IDS,
  FETCH_LIMITS,
  CLIENT_VIEW_QUERY_PARAM,
  CLIENT_VIEW_QUERY_VALUE,
  EM_DASH_PLACEHOLDER,
  ORG_ATTR_NAME,
  ORG_ATTR_NAME_FULL,
  SCOPE_INUM_PARAM,
} from '../constants'
import type { ClientRow, ScopeItem } from '../types'
import type { ColumnDef, ActionDef, PaginationConfig } from '@/components/GluuTable'

const LIMIT_OPTIONS = getRowsPerPageOptions()
const clientResourceId = ADMIN_UI_RESOURCES.Clients
const clientCedarScopes = CEDAR_RESOURCE_SCOPES[clientResourceId] || []

const addOrg = (client: ClientRow): ClientRow => {
  if (!client) return client
  const copy = { ...client }
  if (copy.o) {
    copy.organization = copy.o
    return copy
  }
  let org = EM_DASH_PLACEHOLDER
  if (Array.isArray(copy.customAttributes)) {
    const match = copy.customAttributes.find(
      (attr) => attr.name === ORG_ATTR_NAME || attr.name === ORG_ATTR_NAME_FULL,
    )
    if (match && Array.isArray(match.values) && match.values.length > 0) {
      org = match.values[0]
    }
  }
  copy.organization = org
  return copy
}

const ClientListPage: React.FC = () => {
  const { t } = useTranslation()
  SetTitle(t('titles.oidc_clients'))
  const { navigateToRoute } = useAppNavigation()
  const { search } = useLocation()
  const { state } = useTheme()

  const {
    authorizeHelper,
    hasCedarReadPermission,
    hasCedarWritePermission,
    hasCedarDeletePermission,
  } = useCedarling()

  const { themeColors, isDarkTheme } = useMemo(() => {
    const selected = state?.theme || DEFAULT_THEME
    return { themeColors: getThemeColor(selected), isDarkTheme: selected === THEME_DARK }
  }, [state?.theme])
  const { classes, badgeStyles } = useStyles({ isDark: isDarkTheme, themeColors })

  const userinfo = useAppSelector((state) => state.authReducer?.userinfo)
  const clientId = useAppSelector((state) => state.authReducer?.config?.clientId)
  const { deleteClient, isDeleting } = useDeleteClient({ userinfo, clientId })

  const { limit, setLimit, pageNumber, setPageNumber, onPagingSizeSync } = usePaginationState()
  const [pattern, setPattern] = useState('')
  const [itemToDelete, setItemToDelete] = useState<ClientRow | null>(null)
  const [modal, setModal] = useState(false)
  const [scopesModal, setScopesModal] = useState<{ data: string[]; show: boolean }>({
    data: [],
    show: false,
  })

  const scopeInumParam = useMemo(() => {
    const params = new URLSearchParams(search)
    return params.get(SCOPE_INUM_PARAM)
  }, [search])
  const haveScopeINUMParam = useMemo(() => !!scopeInumParam, [scopeInumParam])

  const canRead = useMemo(() => hasCedarReadPermission(clientResourceId), [hasCedarReadPermission])
  const canWrite = useMemo(
    () => hasCedarWritePermission(clientResourceId),
    [hasCedarWritePermission],
  )
  const canDelete = useMemo(
    () => hasCedarDeletePermission(clientResourceId),
    [hasCedarDeletePermission],
  )

  const clientQueryParams = useMemo(
    () => ({
      limit,
      pattern: pattern || undefined,
      startIndex: pageNumber * limit,
    }),
    [limit, pattern, pageNumber],
  )

  const {
    clients: nonExtensibleClients,
    totalCount: totalItems,
    isLoading: clientLoading,
    refetch,
  } = useClients<ClientRow>(haveScopeINUMParam ? undefined : clientQueryParams)

  const allScopesQueryParams = useMemo(
    () => ({ limit: FETCH_LIMITS.CLIENT_LIST, withAssociatedClients: true as const }),
    [],
  )
  const { data: allScopesResponse, isLoading: allScopesLoading } = useGetOauthScopes(
    allScopesQueryParams,
    { query: { enabled: haveScopeINUMParam } },
  )
  const allScopes = useMemo<ScopeItem[]>(
    () => (allScopesResponse?.entries ?? []) as ScopeItem[],
    [allScopesResponse],
  )

  const { data: scopeByInumData, isLoading: scopeByInumLoading } = useGetOauthScopesByInum(
    scopeInumParam ?? '',
    undefined,
    { query: { enabled: haveScopeINUMParam && !!scopeInumParam } },
  )
  const scopeItem = useMemo<ScopeItem | undefined>(
    () => (scopeByInumData ? (scopeByInumData as ScopeItem) : undefined),
    [scopeByInumData],
  )
  const scopeLoading = allScopesLoading || scopeByInumLoading

  const filterClientsByScope = useCallback(
    (inum: string, scopeDn: string) => {
      const normalizedDn = typeof scopeDn === 'string' && scopeDn.trim().length > 0 ? scopeDn : null
      return nonExtensibleClients.filter((client) => {
        if (!client.scopes || !Array.isArray(client.scopes)) return false
        return client.scopes.some(
          (s) => (normalizedDn && s === normalizedDn) || s.includes(`inum=${inum}`) || s === inum,
        )
      })
    },
    [nonExtensibleClients],
  )

  const clients = useMemo(() => nonExtensibleClients.map(addOrg), [nonExtensibleClients])

  const scopeClients = useMemo((): ClientRow[] => {
    if (!haveScopeINUMParam || !scopeInumParam) return []
    if (scopeItem?.inum === scopeInumParam && Array.isArray(scopeItem.clients)) {
      return scopeItem.clients.map(addOrg)
    }
    return (
      findAndFilterScopeClients(
        scopeInumParam,
        allScopes,
        nonExtensibleClients,
        filterClientsByScope,
        addOrg,
      ) || []
    )
  }, [
    haveScopeINUMParam,
    scopeInumParam,
    scopeItem,
    allScopes,
    nonExtensibleClients,
    filterClientsByScope,
  ])

  const tableData = useMemo(
    () => (haveScopeINUMParam ? scopeClients : clients),
    [haveScopeINUMParam, scopeClients, clients],
  )

  const isLoading = useMemo(
    () =>
      clientLoading ||
      isDeleting ||
      (haveScopeINUMParam && scopeLoading && scopeClients.length === 0),
    [clientLoading, isDeleting, haveScopeINUMParam, scopeLoading, scopeClients.length],
  )

  const handleGoToClientEditPage = useCallback(
    (row: ClientRow, isViewOnly: boolean) => {
      const editPath = ROUTES.AUTH_SERVER_CLIENT_EDIT(row.inum)
      const target = isViewOnly
        ? `${editPath}?${CLIENT_VIEW_QUERY_PARAM}=${CLIENT_VIEW_QUERY_VALUE}`
        : editPath
      navigateToRoute(target)
    },
    [navigateToRoute],
  )

  const handleGoToClientAddPage = useCallback(
    () => navigateToRoute(ROUTES.AUTH_SERVER_CLIENT_ADD),
    [navigateToRoute],
  )

  const handleDeleteClick = useCallback((row: ClientRow) => {
    setItemToDelete(row)
    setModal(true)
  }, [])

  const handleCloseDeleteModal = useCallback(() => {
    setModal(false)
    setItemToDelete(null)
  }, [])

  const onDeletionConfirmed = useCallback(
    async (message: string) => {
      if (!itemToDelete) return
      try {
        await deleteClient({
          inum: itemToDelete.inum,
          message,
          client: itemToDelete,
        })
      } catch (error) {
        devLogger.error('Failed to delete client', error instanceof Error ? error : String(error))
      } finally {
        setModal(false)
        setItemToDelete(null)
      }
    },
    [itemToDelete, deleteClient],
  )

  const handleCloseScopesModal = useCallback(() => setScopesModal({ data: [], show: false }), [])

  const handleSetScopeData = useCallback(
    (data: string[]) => setScopesModal({ data, show: true }),
    [],
  )

  const handleSearch = useCallback(
    (value: string) => {
      setPattern(value)
      setPageNumber(0)
    },
    [setPageNumber],
  )

  const handleRefresh = useCallback(() => {
    setPattern('')
    setPageNumber(0)
    refetch()
  }, [setPageNumber, refetch])

  const handlePageChange = useCallback(
    (page: number) => {
      setPageNumber(page)
    },
    [setPageNumber],
  )

  const handleRowsPerPageChange = useCallback(
    (rowsPerPage: number) => {
      setLimit(rowsPerPage)
      setPageNumber(0)
    },
    [setLimit, setPageNumber],
  )

  useEffect(() => {
    if (clientCedarScopes.length > 0) authorizeHelper(clientCedarScopes)
  }, [authorizeHelper, clientCedarScopes])

  const shouldHideOrgColumn = useMemo(
    () => !clients.some((c) => c.organization !== EM_DASH_PLACEHOLDER),
    [clients],
  )

  const columns: ColumnDef<ClientRow>[] = useMemo(() => {
    const cols: ColumnDef<ClientRow>[] = [
      {
        key: 'inum',
        label: t('fields.client_id'),
        sortable: true,
        render: (_value, row) => (
          <GluuText variant="span" className={classes.cellText} disableThemeColor>
            {row.inum}
          </GluuText>
        ),
      },
      {
        key: 'clientName',
        label: t('fields.client_name'),
        sortable: true,
        render: (_value, row) => (
          <GluuText variant="span" className={classes.cellText} disableThemeColor>
            {row.clientName || row.displayName || EM_DASH_PLACEHOLDER}
          </GluuText>
        ),
      },
      {
        key: 'grantTypes',
        label: t('fields.grant_types'),
        sortable: false,
        render: (_value, row) =>
          row.grantTypes?.length ? (
            <div className={classes.badgeList}>
              {row.grantTypes.map((grant, i) => (
                <GluuBadge
                  key={`${grant}-${i}`}
                  size="sm"
                  backgroundColor={badgeStyles.filledBadge.backgroundColor}
                  textColor={badgeStyles.filledBadge.textColor}
                  borderColor={badgeStyles.filledBadge.borderColor}
                  borderRadius={BORDER_RADIUS.SMALL}
                >
                  {grant}
                </GluuBadge>
              ))}
            </div>
          ) : (
            EM_DASH_PLACEHOLDER
          ),
      },
      {
        key: 'scopes',
        label: t('fields.scopes'),
        align: 'center',
        sortable: false,
        render: (_value, row) => (
          <Link
            component="button"
            onClick={() => handleSetScopeData(row.scopes ?? [])}
            className={classes.scopeLink}
          >
            {row.scopes?.length ?? 0}
          </Link>
        ),
      },
      {
        key: 'trustedClient',
        label: t('fields.is_trusted_client'),
        align: 'center',
        sortable: false,
        render: (_value, row) => {
          const trusted = row.trustedClient === true
          const style = trusted ? badgeStyles.trueBadge : badgeStyles.falseBadge
          return (
            <GluuBadge
              size="md"
              backgroundColor={style.backgroundColor}
              textColor={style.textColor}
              borderColor={style.borderColor}
              borderRadius={BORDER_RADIUS.SMALL}
            >
              {trusted ? t('options.yes') : t('options.no')}
            </GluuBadge>
          )
        },
      },
    ]

    if (!shouldHideOrgColumn) {
      cols.push({
        key: 'organization',
        label: t('fields.organization'),
        sortable: true,
        render: (_value, row) => (
          <GluuText variant="span" className={classes.cellText} disableThemeColor>
            {row.organization || EM_DASH_PLACEHOLDER}
          </GluuText>
        ),
      })
    }

    return cols
  }, [t, classes, badgeStyles, shouldHideOrgColumn, handleSetScopeData])

  const actions: ActionDef<ClientRow>[] = useMemo(() => {
    const list: ActionDef<ClientRow>[] = []

    if (canWrite) {
      list.push({
        icon: <Edit className={classes.editIcon} />,
        tooltip: t('messages.edit_client'),
        id: CLIENT_ACTION_IDS.EDIT,
        onClick: (row) => handleGoToClientEditPage(row, false),
      })
    }
    if (canRead) {
      list.push({
        icon: <VisibilityOutlined className={classes.viewIcon} />,
        tooltip: t('messages.view_client_details'),
        id: CLIENT_ACTION_IDS.VIEW,
        onClick: (row) => handleGoToClientEditPage(row, true),
      })
    }
    if (canDelete) {
      list.push({
        icon: <DeleteOutlined className={classes.deleteIcon} />,
        tooltip: t('messages.delete_client'),
        id: CLIENT_ACTION_IDS.DELETE,
        onClick: handleDeleteClick,
      })
    }
    return list
  }, [canWrite, canRead, canDelete, t, classes, handleGoToClientEditPage, handleDeleteClick])

  const pagination: PaginationConfig = useMemo(
    () => ({
      page: pageNumber,
      rowsPerPage: limit,
      totalItems: haveScopeINUMParam ? scopeClients.length : totalItems,
      rowsPerPageOptions: LIMIT_OPTIONS,
      onPageChange: handlePageChange,
      onRowsPerPageChange: handleRowsPerPageChange,
    }),
    [
      pageNumber,
      limit,
      totalItems,
      haveScopeINUMParam,
      scopeClients.length,
      handlePageChange,
      handleRowsPerPageChange,
    ],
  )

  const primaryAction = useMemo(
    () => ({
      label: t('messages.add_client'),
      icon: <Add className={classes.addIcon} />,
      onClick: handleGoToClientAddPage,
      disabled: !canWrite,
    }),
    [t, handleGoToClientAddPage, canWrite, classes.addIcon],
  )

  const getRowKey = useCallback((row: ClientRow, index: number) => row.inum ?? `row-${index}`, [])

  const renderExpandedRow = useCallback(
    (row: ClientRow) => <ClientDetailPage row={row} scopes={allScopes} />,
    [allScopes],
  )

  return (
    <GluuLoader blocking={isLoading}>
      <div className={classes.page}>
        <ClientShowScopes
          handler={handleCloseScopesModal}
          isOpen={scopesModal.show}
          data={scopesModal.data}
        />

        <GluuViewWrapper canShow={canRead}>
          <div className={classes.searchCard}>
            <div className={classes.searchCardContent}>
              <GluuSearchToolbar
                searchLabel={`${t('fields.pattern')}:`}
                searchPlaceholder={t('placeholders.search_pattern')}
                searchValue={pattern}
                searchOnType
                onSearch={handleSearch}
                onSearchSubmit={handleSearch}
                onRefresh={canRead ? handleRefresh : undefined}
                refreshLoading={isLoading}
                primaryAction={primaryAction}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className={classes.tableCard}>
            <GluuTable<ClientRow>
              columns={columns}
              data={tableData}
              loading={false}
              expandable
              renderExpandedRow={renderExpandedRow}
              pagination={haveScopeINUMParam ? undefined : pagination}
              onPagingSizeSync={onPagingSizeSync}
              actions={actions}
              getRowKey={getRowKey}
              emptyMessage={t('messages.no_data')}
            />
          </div>
        </GluuViewWrapper>

        {canDelete && itemToDelete && (
          <GluuCommitDialog
            handler={handleCloseDeleteModal}
            modal={modal}
            onAccept={onDeletionConfirmed}
            feature={adminUiFeatures.oidc_clients_delete}
            label={`${t('messages.action_deletion_for')} ${t('titles.oidc_clients')} (${itemToDelete.clientName || itemToDelete.inum})`}
            alertMessage={t('messages.action_deletion_question')}
            alertSeverity="warning"
          />
        )}
      </div>
    </GluuLoader>
  )
}

export default memo(ClientListPage)
