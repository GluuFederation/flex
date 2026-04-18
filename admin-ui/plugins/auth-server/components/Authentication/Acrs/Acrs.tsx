import { useEffect, useCallback, useMemo, useState, type ReactElement } from 'react'
import { Edit, Check, Close } from '@mui/icons-material'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { useCedarling } from '@/cedarling'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME } from '@/context/theme/constants'
import { GluuTable, type ColumnDef, type ActionDef } from '@/components/GluuTable'
import { GluuDetailGrid, type GluuDetailGridField } from '@/components/GluuDetailGrid'
import { AUTHN } from 'Utils/ApiResources'
import { DEFAULT_SCRIPT_TYPE } from 'Plugins/scripts/components/constants'
import { useCustomScriptsByType } from 'Plugins/scripts/components/hooks'
import { useGetAcrs, useGetConfigDatabaseLdap, type GluuLdapConfiguration } from 'JansConfigApi'
import type { AuthNItem } from '../types'
import {
  BUILT_IN_ACRS,
  AUTH_RESOURCE_ID,
  AUTH_SCOPES,
  PAGE_SIZE,
  AUTH_METHOD_NAMES,
  SCRIPT_TYPES,
} from '../constants'
import { useStyles } from './Acrs.style'
import { displayOrDash } from './helper/acrUtils'

type AcrsProps = {
  isBuiltIn?: boolean
}

const Acrs = ({ isBuiltIn = false }: AcrsProps): ReactElement => {
  const { hasCedarReadPermission, hasCedarWritePermission, authorizeHelper } = useCedarling()
  const { t } = useTranslation()
  const { navigateToRoute } = useAppNavigation()

  const { state: themeState } = useTheme()
  const themeColors = useMemo(
    () => getThemeColor(themeState.theme || DEFAULT_THEME),
    [themeState.theme],
  )
  const { classes } = useStyles({ themeColors })

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE)

  const canReadAuthN = useMemo(
    () => hasCedarReadPermission(AUTH_RESOURCE_ID),
    [hasCedarReadPermission],
  )
  const canWriteAuthN = useMemo(
    () => hasCedarWritePermission(AUTH_RESOURCE_ID),
    [hasCedarWritePermission],
  )

  const { data: ldapConfigurations = [], isLoading: ldapLoading } = useGetConfigDatabaseLdap({
    query: { staleTime: 30000, enabled: canReadAuthN },
  })
  const { data: acrs, isLoading: acrsLoading } = useGetAcrs({
    query: { staleTime: 30000, enabled: canReadAuthN },
  })
  const { data: scriptsResponse, isLoading: scriptsLoading } = useCustomScriptsByType(
    DEFAULT_SCRIPT_TYPE,
    undefined,
    { enabled: canReadAuthN },
  )

  SetTitle(t('titles.authentication'))

  useEffect(() => {
    authorizeHelper(AUTH_SCOPES)
  }, [authorizeHelper])

  const handleGoToAuthNEditPage = useCallback(
    (row: AuthNItem) => {
      const id = row.inum || row.acrName || row.name || 'built-in'
      return navigateToRoute(ROUTES.AUTH_SERVER_AUTHN_EDIT(id), {
        state: { authnTab: isBuiltIn ? 1 : 2, selectedItem: row },
      })
    },
    [navigateToRoute, isBuiltIn],
  )

  const ldapItems = useMemo<AuthNItem[]>(() => {
    if (ldapLoading || ldapConfigurations.length === 0) {
      return []
    }
    return ldapConfigurations
      .filter((item) => item.enabled === true)
      .map((config: GluuLdapConfiguration) => ({
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
        name: AUTH_METHOD_NAMES.DEFAULT_LDAP,
        acrName: config.configId,
      }))
  }, [ldapConfigurations, ldapLoading])

  const scriptItems = useMemo<AuthNItem[]>(() => {
    const scripts = scriptsResponse?.entries || []
    if (scriptsLoading || scripts.length === 0) {
      return []
    }
    return scripts
      .filter((item: AuthNItem) => item.enabled === true)
      .map((item: AuthNItem) => ({
        ...item,
        name: item.scriptType || SCRIPT_TYPES.PERSON_AUTHENTICATION,
        acrName: item.name,
        isCustomScript: true,
      }))
  }, [scriptsResponse, scriptsLoading])

  const tableData = useMemo<AuthNItem[]>(() => {
    if (ldapLoading || scriptsLoading || acrsLoading) {
      return []
    }
    if (isBuiltIn) {
      return BUILT_IN_ACRS
    }
    return [...ldapItems, ...scriptItems].sort((a, b) => (a.level || 0) - (b.level || 0))
  }, [ldapLoading, scriptsLoading, acrsLoading, isBuiltIn, ldapItems, scriptItems])

  const columns: ColumnDef<AuthNItem>[] = useMemo(
    () => [
      {
        key: 'acrName',
        label: t('fields.acr'),
      },
      {
        key: 'samlACR',
        label: t('fields.saml_acr'),
      },
      {
        key: 'level',
        label: t('fields.level'),
        width: 80,
      },
      {
        key: 'acrName',
        id: 'default',
        label: t('options.default'),
        align: 'center',
        width: 110,
        sortable: false,
        render: (_value, row) => (
          <span className={classes.defaultIconCircle}>
            {row.acrName === acrs?.defaultAcr ? (
              <Check className={classes.defaultInnerIcon} />
            ) : (
              <Close className={classes.defaultInnerIcon} />
            )}
          </span>
        ),
      },
    ],
    [t, acrs?.defaultAcr, classes.defaultIconCircle, classes.defaultInnerIcon],
  )

  const actions = useMemo<ActionDef<AuthNItem>[]>(() => {
    if (!canWriteAuthN) {
      return []
    }
    return [
      {
        icon: <Edit className={classes.editIcon} />,
        tooltip: t('messages.edit_authn'),
        id: 'editAuthN',
        onClick: handleGoToAuthNEditPage,
      },
    ]
  }, [canWriteAuthN, t, handleGoToAuthNEditPage, classes.editIcon])

  const detailLabelStyle = useMemo(
    () => ({ color: themeColors.fontColor }),
    [themeColors.fontColor],
  )

  const getDetailFields = useCallback(
    (row: AuthNItem): GluuDetailGridField[] => [
      {
        label: 'fields.acr',
        value: displayOrDash(row.acrName),
        doc_entry: 'acr',
        doc_category: AUTHN,
      },
      {
        label: 'fields.level',
        value: displayOrDash(row.level),
        doc_entry: 'level',
        doc_category: AUTHN,
      },
      {
        label: 'fields.password_attribute',
        value: displayOrDash(row.passwordAttribute),
        doc_entry: 'password_attribute',
        doc_category: AUTHN,
      },
      {
        label: 'fields.hash_algorithm',
        value: displayOrDash(row.hashAlgorithm),
        doc_entry: 'hash_algorithm',
        doc_category: AUTHN,
        isBadge: !!row.hashAlgorithm,
        badgeBackgroundColor: themeColors.badges.filledBadgeBg,
        badgeTextColor: themeColors.badges.filledBadgeText,
      },
      {
        label: 'fields.primary_key',
        value: displayOrDash(row.primaryKey),
        doc_entry: 'primary_key',
        doc_category: AUTHN,
      },
      {
        label: 'fields.saml_acr',
        value: displayOrDash(row.samlACR),
        doc_entry: 'saml_acr',
        doc_category: AUTHN,
      },
      {
        label: 'fields.description',
        value: displayOrDash(row.description),
        doc_entry: 'description',
        doc_category: AUTHN,
      },
    ],
    [themeColors.badges.filledBadgeBg, themeColors.badges.filledBadgeText],
  )

  const renderExpandedRow = useCallback(
    (row: AuthNItem) => (
      <GluuDetailGrid
        fields={getDetailFields(row)}
        labelStyle={detailLabelStyle}
        defaultDocCategory={AUTHN}
        layout="column"
      />
    ),
    [getDetailFields, detailLabelStyle],
  )

  const getRowKey = useCallback(
    (row: AuthNItem, index: number) => row.inum ?? row.acrName ?? row.name ?? `authn-${index}`,
    [],
  )

  const isLoading = ldapLoading || scriptsLoading || acrsLoading

  const paginatedData = useMemo(
    () => tableData.slice(page * rowsPerPage, (page + 1) * rowsPerPage),
    [tableData, page, rowsPerPage],
  )

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
  }, [])

  const handleRowsPerPageChange = useCallback((newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage)
    setPage(0)
  }, [])

  return (
    <GluuViewWrapper canShow={canReadAuthN}>
      <GluuLoader blocking={isLoading}>
        <div className={classes.page}>
          <GluuTable<AuthNItem>
            columns={columns}
            data={paginatedData}
            expandable
            renderExpandedRow={renderExpandedRow}
            actions={actions}
            getRowKey={getRowKey}
            pagination={{
              page,
              rowsPerPage,
              totalItems: tableData.length,
              onPageChange: handlePageChange,
              onRowsPerPageChange: handleRowsPerPageChange,
            }}
            emptyMessage={t('messages.no_data')}
          />
        </div>
      </GluuLoader>
    </GluuViewWrapper>
  )
}

export default Acrs
