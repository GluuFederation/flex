import React, { useState, useEffect, useMemo, useCallback, useContext, memo } from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { useMediaQuery } from 'react-responsive'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import DashboardChart from './Chart/DashboardChart'
import DateRange from './DateRange'
import SetTitle from 'Utils/SetTitle'
import styles from './styles'
import type { CedarPermissionsState } from '@/cedarling/types'
import type { AuthState } from 'Redux/features/types/authTypes'

import { formatDate } from 'Utils/Util'
import GluuPermissionModal from 'Routes/Apps/Gluu/GluuPermissionModal'
import { auditLogoutLogs } from 'Redux/features/sessionSlice'
import customColors from '@/customColors'
import { useCedarling } from '@/cedarling'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'

import { useDashboardLicense, useDashboardClients, useDashboardLockStats } from './hooks'
import { useMauStats } from 'Plugins/admin/components/MAU/hooks'
import { useHealthStatus } from 'Plugins/admin/components/Health/hooks'
import type { MauDateRange } from 'Plugins/admin/components/MAU/types'

interface RootState {
  authReducer: AuthState
  cedarPermissions: CedarPermissionsState
}

type ClassesType = Record<string, string>

const STATUS_DETAILS = [
  { label: 'menus.oauthserver', key: 'jans-auth' },
  { label: 'dashboard.config_api', key: 'jans-config-api' },
  { label: 'dashboard.database_status', key: 'database' },
  { label: 'FIDO', key: 'jans-fido2' },
  { label: 'CASA', key: 'jans-casa' },
  { label: 'dashboard.key_cloak', key: 'keycloak' },
  { label: 'SCIM', key: 'jans-scim' },
  { label: 'dashboard.jans_lock', key: 'jans-lock' },
] as const

const LEGEND_ITEMS = [
  { color: customColors.chartPurple, label: 'Authorization Code ID Token' },
  { color: customColors.chartCoral, label: 'Authorization Code Access Token' },
  { color: customColors.chartCyan, label: 'Client Credential Access Token' },
] as const

const CHART_TITLE_STYLE = {
  fontSize: 22,
  fontWeight: 500,
  marginBottom: 0,
  marginTop: 0,
} as const

const StatusIndicator = memo<{
  label: string
  status: string
  classes: ClassesType
  t: (key: string) => string
}>(({ label, status, classes, t }) => {
  const isActive = status === 'up' || status === 'degraded'
  return (
    <div className={classes.statusIndicator}>
      <div
        className={`${classes.statusDot} ${
          isActive ? classes.statusDotActive : classes.statusDotInactive
        }`}
      />
      <span>{t(label)}</span>
    </div>
  )
})
StatusIndicator.displayName = 'StatusIndicator'

const SummaryCard = memo<{
  text: string
  value: number | null
  classes: ClassesType
}>(({ text, value, classes }) => (
  <Paper className={classes.summary} elevation={0}>
    <div className={classes.summaryText}>{text}</div>
    <div className={classes.summaryValue}>{value}</div>
  </Paper>
))
SummaryCard.displayName = 'SummaryCard'

const UserInfoItem = memo<{
  item: { text: string; value: string | undefined }
  classes: ClassesType
  isStatus?: boolean
}>(({ item, classes, isStatus }) => {
  if (isStatus) {
    const isActive = item.value === 'active'
    const displayValue = item.value ? item.value.charAt(0).toUpperCase() + item.value.slice(1) : '-'
    return (
      <div className={classes.userInfoStatusContainer}>
        <div className={classes.userInfoText}>{item.text}:</div>
        <span className={isActive ? classes.greenBlock : classes.redBlock}>{displayValue}</span>
      </div>
    )
  }

  return (
    <>
      <div className={classes.userInfoText}>{item.text}:</div>
      <div className={classes.userInfoValue}>{item.value || '-'}</div>
    </>
  )
})
UserInfoItem.displayName = 'UserInfoItem'

const DashboardPage = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const isMobile = useMediaQuery({ maxWidth: 767 })

  const themeContext = useContext(ThemeContext)
  const currentTheme = useMemo(
    () => themeContext?.state.theme || 'light',
    [themeContext?.state.theme],
  )
  const themeColors = useMemo(() => getThemeColor(currentTheme), [currentTheme])

  const isDark = currentTheme === 'dark'
  const dashboardThemeColors = useMemo(() => {
    const baseColors = isDark
      ? {
          cardBg: customColors.darkCardBg,
          cardBorder: customColors.darkBorderAccent,
          text: customColors.white,
          textSecondary: customColors.textMutedDark,
        }
      : {
          cardBg: customColors.white,
          cardBorder: customColors.lightBorder,
          text: customColors.primaryDark,
          textSecondary: customColors.textSecondary,
        }

    return {
      ...baseColors,
      background: themeColors.background,
      statusCardBg: baseColors.cardBg,
      statusCardBorder: baseColors.cardBorder,
    }
  }, [isDark, themeColors.background])

  const { classes } = styles({
    themeColors: dashboardThemeColors,
    isDark: currentTheme === 'dark',
  })

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
  const { totalCount: totalClientsEntries, isLoading: clientsLoading } = useDashboardClients()
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

  const { data: mauData, isLoading: mauLoading } = useMauStats(dateRange, {
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
      },
      {
        text: t('dashboard.active_users_count'),
        value: mauCount ?? 0,
      },
      {
        text: t('dashboard.token_issued_count'),
        value: tokenCount ?? 0,
      },
    ]

    if (lockData && lockData.length > 0 && lockStats) {
      baseData.push(
        {
          text: t('dashboard.mau_users'),
          value: lockStats.monthly_active_users,
        },
        {
          text: t('dashboard.mau_clients'),
          value: lockStats.monthly_active_clients,
        },
      )
    }

    return baseData
  }, [t, totalClientsEntries, mauCount, tokenCount, lockData, lockStats])

  const userInfo = useMemo(
    () => [
      {
        text: t('dashboard.product_name'),
        value: license?.productName,
        isStatus: false,
      },
      {
        text: t('dashboard.license_type'),
        value: license?.licenseType,
        isStatus: false,
      },
      {
        text: t('dashboard.customer_email'),
        value: license?.customerEmail,
        isStatus: false,
      },
      {
        text: t('dashboard.customer_name'),
        value:
          String(license?.customerFirstName || '') + ' ' + String(license?.customerLastName || ''),
        isStatus: false,
      },
      {
        text: t('fields.validityPeriod'),
        value: formatDate(license?.validityPeriod),
        isStatus: false,
      },
      {
        text: t('dashboard.license_status'),
        value: license?.licenseActive ? 'active' : 'inactive',
        isStatus: true,
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

  const handleDateChange = useCallback(
    (type: 'start' | 'end', date: Dayjs | null) => {
      if (!date) return

      if (type === 'start') {
        setStartDate(date)
        if (date.isAfter(endDate)) {
          setEndDate(date)
        }
      } else {
        setEndDate(date)
        if (date.isBefore(startDate)) {
          setStartDate(date)
        }
      }
    },
    [startDate, endDate],
  )

  const handleStartDateChange = useCallback(
    (date: Dayjs | null) => handleDateChange('start', date),
    [handleDateChange],
  )

  const handleEndDateChange = useCallback(
    (date: Dayjs | null) => handleDateChange('end', date),
    [handleDateChange],
  )

  const dateMonths = useMemo(
    () => ({
      start: startDate.format('YYYYMM'),
      end: endDate.format('YYYYMM'),
    }),
    [startDate, endDate],
  )

  const chartTitleStyle = useMemo(
    () => ({
      ...CHART_TITLE_STYLE,
      color: dashboardThemeColors.text,
    }),
    [dashboardThemeColors.text],
  )

  return (
    <GluuLoader blocking={isBlocking}>
      {showModal}

      <div className={classes.root}>
        <Grid container className="px-40" style={{ marginBottom: 0 }}>
          <Grid item xs={12}>
            <div className={classes.statusSection}>
              <div className={classes.statusContainer}>
                {STATUS_DETAILS.map(({ label, key }) => (
                  <StatusIndicator
                    key={label}
                    label={label}
                    status={getServiceStatus(key)}
                    classes={classes}
                    t={t}
                  />
                ))}
              </div>
            </div>
          </Grid>
        </Grid>

        <Grid container className="px-40" spacing={2}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {summaryData.slice(0, 3).map((data, key) => (
                <Grid item xs={12} sm={6} md={4} key={key}>
                  <SummaryCard text={data.text} value={data.value} classes={classes} />
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item lg={5} md={12} xs={12}>
            <Paper
              className={classes.dashboardCard + ' d-flex justify-content-center'}
              elevation={0}
            >
              <Grid className={classes.flex} container>
                <Grid item xs={12} className={isMobile ? 'mt-20' : ''}>
                  <div className={classes.userInfo}>
                    <div className={classes.userInfoTitle}>{t('dashboard.user_info')}</div>
                    <div className={classes.userInfoContent}>
                      {Array.from({ length: Math.ceil(userInfo.length / 2) }, (_, rowIndex) => {
                        const startIndex = rowIndex * 2
                        const rowItems = userInfo.slice(startIndex, startIndex + 2)
                        const isLastRow = rowIndex === Math.ceil(userInfo.length / 2) - 1

                        return (
                          <div
                            key={rowIndex}
                            className={`${classes.userInfoRow} ${
                              isLastRow ? classes.userInfoRowLast : ''
                            }`}
                          >
                            {rowItems.map((item, itemIndex) => (
                              <div
                                key={startIndex + itemIndex}
                                className={`${classes.userInfoItem} ${
                                  itemIndex === 0
                                    ? classes.userInfoItemLeft
                                    : classes.userInfoItemRight
                                }`}
                              >
                                <UserInfoItem
                                  item={item}
                                  classes={classes}
                                  isStatus={item.isStatus}
                                />
                              </div>
                            ))}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item lg={7} md={12} xs={12}>
            <Paper elevation={0} style={{ background: 'transparent' }}>
              <div className={classes.whiteBg}>
                <h3 style={chartTitleStyle}>{t('dashboard.access_tokens_graph')}</h3>
                <DateRange
                  startDate={startDate}
                  endDate={endDate}
                  onStartDateChange={handleStartDateChange}
                  onEndDateChange={handleEndDateChange}
                  textColor={dashboardThemeColors.text}
                  backgroundColor={dashboardThemeColors.cardBg}
                  isDark={isDark}
                />
                <div className={classes.desktopChartStyle}>
                  <div className={classes.chartBackground} />
                  <DashboardChart
                    statData={mauData ?? []}
                    startMonth={dateMonths.start}
                    endMonth={dateMonths.end}
                    textColor={dashboardThemeColors.text}
                    gridColor={dashboardThemeColors.textSecondary}
                  />
                </div>
                <div className={classes.chartLegend}>
                  {LEGEND_ITEMS.map((item) => (
                    <div key={item.label} className={classes.legendItem}>
                      <div
                        className={classes.legendColor}
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </GluuLoader>
  )
}

export default DashboardPage
