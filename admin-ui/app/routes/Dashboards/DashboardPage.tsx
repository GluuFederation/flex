import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { useMediaQuery } from 'react-responsive'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { getClients } from 'Redux/features/initSlice'
import { buildPayload } from 'Utils/PermChecker'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getLicenseDetails } from 'Redux/features/licenseDetailsSlice'
import DashboardChart from './Chart/DashboardChart'
import DateRange from './DateRange'
import CheckIcon from 'Images/svg/check.svg'
import CrossIcon from 'Images/svg/cross.svg'
import SetTitle from 'Utils/SetTitle'
import styles from './styles'
import { formatDate } from 'Utils/Util'
import UsersIcon from '@/components/SVG/menu/Users'
import Administrator from '@/components/SVG/menu/Administrator'
import OAuthIcon from '@/components/SVG/menu/OAuth'
import JansLockUsers from '@/components/SVG/menu/JansLockUsers'
import JansLockClients from '@/components/SVG/menu/JansLockClients'
import GluuPermissionModal from 'Routes/Apps/Gluu/GluuPermissionModal'
import { auditLogoutLogs } from 'Redux/features/sessionSlice'
import { useNavigate } from 'react-router'
import customColors from '@/customColors'
import { useCedarling } from '@/cedarling'

// Constants moved outside component for better performance
const FETCHING_LICENSE_DETAILS = 'Fetch license details'

function DashboardPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userAction = useMemo(() => ({}), [])
  const options = useMemo(() => ({}), [])
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  const isMobile = useMediaQuery({ maxWidth: 767 })
  const { classes } = styles()
  const [mauCount, setMauCount] = useState(null)
  const [tokenCount, setTokenCount] = useState(null)

  const [requestStates, setRequestStates] = useState({
    licenseRequested: false,
    clientsRequested: false,
  })
  const statData = useSelector((state: any) => state.mauReducer.stat)
  const loading = useSelector((state: any) => state.mauReducer.loading)
  const clients = useSelector((state: any) => state.initReducer.clients)
  const lock = useSelector((state: any) => state.lockReducer.lockDetail)
  const { isUserInfoFetched } = useSelector((state: any) => state.authReducer)
  const totalClientsEntries = useSelector((state: any) => state.initReducer.totalClientsEntries)
  const license = useSelector((state: any) => state.licenseDetailsReducer.item)
  const serverStatus = useSelector((state: any) => state.healthReducer.serverStatus)
  const serverHealth = useSelector((state: any) => state.healthReducer.health)
  const dbStatus = useSelector((state: any) => state.healthReducer.dbStatus)
  const access_token = useSelector((state: any) => state.authReducer.token?.access_token)
  const permissions = useSelector((state: any) => state.authReducer.permissions)

  const { hasCedarReadPermission, authorizeHelper } = useCedarling()
  const cedarInitialized = useSelector((state: any) => state.cedarPermissions?.initialized)
  const cedarIsInitializing = useSelector((state: any) => state.cedarPermissions?.isInitializing)
  const cedarPermissions = useSelector((state: any) => state.cedarPermissions?.permissions)

  console.log('cedarPermissions', cedarPermissions)

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

  const processedStats = useMemo(() => {
    if (!statData || statData.length === 0) return { mauCount: null, tokenCount: null }

    const date = new Date()
    const currentYear = date.getFullYear()
    const currentMonth = date.getMonth() + 1
    const formattedMonth =
      currentMonth > 9 ? currentMonth.toString() : '0' + currentMonth.toString()
    const yearMonth = currentYear.toString() + formattedMonth
    const currentMonthData = statData.find(({ month }: any) => month.toString() === yearMonth)

    const mau = currentMonthData?.mau
    const token =
      (currentMonthData?.authz_code_access_token_count || 0) +
      (currentMonthData?.client_credentials_access_token_count || 0)

    return { mauCount: mau || null, tokenCount: token || null }
  }, [statData])

  useEffect(() => {
    setMauCount(processedStats.mauCount)
    setTokenCount(processedStats.tokenCount)
  }, [processedStats])

  useEffect(() => {
    if (
      access_token &&
      hasViewPermissions &&
      Object.keys(license).length === 0 &&
      !loading &&
      !requestStates.licenseRequested
    ) {
      setRequestStates((prev) => ({ ...prev, licenseRequested: true }))
      buildPayload(userAction as any, FETCHING_LICENSE_DETAILS, options as any)
      dispatch(getLicenseDetails({} as any))
    }
  }, [
    access_token,
    hasViewPermissions,
    license,
    loading,
    requestStates.licenseRequested,
    dispatch,
    userAction,
    options,
    FETCHING_LICENSE_DETAILS,
  ])

  useEffect(() => {
    if (
      access_token &&
      hasViewPermissions &&
      clients.length === 0 &&
      !requestStates.clientsRequested
    ) {
      setRequestStates((prev) => ({ ...prev, clientsRequested: true }))
      buildPayload(userAction as any, 'Fetch openid connect clients', {} as any)
      dispatch(getClients({ action: userAction } as any))
    }
  }, [
    access_token,
    hasViewPermissions,
    clients,
    requestStates.clientsRequested,
    dispatch,
    userAction,
  ])

  const isUp = useCallback((status: any) => {
    if (!status) return false
    return status.toUpperCase() === 'ONLINE' || status.toUpperCase() === 'RUNNING'
  }, [])

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

    if (lock && lock.length > 0) {
      baseData.push(
        {
          text: t('dashboard.mau_users'),
          value: lock[0]?.monthly_active_users ?? 0,
          icon: <JansLockUsers className={classes.summaryIcon} style={{ top: '8px' }} />,
        },
        {
          text: t('dashboard.mau_clients'),
          value: lock[0]?.monthly_active_clients ?? 0,
          icon: <JansLockClients className={classes.summaryIcon} style={{ top: '8px' }} />,
        },
      )
    }

    return baseData
  }, [t, totalClientsEntries, mauCount, tokenCount, lock, classes.summaryIcon])

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
        value: formatDate(license.validityPeriod),
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

  const statusDetails = useMemo(
    () => [
      {
        label: 'menus.oauthserver',
        status: serverStatus,
        key: 'status',
      },
      {
        label: 'dashboard.config_api',
        status: serverStatus,
        key: 'jans-config-api',
      },
      { label: 'dashboard.database_status', status: dbStatus, key: 'db_status' },
      { label: 'FIDO', status: serverStatus, key: 'jans-fido2' },
      { label: 'CASA', status: serverStatus, key: 'jans-casa' },
      { label: 'dashboard.key_cloak', status: serverStatus, key: 'keycloak' },
      { label: 'SCIM', status: false, key: 'jans-scim' },
      { label: 'dashboard.jans_lock', status: serverStatus, key: 'jans-lock' },
    ],
    [serverStatus, dbStatus],
  )

  const getStatusValue = useCallback(
    (key: string) => {
      if (key === 'db_status') return dbStatus
      if (key === 'status') return serverStatus
      return serverHealth[key]
    },
    [serverHealth, dbStatus, serverStatus],
  )

  const getClassName = useCallback(
    (key: string) => {
      const value = getStatusValue(key)
      return isUp(value) ? classes.checkText : classes.crossText
    },
    [getStatusValue, isUp, classes.checkText, classes.crossText],
  )

  const getStatusText = useCallback(
    (key: string) => {
      const value = getStatusValue(key)
      return isUp(value) ? 'Running' : 'Down'
    },
    [getStatusValue, isUp],
  )

  const getStatusIcon = useCallback(
    (key: string) => {
      const value = getStatusValue(key)
      return isUp(value) ? CheckIcon : CrossIcon
    },
    [getStatusValue, isUp],
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
        } as any),
      )
    } else {
      navigate('/logout')
    }
  }, [access_token, dispatch, navigate])

  const showModal = useMemo(() => {
    const shouldShowModal = !isUserInfoFetched && (!access_token || !hasViewPermissions)

    if (shouldShowModal) {
      return <GluuPermissionModal handler={handleLogout} isOpen={true} />
    }

    return null
  }, [isUserInfoFetched, access_token, hasViewPermissions, handleLogout])

  const isBlocking = useMemo(() => {
    return loading || cedarIsInitializing || (!cedarInitialized && !permissions)
  }, [loading, cedarIsInitializing, cedarInitialized, permissions])

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
                    <DateRange />
                  </Grid>
                  <Grid xs={11} item className={classes.desktopChartStyle}>
                    <DashboardChart />
                  </Grid>
                </Grid>
              ) : (
                <Grid container className={classes.whiteBg + ' ' + classes.flex}>
                  <Grid md={9} xs={12} item className={classes.desktopChartStyle}>
                    <DashboardChart />
                  </Grid>
                  <Grid md={3} xs={6} item>
                    <div style={{ fontSize: 'large' }}>{t('dashboard.select_date_range')}</div>
                    <DateRange />
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
