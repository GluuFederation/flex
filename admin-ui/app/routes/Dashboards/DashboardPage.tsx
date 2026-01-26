import React, { useState, useEffect, useMemo, useCallback, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { useCedarling } from '@/cedarling'
import customColors, { hexToRgb } from '@/customColors'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { THEME_DARK, DEFAULT_THEME } from '@/context/theme/constants'
import { auditLogoutLogs } from 'Redux/features/sessionSlice'
import type { AuthState } from 'Redux/features/types/authTypes'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuPermissionModal from 'Routes/Apps/Gluu/GluuPermissionModal'
import { formatDate } from 'Utils/Util'
import { useDebounce } from 'Utils/hooks'
import SetTitle from 'Utils/SetTitle'
import { useMauStats } from 'Plugins/admin/components/MAU/hooks'
import { useHealthStatus } from 'Plugins/admin/components/Health/hooks'
import type { CedarPermissionsState } from '@/cedarling/types'
import type { MauDateRange } from 'Plugins/admin/components/MAU/types'
import DashboardChart from './Chart/DashboardChart'
import { CHART_LEGEND_CONFIG, STATUS_DETAILS } from './constants'
import DateRange from './DateRange'
import { useDashboardLicense, useDashboardClients, useDashboardLockStats } from './hooks'
import styles from './styles'
import { StatusIndicator, SummaryCard, UserInfoItem } from './components'

interface RootState {
  authReducer: AuthState
  cedarPermissions: CedarPermissionsState
}

const DashboardPage = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const isMobile = useMediaQuery({ maxWidth: 767 })

  const themeContext = useContext(ThemeContext)
  const currentTheme = useMemo(
    () => themeContext?.state.theme || DEFAULT_THEME,
    [themeContext?.state.theme],
  )
  const themeColors = useMemo(() => getThemeColor(currentTheme), [currentTheme])

  const isDark = currentTheme === THEME_DARK
  const dashboardThemeColors = useMemo(() => {
    const baseColors = isDark
      ? {
          cardBg: customColors.darkCardBg,
          cardBorder: `rgba(${hexToRgb(customColors.darkBorderGradientBase)}, 0.2)`,
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
    isDark,
  })

  const [startDate, setStartDate] = useState<Dayjs>(dayjs().subtract(3, 'months'))
  const [endDate, setEndDate] = useState<Dayjs>(dayjs())

  const debouncedStartDate = useDebounce(startDate, 400)
  const debouncedEndDate = useDebounce(endDate, 400)

  const { isUserInfoFetched, hasSession } = useSelector((state: RootState) => state.authReducer)
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
    if (!hasSession || !cedarInitialized) return
    await authorizeHelper(dashboardScopes)
  }, [hasSession, cedarInitialized, authorizeHelper, dashboardScopes])

  useEffect(() => {
    if (hasSession && cedarInitialized && !cedarIsInitializing) {
      initPermissions()
    }
  }, [hasSession, cedarInitialized, cedarIsInitializing, initPermissions])

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
      startDate: debouncedStartDate,
      endDate: debouncedEndDate,
    }),
    [debouncedStartDate, debouncedEndDate],
  )

  const { data: mauData, isLoading: mauLoading } = useMauStats(dateRange, {
    enabled: hasViewPermissions && hasSession,
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
          `${license?.customerFirstName || ''} ${license?.customerLastName || ''}`.trim() || 'N/A',
        isStatus: false,
      },
      {
        text: t('fields.validityPeriod'),
        value: formatDate(license?.validityPeriod),
        isStatus: false,
      },
      {
        text: t('dashboard.license_status'),
        value:
          license?.licenseActive !== undefined
            ? license.licenseActive
              ? 'active'
              : 'inactive'
            : 'Unknown',
        isStatus: license?.licenseActive !== undefined,
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
    if (hasSession) {
      dispatch(
        auditLogoutLogs({
          message: 'Logging out due to insufficient permissions for Admin UI access.',
        }),
      )
    } else {
      navigateToRoute(ROUTES.LOGOUT)
    }
  }, [hasSession, dispatch, navigateToRoute])

  const showModal = useMemo(() => {
    const shouldShowModal = !isUserInfoFetched && (!hasSession || !hasViewPermissions)

    if (shouldShowModal) {
      return <GluuPermissionModal handler={handleLogout} isOpen={true} />
    }

    return null
  }, [isUserInfoFetched, hasSession, hasViewPermissions, handleLogout])

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
      start: debouncedStartDate.format('YYYYMM'),
      end: debouncedEndDate.format('YYYYMM'),
    }),
    [debouncedStartDate, debouncedEndDate],
  )

  return (
    <GluuLoader blocking={isBlocking}>
      {showModal}

      <div className={classes.root}>
        <Grid container className="px-24" style={{ marginBottom: 0 }}>
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

        <Grid container className="px-24" spacing={2}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {summaryData.slice(0, 3).map((data) => (
                <Grid item xs={12} sm={6} md={4} key={data.text}>
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
                      <div className={classes.userInfoColumn}>
                        {userInfo
                          .filter((_, index) => index % 2 === 0)
                          .map((item) => (
                            <UserInfoItem
                              key={item.text}
                              item={item}
                              classes={classes}
                              isStatus={item.isStatus}
                              t={t}
                            />
                          ))}
                      </div>
                      <div className={classes.userInfoColumn}>
                        {userInfo
                          .filter((_, index) => index % 2 === 1)
                          .map((item) => (
                            <UserInfoItem
                              key={item.text}
                              item={item}
                              classes={classes}
                              isStatus={item.isStatus}
                              t={t}
                            />
                          ))}
                      </div>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item lg={7} md={12} xs={12}>
            <Paper elevation={0} style={{ background: 'transparent' }}>
              <div className={classes.whiteBg}>
                <h3 className={classes.chartTitle}>{t('dashboard.access_tokens_graph')}</h3>
                <div className={classes.chartDatePickers}>
                  <DateRange
                    startDate={startDate}
                    endDate={endDate}
                    onStartDateChange={handleStartDateChange}
                    onEndDateChange={handleEndDateChange}
                    onStartDateAccept={handleStartDateChange}
                    onEndDateAccept={handleEndDateChange}
                    textColor={dashboardThemeColors.text}
                    backgroundColor={dashboardThemeColors.cardBg}
                    isDark={isDark}
                  />
                </div>
                <div className={classes.desktopChartStyle}>
                  <div className={classes.chartBackground} />
                  <DashboardChart
                    statData={mauData ?? []}
                    startMonth={dateMonths.start}
                    endMonth={dateMonths.end}
                    textColor={dashboardThemeColors.text}
                    gridColor={dashboardThemeColors.textSecondary}
                    tooltipBackgroundColor={dashboardThemeColors.cardBg}
                    tooltipTextColor={dashboardThemeColors.text}
                    isDark={isDark}
                  />
                </div>
                <div className={classes.chartLegend}>
                  {CHART_LEGEND_CONFIG.map((config) => (
                    <div key={config.dataKey} className={classes.legendItem}>
                      <div
                        className={classes.legendColor}
                        style={{ backgroundColor: config.color }}
                      />
                      <span>{t(config.translationKey)}</span>
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
