import React, { useState, useEffect, useCallback, useMemo, type ReactElement } from 'react'
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
import { useTheme } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import AuthNDetailPage from './AuthNDetailPage'
import { useCustomScriptsByType } from 'Plugins/admin/components/CustomScripts/hooks'
import { DEFAULT_SCRIPT_TYPE } from 'Plugins/admin/components/CustomScripts/constants'
import { currentAuthNItemAtom, type AuthNItem } from './atoms'
import { BUILT_IN_ACRS } from './constants'
import { useGetAcrs, useGetConfigDatabaseLdap, type GluuLdapConfiguration } from 'JansConfigApi'
import { DEFAULT_THEME } from '@/context/theme/constants'

interface AuthNListPageProps {
  isBuiltIn?: boolean
}

interface ListState {
  ldap: AuthNItem[]
  scripts: AuthNItem[]
}

const PAGE_SIZE = 10

const authNResourceId = ADMIN_UI_RESOURCES.Authentication

const AuthNListPage = ({ isBuiltIn = false }: AuthNListPageProps): ReactElement => {
  const { hasCedarReadPermission, hasCedarWritePermission, authorizeHelper } = useCedarling()
  const { t } = useTranslation()
  const setCurrentItem = useSetAtom(currentAuthNItemAtom)
  const { navigateToRoute } = useAppNavigation()
  const { state: themeState } = useTheme()
  const selectedTheme = themeState.theme || DEFAULT_THEME
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = useMemo(
    () => ({ background: themeColors.background }),
    [themeColors.background],
  )

  const [list, setList] = useState<ListState>({
    ldap: [],
    scripts: [],
  })

  const { data: ldapConfigurations = [], isLoading: ldapLoading } = useGetConfigDatabaseLdap({
    query: { staleTime: 30000 },
  })

  const { data: acrs, isLoading: acrsLoading } = useGetAcrs({
    query: {
      staleTime: 30000,
    },
  })

  const { data: scriptsResponse, isLoading: scriptsLoading } =
    useCustomScriptsByType(DEFAULT_SCRIPT_TYPE)
  const scripts = scriptsResponse?.entries || []

  SetTitle(t('titles.authentication'))

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

      const id = row.inum || row.acrName || row.name || 'built-in'
      return navigateToRoute(ROUTES.AUTH_SERVER_AUTHN_EDIT(id))
    },
    [setCurrentItem, navigateToRoute],
  )

  useEffect(() => {
    authorizeHelper(authNScopes)
  }, [authorizeHelper, authNScopes])

  const myActions = useMemo<
    Array<Action<AuthNItem> | ((rowData: AuthNItem) => Action<AuthNItem>)>
  >(() => {
    const actions: Array<Action<AuthNItem> | ((rowData: AuthNItem) => Action<AuthNItem>)> = []

    if (canWriteAuthN) {
      actions.push((rowData: AuthNItem) => ({
        icon: 'edit',
        iconProps: {
          id: 'editAutN' + (rowData.inum || rowData.acrName),
          style: { color: customColors.darkGray },
        },
        tooltip: `${t('messages.edit_authn')}`,
        onClick: (_event: React.MouseEvent, rowDataClicked: AuthNItem | AuthNItem[]) => {
          if (!Array.isArray(rowDataClicked)) {
            handleGoToAuthNEditPage(rowDataClicked)
          }
        },
      }))
    }

    return actions
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
    if (ldapLoading || ldapConfigurations.length === 0) {
      setList((prevList) => ({ ...prevList, ldap: [] }))
      return
    }

    const enabledLdap = ldapConfigurations.filter((item) => item.enabled === true)
    const updateLDAPItems = enabledLdap.map(mapLdapToAuthNItem)
    setList((prevList) => ({ ...prevList, ldap: updateLDAPItems }))
  }, [ldapConfigurations, ldapLoading, mapLdapToAuthNItem])

  useEffect(() => {
    if (scriptsLoading || scripts.length === 0) {
      setList((prevList) => ({ ...prevList, scripts: [] }))
      return
    }

    const getEnabledscripts = scripts.filter((item: AuthNItem) => item.enabled === true)
    const updateScriptsItems = getEnabledscripts.map((item: AuthNItem) => ({
      ...item,
      name: 'myAuthnScript',
      acrName: item.name,
    }))
    setList((prevList) => ({ ...prevList, scripts: updateScriptsItems }))
  }, [scripts, scriptsLoading])

  const columns: Column<AuthNItem>[] = useMemo(
    () => [
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
    ],
    [t, acrs?.defaultAcr],
  )

  const tableData = useMemo(() => {
    if (ldapLoading || scriptsLoading || acrsLoading) {
      return []
    }
    if (isBuiltIn) {
      return BUILT_IN_ACRS as AuthNItem[]
    }
    return [...list.ldap, ...list.scripts].sort(
      (item1, item2) => (item1.level || 0) - (item2.level || 0),
    )
  }, [ldapLoading, scriptsLoading, acrsLoading, isBuiltIn, list.ldap, list.scripts])

  const tableComponents = useMemo(
    () => ({
      Container: (props: React.ComponentProps<typeof Paper>) => <Paper {...props} elevation={0} />,
    }),
    [],
  )

  const detailPanel = useCallback(
    (rowData: { rowData: AuthNItem }) => <AuthNDetailPage row={rowData.rowData} />,
    [],
  )

  const tableOptions = useMemo(
    () => ({
      columnsButton: true,
      search: false,
      idSynonym: isBuiltIn ? 'acrName' : 'inum',
      selection: false,
      pageSize: PAGE_SIZE,
      headerStyle: {
        ...applicationStyle.tableHeaderStyle,
        ...bgThemeColor,
      } as React.CSSProperties,
      actionsColumnIndex: -1,
    }),
    [isBuiltIn, bgThemeColor],
  )

  return (
    <GluuViewWrapper canShow={canReadAuthN}>
      <MaterialTable
        key={PAGE_SIZE}
        components={tableComponents}
        columns={columns}
        data={tableData}
        isLoading={ldapLoading || scriptsLoading || acrsLoading}
        title=""
        actions={myActions}
        options={tableOptions}
        detailPanel={detailPanel}
      />
    </GluuViewWrapper>
  )
}

export default AuthNListPage
