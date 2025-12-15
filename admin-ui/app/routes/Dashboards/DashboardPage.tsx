import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { useMediaQuery } from 'react-responsive'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import DashboardChart from './Chart/DashboardChart'
import DateRange from './DateRange'
import CheckIcon from 'Images/svg/check.svg'
import CrossIcon from 'Images/svg/cross.svg'
import SetTitle from 'Utils/SetTitle'
import styles from './styles'
import type { CedarPermissionsState } from '@/cedarling/types'
import type { AuthState } from 'Redux/features/types/authTypes'

import { formatDate } from 'Utils/Util'
import UsersIcon from '@/components/SVG/menu/Users'
import Administrator from '@/components/SVG/menu/Administrator'
import OAuthIcon from '@/components/SVG/menu/OAuth'
import JansLockUsers from '@/components/SVG/menu/JansLockUsers'
import JansLockClients from '@/components/SVG/menu/JansLockClients'
import GluuPermissionModal from 'Routes/Apps/Gluu/GluuPermissionModal'
import { auditLogoutLogs } from 'Redux/features/sessionSlice'
import customColors from '@/customColors'
import { useCedarling } from '@/cedarling'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'

import { useDashboardLicense, useDashboardClients, useDashboardLockStats } from './hooks'
import { useMauStats } from 'Plugins/admin/components/MAU/hooks'
import { useHealthStatus } from 'Plugins/admin/components/Health/hooks'
import type { MauDateRange } from 'Plugins/admin/components/MAU/types'

interface RootState {
  authReducer: AuthState
  cedarPermissions: CedarPermissionsState
}

function DashboardPage() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  const isMobile = useMediaQuery({ maxWidth: 767 })
  const { classes } = styles()

  const [startDate, setStartDate] = useState<Dayjs>(dayjs().subtract(3, 'months'))
  const [endDate, setEndDate] = useState<Dayjs>(dayjs())

  const { isUserInfoFetched } = useSelector((state: RootState) => state.authReducer)
  const access_token = useSelector((state: RootState) => state.authReducer.token?.access_token)
  const permissions = useSelector((state: RootState) => state.authReducer.permissions)

  const { hasCedarReadPermission, authorizeHelper } = useCedarling()
  const { navigateToRoute } = useAppNavigation()
  const cedarInitialized = useSelector((state: RootState) => state.cedarPermissions?.initialized)
  const cedarIsInitializing = useSelector(
    (state: RootState) => state.cedarPermissions?.isInitializing,
  )

  const dashboardResourceId = useMemo(() => ADMIN_UI_RESOURCES.Dashboard, [])
  const dashboardScopes = useMemo(
    () => CEDAR_RESOURCE_SCOPES[dashboardResourceId],
    [dashboardResourceId],
  )

  const hasViewPermissions = useMemo(() => {
    if (!cedarInitialized || cedarIsInitializing) {
      return false
    }
    return Boolean(hasCedarReadPermission(dashboardResourceId))
  }, [cedarInitialized, cedarIsInitializing, hasCedarReadPermission, dashboardResourceId])

  SetTitle(t('menus.dashboard'))

  const initPermissions = useCallback(async () => {
    if (!access_token || !cedarInitialized) return
    await authorizeHelper(dashboardScopes)
  }, [access_token, cedarInitialized, authorizeHelper, dashboardScopes])

  useEffect(() => {
    if (access_token && cedarInitialized && !cedarIsInitializing) {
      initPermissions()
    }
  }, [access_token, cedarInitialized, cedarIsInitializing, initPermissions])

  const { data: license, isLoading: licenseLoading } = useDashboardLicense()
  const {
    clients,
    totalCount: totalClientsEntries,
    isLoading: clientsLoading,
  } = useDashboardClients()
  const { services, isLoading: healthLoading } = useHealthStatus()

  const isLockServiceAvailable = useMemo(() => {
    const lockService = services.find((s) => s.name === 'jans-lock')
    return lockService?.status === 'up'
  }, [services])

  const {
    latestStats: lockStats,
    isLoading: lockLoading,
    data: lockData,
  } = useDashboardLockStats({
    enabled: isLockServiceAvailable,
  })

  const dateRange: MauDateRange = useMemo(
    () => ({
      startDate,
      endDate,
    }),
    [startDate, endDate],
  )

  const {
    data: mauData,
    isLoading: mauLoading,
    summary: mauSummary,
  } = useMauStats(dateRange, {
    enabled: hasViewPermissions && !!access_token,
  })

  const { mauCount, tokenCount } = useMemo(() => {
    if (!mauData || mauData.length === 0) {
      return { mauCount: null, tokenCount: null }
    }

    const selectedYear = endDate.year()
    const selectedMonth = endDate.month() + 1
    const yearMonth = selectedYear * 100 + selectedMonth

    const selectedMonthData = mauData.find((item) => item.month === yearMonth)

    const mau = selectedMonthData?.mau
    const token =
      (selectedMonthData?.authz_code_access_token_count || 0) +
      (selectedMonthData?.client_credentials_access_token_count || 0)

    return { mauCount: mau || null, tokenCount: token || null }
  }, [mauData, endDate])

  const summaryData = useMemo(() => {
    const baseData = [
      {
        text: t('dashboard.oidc_clients_count'),
        value: totalClientsEntries,
        icon: <Administrator className={classes.summaryIcon} style={{ top: '8px' }} />,
      },
      {
        text: t('dashboard.active_users_count'),
        value: mauCount ?? 0,
        icon: <UsersIcon className={classes.summaryIcon} style={{ top: '4px' }} />,
      },
      {
        text: t('dashboard.token_issued_count'),
        value: tokenCount ?? 0,
        icon: <OAuthIcon className={classes.summaryIcon} style={{ top: '8px' }} />,
      },
    ]

    if (lockData && lockData.length > 0 && lockStats) {
      baseData.push(
        {
          text: t('dashboard.mau_users'),
          value: lockStats.monthly_active_users,
          icon: <JansLockUsers className={classes.summaryIcon} style={{ top: '8px' }} />,
        },
        {
          text: t('dashboard.mau_clients'),
          value: lockStats.monthly_active_clients,
          icon: <JansLockClients className={classes.summaryIcon} style={{ top: '8px' }} />,
        },
      )
    }

    return baseData
  }, [t, totalClientsEntries, mauCount, tokenCount, lockData, lockStats, classes.summaryIcon])

  const userInfo = useMemo(
    () => [
      {
        text: t('dashboard.product_name'),
        value: license?.productName,
      },
      {
        text: t('dashboard.license_type'),
        value: license?.licenseType,
      },
      {
        text: t('dashboard.customer_email'),
        value: license?.customerEmail,
      },
      {
        text: t('dashboard.customer_name'),
        value:
          String(license?.customerFirstName || '') + ' ' + String(license?.customerLastName || ''),
      },
      {
        text: t('fields.validityPeriod'),
        value: formatDate(license?.validityPeriod),
        key: 'License Validity Period',
      },
      {
        text: t('dashboard.license_status'),
        value: license?.licenseActive ? 'active' : 'inactive',
        key: 'License Status',
      },
    ],
    [t, license],
  )

  const getServiceStatus = useCallback(
    (key: string) => {
      const service = services.find((s) => s.name === key)
      return service?.status ?? 'unknown'
    },
    [services],
  )

  const statusDetails = useMemo(() => {
    const allServices = [
      { label: 'menus.oauthserver', key: 'jans-auth' },
      { label: 'dashboard.config_api', key: 'jans-config-api' },
      { label: 'dashboard.database_status', key: 'database' },
      { label: 'FIDO', key: 'jans-fido2' },
      { label: 'CASA', key: 'jans-casa' },
      { label: 'dashboard.key_cloak', key: 'keycloak' },
      { label: 'SCIM', key: 'jans-scim' },
      { label: 'dashboard.jans_lock', key: 'jans-lock' },
    ]

    return allServices.filter((serviceConfig) => {
      const status = getServiceStatus(serviceConfig.key)
      return status === 'up' || status === 'degraded'
    })
  }, [services, getServiceStatus])

  const getClassName = useCallback(
    (key: string) => {
      const status = getServiceStatus(key)
      if (status === 'up') return classes.checkText
      if (status === 'degraded') return classes.orange
      return classes.crossText
    },
    [getServiceStatus, classes.checkText, classes.orange, classes.crossText],
  )

  const getStatusText = useCallback(
    (key: string) => {
      const status = getServiceStatus(key)
      if (status === 'up') return 'Running'
      if (status === 'down') return 'Down'
      if (status === 'degraded') return 'Degraded'
      return 'Unknown'
    },
    [getServiceStatus],
  )

  const getStatusIcon = useCallback(
    (key: string) => {
      const status = getServiceStatus(key)
      if (status === 'up' || status === 'degraded') return CheckIcon
      return CrossIcon
    },
    [getServiceStatus],
  )

  const StatusCard = useMemo(
    () => (
      <Grid item xs={12}>
        <div className={classes.statusContainer}>
          <div
            className={classes.userInfoTitle}
            style={{
              color: customColors.white,
              fontSize: 24,
              fontWeight: 400,
              marginBottom: '10px',
            }}
          >
            {t('dashboard.system_status')}
          </div>

          <div
            className={classes.userInfoText}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}
          >
            {statusDetails.map(({ label, key }) => (
              <div className={classes.statusText} key={label}>
                <div
                  className="d-flex justify-content-between"
                  style={{
                    width: '100%',
                    borderLeft: '4px solid ' + customColors.orange,
                    paddingLeft: '10px',
                  }}
                >
                  <div>
                    <span style={{ display: 'block', marginBottom: '-4px' }}>{t(label)}</span>
                    <span className={getClassName(key)} style={{ fontSize: '16px' }}>
                      {getStatusText(key)}
                    </span>
                  </div>
                  <span style={{ width: '18%', marginTop: '10px' }}>
                    <img src={getStatusIcon(key)} className={getClassName(key)} alt={label} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Grid>
    ),
    [t, statusDetails, classes, getClassName, getStatusText, getStatusIcon],
  )

  const handleLogout = useCallback(() => {
    if (access_token) {
      dispatch(
        auditLogoutLogs({
          message: 'Logging out due to insufficient permissions for Admin UI access.',
        }),
      )
    } else {
      navigateToRoute(ROUTES.LOGOUT)
    }
  }, [access_token, dispatch, navigateToRoute])

  const showModal = useMemo(() => {
    const shouldShowModal = !isUserInfoFetched && (!access_token || !hasViewPermissions)

    if (shouldShowModal) {
      return <GluuPermissionModal handler={handleLogout} isOpen={true} />
    }

    return null
  }, [isUserInfoFetched, access_token, hasViewPermissions, handleLogout])

  const isBlocking = useMemo(() => {
    return (
      licenseLoading ||
      clientsLoading ||
      mauLoading ||
      healthLoading ||
      lockLoading ||
      cedarIsInitializing ||
      (!cedarInitialized && !permissions)
    )
  }, [
    licenseLoading,
    clientsLoading,
    mauLoading,
    healthLoading,
    lockLoading,
    cedarIsInitializing,
    cedarInitialized,
    permissions,
  ])

  const handleStartDateChange = useCallback(
    (date: Dayjs | null) => {
      if (date) {
        setStartDate(date)
        if (date.isAfter(endDate)) {
          setEndDate(date)
        }
      }
    },
    [endDate],
  )

  const handleEndDateChange = useCallback(
    (date: Dayjs | null) => {
      if (date) {
        setEndDate(date)
        if (date.isBefore(startDate)) {
          setStartDate(date)
        }
      }
    },
    [startDate],
  )

  const startMonth = startDate.format('YYYYMM')
  const endMonth = endDate.format('YYYYMM')

  return (
    <GluuLoader blocking={isBlocking}>
      {showModal}
      <GluuViewWrapper canShow={hasViewPermissions}>
        <div className={classes.root}>
          <Grid container className="px-40 h-100" spacing={2}>
            <Grid item lg={3} md={12} xs={12} height="auto">
              <div
                className={classes.userInfoTitle}
                style={{
                  color: customColors.white,
                  fontSize: 24,
                  fontWeight: 400,
                  marginBottom: '10px',
                }}
              >
                {t('dashboard.summary_title')}
              </div>
              <div className="d-flex flex-column" style={{ gap: '10px', marginTop: '11px' }}>
                {summaryData.map((data, key) => (
                  <Paper key={key} className={classes.summary}>
                    <div className={classes.summaryDetails}>
                      <div>
                        <div className={classes.summaryText}>{data.text}</div>
                        <div className={classes.summaryValue}>{data.value}</div>
                      </div>
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ width: '30%', height: '100%' }}
                      >
                        {data.icon}
                      </div>
                    </div>
                  </Paper>
                ))}
              </div>
            </Grid>

            <Grid item lg={5} md={12} xs={12}>
              {StatusCard}
            </Grid>

            <Grid item lg={4} md={12} xs={12}>
              <Paper
                className={classes.dashboardCard + ' top-minus-40 d-flex justify-content-center'}
                elevation={0}
              >
                <Grid className={classes.flex} container>
                  <Grid item xs={12} className={isMobile ? 'mt-20' : ''}>
                    <div className={classes.userInfo}>
                      <div
                        className={classes.userInfoTitle}
                        style={{
                          color: customColors.white,
                          fontSize: 24,
                          fontWeight: 400,
                          marginBottom: '10px',
                        }}
                      >
                        {t('dashboard.user_info')}
                      </div>
                      <div
                        className="d-flex flex-column justify-content-between"
                        style={{
                          backgroundColor: customColors.white,
                          padding: '20px',
                          borderRadius: '5px',
                        }}
                      >
                        {userInfo.map((info, key) => (
                          <div className={classes.userInfoText} key={key}>
                            <span style={{ fontWeight: 600 }}>{info.text}: </span>
                            {info?.key === 'License Status' ? (
                              <span
                                className={
                                  info.value === 'active' ? classes.greenBlock : classes.redBlock
                                }
                              >
                                {info.value}
                              </span>
                            ) : (
                              <React.Fragment>{info.value}</React.Fragment>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>

          <Grid container className="px-40" sx={{ marginTop: '20px' }}>
            <Grid lg={12} xs={12} item>
              <h3 className="text-white">{t('dashboard.access_tokens_graph')}</h3>
              {isTabletOrMobile ? (
                <Grid container className={classes.whiteBg}>
                  <Grid
                    xs={12}
                    item
                    style={
                      isTabletOrMobile ? { marginLeft: 40 } : { marginLeft: 40, marginBottom: 40 }
                    }
                  >
                    <div>{t('dashboard.select_date_range')}</div>
                    <DateRange
                      startDate={startDate}
                      endDate={endDate}
                      onStartDateChange={handleStartDateChange}
                      onEndDateChange={handleEndDateChange}
                    />
                  </Grid>
                  <Grid xs={11} item className={classes.desktopChartStyle}>
                    <DashboardChart
                      statData={mauData ?? []}
                      startMonth={startMonth}
                      endMonth={endMonth}
                    />
                  </Grid>
                </Grid>
              ) : (
                <Grid container className={classes.whiteBg + ' ' + classes.flex}>
                  <Grid md={9} xs={12} item className={classes.desktopChartStyle}>
                    <DashboardChart
                      statData={mauData ?? []}
                      startMonth={startMonth}
                      endMonth={endMonth}
                    />
                  </Grid>
                  <Grid md={3} xs={6} item>
                    <div style={{ fontSize: 'large' }}>{t('dashboard.select_date_range')}</div>
                    <DateRange
                      startDate={startDate}
                      endDate={endDate}
                      onStartDateChange={handleStartDateChange}
                      onEndDateChange={handleEndDateChange}
                    />
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid container className={classes.flex + ' px-40'}>
            <Grid xs={12} item>
              <Grid xs={12} item className={(isMobile ? classes.block : classes.flex) + ' mt-20'}>
                <ul className="me-40">
                  <li className={classes.orange}>
                    {t('dashboard.client_credentials_access_token')}
                  </li>
                </ul>
                <ul className="me-40">
                  <li className={classes.lightBlue}>
                    {t('dashboard.authorization_code_access_token')}
                  </li>
                </ul>
                <ul>
                  <li className={classes.redText}>{t('dashboard.authorization_code_id_token')}</li>
                </ul>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </GluuViewWrapper>
    </GluuLoader>
  )
}

export default DashboardPage
