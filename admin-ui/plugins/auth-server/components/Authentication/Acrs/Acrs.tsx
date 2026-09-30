import { useCallback, useMemo, useState, type ReactElement } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import { MOBILE_MEDIA_QUERY } from '@/constants'
import { Check, Close, Edit } from '@/components/icons'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { usePermission } from '@/cedarling/hooks/usePermission'
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
import { DEFAULT_SCRIPT_TYPE, useCustomScriptsByType } from 'Plugins/scripts/components'
import { useGetAcrs, useGetAgamaPrj, useGetConfigDatabaseLdap } from 'JansConfigApi'
import type { AuthNItem, AcrsProps, AuthnLocationState } from '../types'
import { ACR_TYPES, AUTH_RESOURCE_ID, BUILT_IN_ACRS, PAGE_SIZE, TAB_IDS } from '../constants'
import { MAX_AGAMA_PROJECTS_FOR_ACR } from '../DefaultAcr/constants'
import { useStyles } from './Acrs.style'
import { buildAcrTableRows, displayOrDash } from './helper/acrUtils'

const getAgamaDetailFields = (row: AuthNItem): GluuDetailGridField[] => [
  {
    label: 'fields.acr',
    value: displayOrDash(row.acrName),
    doc_entry: 'acr',
    doc_category: AUTHN,
  },
  {
    label: 'fields.agama_project',
    value: displayOrDash(row.agamaProject),
  },
]

const isEditableAcr = (row: AuthNItem): boolean => row.acrType !== ACR_TYPES.AGAMA

const getAcrRowKey = (row: AuthNItem, index: number): string =>
  row.inum ?? row.acrName ?? row.name ?? `authn-${index}`

const Acrs = ({ isBuiltIn = false }: AcrsProps): ReactElement => {
  const { canRead: canReadAuthN, canWrite: canWriteAuthN } = usePermission(AUTH_RESOURCE_ID)
  const { t } = useTranslation()
  const { navigateToRoute } = useAppNavigation()
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY)

  const { state: themeState } = useTheme()
  const themeColors = useMemo(
    () => getThemeColor(themeState.theme || DEFAULT_THEME),
    [themeState.theme],
  )
  const { classes } = useStyles({ themeColors })

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE)

  const canLoadAcrList = canReadAuthN && !isBuiltIn

  const { data: ldapConfigurations, isLoading: ldapLoading } = useGetConfigDatabaseLdap({
    query: { staleTime: 30000, enabled: canLoadAcrList },
  })
  const { data: acrs, isLoading: acrsLoading } = useGetAcrs({
    query: { staleTime: 30000, enabled: canReadAuthN },
  })
  const { data: scriptsResponse, isLoading: scriptsLoading } = useCustomScriptsByType(
    DEFAULT_SCRIPT_TYPE,
    undefined,
    { enabled: canLoadAcrList },
  )
  const { data: agamaProjects, isLoading: agamaLoading } = useGetAgamaPrj(
    { count: MAX_AGAMA_PROJECTS_FOR_ACR, start: 0 },
    { query: { staleTime: 30000, enabled: canLoadAcrList } },
  )

  SetTitle(t('titles.authentication'))

  const handleGoToAuthNEditPage = useCallback(
    (row: AuthNItem) => {
      const id = row.inum || row.acrName || row.name || 'built-in'
      return navigateToRoute(ROUTES.AUTH_SERVER_AUTHN_EDIT(id), {
        state: {
          authnTab: isBuiltIn ? TAB_IDS.BUILT_IN : TAB_IDS.ACRS,
          selectedItem: row,
        } satisfies AuthnLocationState,
      })
    },
    [navigateToRoute, isBuiltIn],
  )

  const isLoading = ldapLoading || scriptsLoading || acrsLoading || agamaLoading

  const tableData = useMemo<AuthNItem[]>(() => {
    if (isLoading) {
      return []
    }
    if (isBuiltIn) {
      return BUILT_IN_ACRS
    }
    return buildAcrTableRows({
      ldapConfigurations,
      scripts: scriptsResponse?.entries,
      deployments: agamaProjects?.entries,
    })
  }, [isLoading, isBuiltIn, ldapConfigurations, scriptsResponse, agamaProjects])

  const columns: ColumnDef<AuthNItem>[] = useMemo(
    () => [
      {
        key: 'acrName',
        label: t('fields.acr'),
      },
      ...(isBuiltIn
        ? []
        : [
            {
              key: 'agamaProject' as const,
              label: t('fields.agama_project'),
            },
          ]),
      {
        key: 'samlACR',
        label: t('fields.saml_acr'),
      },
      {
        key: 'level',
        label: t('fields.level'),
      },
      {
        key: 'acrName',
        id: 'default',
        label: t('options.default'),
        align: 'center',
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
    [t, isBuiltIn, acrs?.defaultAcr, classes.defaultIconCircle, classes.defaultInnerIcon],
  )

  const actions = useMemo<ActionDef<AuthNItem>[]>(() => {
    if (isMobile || !canWriteAuthN) {
      return []
    }
    return [
      {
        icon: <Edit className={classes.editIcon} />,
        tooltip: t('messages.edit_authn'),
        id: 'editAuthN',
        onClick: handleGoToAuthNEditPage,
        show: isEditableAcr,
      },
    ]
  }, [isMobile, canWriteAuthN, t, handleGoToAuthNEditPage, classes.editIcon])

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
        fields={row.acrType === ACR_TYPES.AGAMA ? getAgamaDetailFields(row) : getDetailFields(row)}
        labelStyle={detailLabelStyle}
        defaultDocCategory={AUTHN}
        layout="column"
      />
    ),
    [getDetailFields, detailLabelStyle],
  )

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
            getRowKey={getAcrRowKey}
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
