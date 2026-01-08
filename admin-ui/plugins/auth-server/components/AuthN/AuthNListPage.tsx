import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
  type ReactElement,
} from 'react'
import MaterialTable, { type Action, type Column } from '@material-table/core'
import { Paper } from '@mui/material'
import { useSetAtom } from 'jotai'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { useCedarling } from '@/cedarling'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useTranslation } from 'react-i18next'
import customColors from '@/customColors'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import AuthNDetailPage from './AuthNDetailPage'
import { useCustomScriptsByType } from 'Plugins/admin/components/CustomScripts/hooks'
import { DEFAULT_SCRIPT_TYPE } from 'Plugins/admin/components/CustomScripts/constants'
import { currentAuthNItemAtom, type AuthNItem } from './atoms'
import { BUILT_IN_ACRS } from './constants'
import { useGetAcrs, useGetConfigDatabaseLdap, type GluuLdapConfiguration } from 'JansConfigApi'

const PAGE_SIZE = 10

interface AuthNListPageProps {
  isBuiltIn?: boolean
}

interface ListState {
  ldap: AuthNItem[]
  scripts: AuthNItem[]
}

function AuthNListPage({ isBuiltIn = false }: AuthNListPageProps): ReactElement {
  const { hasCedarReadPermission, hasCedarWritePermission, authorizeHelper } = useCedarling()
  const { t } = useTranslation()
  const setCurrentItem = useSetAtom(currentAuthNItemAtom)
  const [myActions, setMyActions] = useState<
    Array<Action<AuthNItem> | ((rowData: AuthNItem) => Action<AuthNItem>)>
  >([])
  const { navigateToRoute } = useAppNavigation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'light'
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }

  const [list, setList] = useState<ListState>({
    ldap: [],
    scripts: [],
  })

  const { data: ldapConfigurations = [], isLoading: ldapLoading } = useGetConfigDatabaseLdap({
    query: { staleTime: 30000 },
  })

  // Fetch ACR config using Orval hook
  const { data: acrs, isLoading: acrsLoading } = useGetAcrs({
    query: {
      staleTime: 30000,
    },
  })

  // Use React Query hook for custom scripts
  const { data: scriptsResponse, isLoading: scriptsLoading } =
    useCustomScriptsByType(DEFAULT_SCRIPT_TYPE)
  const scripts = scriptsResponse?.entries || []

  SetTitle(t('titles.authentication'))

  const authNResourceId = ADMIN_UI_RESOURCES.Authentication
  const authNScopes = useMemo(() => CEDAR_RESOURCE_SCOPES[authNResourceId] || [], [authNResourceId])

  const canReadAuthN = useMemo(
    () => hasCedarReadPermission(authNResourceId),
    [hasCedarReadPermission, authNResourceId],
  )
  const canWriteAuthN = useMemo(
    () => hasCedarWritePermission(authNResourceId),
    [hasCedarWritePermission, authNResourceId],
  )

  const handleGoToAuthNEditPage = useCallback(
    (row: AuthNItem) => {
      setCurrentItem(row)
      return navigateToRoute(ROUTES.AUTH_SERVER_AUTHN_EDIT(row.inum || ''))
    },
    [setCurrentItem, navigateToRoute],
  )

  useEffect(() => {
    authorizeHelper(authNScopes)
  }, [authorizeHelper, authNScopes])

  // Actions as state that will rebuild when permissions change
  useEffect(() => {
    const newActions: Array<Action<AuthNItem> | ((rowData: AuthNItem) => Action<AuthNItem>)> = []

    if (canWriteAuthN) {
      newActions.push((rowData: AuthNItem) => ({
        icon: 'edit',
        iconProps: {
          id: 'editAutN' + rowData.inum,
          style: { color: customColors.darkGray },
        },
        tooltip: `${t('messages.edit_authn')}`,
        onClick: (_event, rowDataClicked) => {
          if (!Array.isArray(rowDataClicked)) {
            handleGoToAuthNEditPage(rowDataClicked)
          }
        },
      }))
    }

    setMyActions(newActions)
  }, [canWriteAuthN, t, handleGoToAuthNEditPage])

  const mapLdapToAuthNItem = useCallback(
    (config: GluuLdapConfiguration): AuthNItem => ({
      configId: config.configId,
      bindDN: config.bindDN,
      bindPassword: config.bindPassword,
      servers: config.servers,
      maxConnections: config.maxConnections,
      useSSL: config.useSSL,
      baseDNs: config.baseDNs,
      primaryKey: config.primaryKey,
      localPrimaryKey: config.localPrimaryKey,
      enabled: config.enabled,
      level: config.level,
      name: 'default_ldap_password',
      acrName: config.configId,
    }),
    [],
  )

  useEffect(() => {
    setList((prevList) => ({ ...prevList, ldap: [] }))

    if (ldapConfigurations.length > 0 && !ldapLoading) {
      const enabledLdap = ldapConfigurations.filter((item) => item.enabled === true)
      if (enabledLdap.length > 0) {
        const updateLDAPItems = enabledLdap.map(mapLdapToAuthNItem)
        setList((prevList) => ({ ...prevList, ldap: updateLDAPItems }))
      }
    }
  }, [ldapConfigurations, ldapLoading, mapLdapToAuthNItem])

  useEffect(() => {
    setList((prevList) => ({ ...prevList, scripts: [] }))
    if (scripts.length > 0 && !scriptsLoading) {
      const getEnabledscripts = scripts.filter((item: AuthNItem) => item.enabled === true)
      if (getEnabledscripts?.length > 0) {
        const updateScriptsItems = getEnabledscripts.map((item: AuthNItem) => ({
          ...item,
          name: 'myAuthnScript',
          acrName: item.name,
        }))
        setList((prevList) => ({ ...prevList, scripts: updateScriptsItems }))
      }
    }
  }, [scripts, scriptsLoading])

  const columns: Column<AuthNItem>[] = [
    { title: `${t('fields.acr')}`, field: 'acrName' },
    { title: `${t('fields.saml_acr')}`, field: 'samlACR' },
    { title: `${t('fields.level')}`, field: 'level' },
    {
      title: `${t('options.default')}`,
      field: '',
      render: (rowData: AuthNItem) => {
        return rowData.acrName === acrs?.defaultAcr ? (
          <i className="fa fa-check" style={{ color: customColors.logo, fontSize: '24px' }}></i>
        ) : (
          <i
            className="fa fa-close"
            style={{ color: customColors.accentRed, fontSize: '24px' }}
          ></i>
        )
      },
    },
  ]

  const tableData = useMemo(() => {
    if (loading || scriptsLoading || acrsLoading) {
      return []
    }
    if (isBuiltIn) {
      return BUILT_IN_ACRS as AuthNItem[]
    }
    return [...list.ldap, ...list.scripts].sort(
      (item1, item2) => (item1.level || 0) - (item2.level || 0),
    )
  }, [loading, scriptsLoading, acrsLoading, isBuiltIn, list.ldap, list.scripts])

  return (
    <GluuViewWrapper canShow={canReadAuthN}>
      <MaterialTable
        key={PAGE_SIZE}
        components={{
          Container: (props) => <Paper {...props} elevation={0} />,
        }}
        columns={columns}
        data={tableData}
        isLoading={loading || scriptsLoading || acrsLoading}
        title=""
        actions={myActions}
        options={{
          columnsButton: true,
          search: false,
          idSynonym: 'inum',
          selection: false,
          pageSize: PAGE_SIZE,
          headerStyle: {
            ...applicationStyle.tableHeaderStyle,
            ...bgThemeColor,
          } as React.CSSProperties,
          actionsColumnIndex: -1,
        }}
        detailPanel={(rowData) => {
          return <AuthNDetailPage row={rowData.rowData} />
        }}
      />
    </GluuViewWrapper>
  )
}

export default AuthNListPage
