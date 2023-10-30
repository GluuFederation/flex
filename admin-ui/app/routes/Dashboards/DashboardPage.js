import React, { useState, useEffect, useMemo } from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import { useMediaQuery } from 'react-responsive'
import GluuLoader from '../Apps/Gluu/GluuLoader'
import GluuViewWrapper from '../Apps/Gluu/GluuViewWrapper'
import { getClients } from 'Redux/features/initSlice'
import {
  hasBoth,
  buildPayload,
  STAT_READ,
  STAT_JANS_READ,
} from 'Utils/PermChecker'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getLicenseDetails } from 'Redux/features/licenseDetailsSlice'
import { getHealthStatus } from 'Redux/features/healthSlice'
import DashboardChart from './Chart/DashboardChart'
import DateRange from './DateRange'
import CheckIcon from '../../images/svg/check.svg'
import CrossIcon from '../../images/svg/cross.svg'
import SetTitle from 'Utils/SetTitle'
import styles from './styles'

function DashboardPage() {
  const { t } = useTranslation()
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  const breakDashboardCard = useMediaQuery({ query: '(max-width: 1424px)' })
  const isMobile = useMediaQuery({ maxWidth: 767 })
  const userAction = {}
  const options = {}
  const { classes } = styles()
  const FETCHING_LICENSE_DETAILS = 'Fetch license details'
  const [mauCount, setMauCount] = useState(null)
  const [tokenCount, setTokenCount] = useState(null)

  const statData = useSelector(state => state.mauReducer.stat)
  const loading = useSelector(state => state.mauReducer.loading)
  const clients = useSelector(state => state.initReducer.clients)
  const totalClientsEntries = useSelector(state => state.initReducer.totalClientsEntries)
  const license = useSelector(state => state.licenseDetailsReducer.item)
  const serverStatus = useSelector(state => state.healthReducer.serverStatus)
  const dbStatus = useSelector(state => state.healthReducer.dbStatus)
  const permissions = useSelector(state => state.authReducer.permissions)

  const dispatch = useDispatch()

  SetTitle(t('menus.dashboard'))

  useEffect(() => {
    const date = new Date()
    const currentYear = date.getFullYear()
    const currentMonth = date.getMonth() + 1
    const formattedMonth = currentMonth > 9 ? currentMonth : `0${currentMonth}`
    const yearMonth = `${currentYear}${formattedMonth}`
    const currentMonthData = statData.find(
      ({ month }) => month.toString() === yearMonth,
    )

    const mau = currentMonthData?.mau
    const token =
      currentMonthData?.authz_code_access_token_count +
      currentMonthData?.client_credentials_access_token_count
    if (mau) {
      setMauCount(mau)
    }
    if (token) {
      setTokenCount(token)
    }
  }, [statData])

  useEffect(() => {
    let count = 0
    const interval = () => {
      setTimeout(() => {
        if (clients.length === 0 && count < 1) {
          buildPayload(userAction, 'Fetch openid connect clients', {})
          dispatch(getClients({ action: userAction }))
        }
        if (Object.keys(license).length === 0 && count < 1) {
          getLicense()
        }
        if (count < 1) {
          getServerStatus()
          interval()
        }
        count++
      }, 1000)
    }
    interval()
    return () => {}
  }, [])

  function getLicense() {
    buildPayload(userAction, FETCHING_LICENSE_DETAILS, options)
    dispatch(getLicenseDetails({}))
  }

  function isUp(status) {
    if (status) {
      return (
        status.toUpperCase() === 'ONLINE'.toUpperCase() ||
        status.toUpperCase() === 'RUNNING'.toUpperCase()
      )
    }
    return false
  }

  function getServerStatus() {
    buildPayload(userAction, 'GET Health Status', options)
    dispatch(getHealthStatus({ action: userAction }))
  }


  const summaryData = [
    {
      text: t('dashboard.oidc_clients_count'),
      value: totalClientsEntries,
    },
    {
      text: t('dashboard.active_users_count'),
      value: mauCount,
    },
    {
      text: t('dashboard.token_issued_count'),
      value: tokenCount,
    },
  ]

  const userInfo = [
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
      value: `${license?.customerFirstName || ''} ${license?.customerLastName || ''}`,
    },
    {
      text: t('dashboard.license_status'),
      value: license?.licenseActive ? 'active' : 'inactive',
      key: 'License Status'
    },
  ]

  const StatusCard = useMemo(() => {
    return (
      <Grid xs={12} item>
        <Paper className={`${classes.statusContainer}`} elevation={3}>
          <div className={classes.userInfoText}>
            <div className={classes.statusText}>
              <Box display="flex" justifyContent="flex-start">
                <span>{t('dashboard.oauth_server_status')}</span>
                <span>
                  <img
                    src={isUp(serverStatus) ? CheckIcon : CrossIcon}
                    className={
                      isUp(serverStatus) ? classes.iconCheck : classes.iconCross
                    }
                    alt="oauth server"
                  />
                </span>
              </Box>
              <Box display="flex" justifyContent="flex-end">
                <span className={classes.checkText}>
                  <span
                    className={
                      isUp(serverStatus) ? classes.checkText : classes.crossText
                    }
                  >
                    {isUp(serverStatus) ? 'Running' : 'Down'}
                  </span>
                </span>
              </Box>
            </div>
            <div className={classes.statusText}>
              <Box display="flex" justifyContent="flex-start">
                <span>{t('dashboard.database_status')}</span>
                <span>
                  <img
                    src={isUp(dbStatus) ? CheckIcon : CrossIcon}
                    className={
                      isUp(dbStatus) ? classes.iconCheck : classes.iconCross
                    }
                    alt="database"
                  />
                </span>
              </Box>
              <Box display="flex" justifyContent="flex-end">
                <span
                  className={
                    isUp(dbStatus) ? classes.checkText : classes.crossText
                  }
                >
                  {isUp(dbStatus) ? 'Online' : 'Offline'}
                </span>
              </Box>
            </div>
            <div className={classes.statusText}>
              <Box display="flex" justifyContent="flex-start">
                <span>{t('dashboard.server_status')}</span>
                <span>
                  <img
                    src={isUp(serverStatus) ? CheckIcon : CrossIcon}
                    className={
                      isUp(serverStatus) ? classes.iconCheck : classes.iconCross
                    }
                    alt="server"
                  />
                </span>
              </Box>
              <Box display="flex" justifyContent="flex-end">
                <span
                  className={
                    isUp(serverStatus) ? classes.checkText : classes.crossText
                  }
                >
                  {isUp(serverStatus) ? 'Online' : 'Offline'}
                </span>
              </Box>
            </div>
          </div>
        </Paper>
      </Grid>
    )
  }, [serverStatus, dbStatus])

  return (
    <GluuLoader blocking={loading}>
      <GluuViewWrapper
        canShow={hasBoth(permissions, STAT_READ, STAT_JANS_READ)}
      >
        <div className={classes.root}>
          <Grid spacing={{ sm: '20px', md: '40px' }} container className="px-40">
            <Grid item lg={breakDashboardCard ? 12 : 4} md={12}>
              <h3 className="txt-white">{t('dashboard.summary_title')}</h3>
              <div className="mt-20">
                {summaryData.map((data, key) => (
                  <Paper key={key} className={classes.summary}>
                    <div className={classes.summaryText}>{data.text}</div>
                    <div className={classes.summaryValue}>{data.value}</div>
                  </Paper>
                ))}
              </div>
            </Grid>
            <Grid
              item
              lg={breakDashboardCard ? 6 : 4}
              md={6}
              xs={12}
              style={{ width: '100%' }}
            >
              <Paper
                className={`${classes.dashboardCard} top-minus-40`}
                elevation={0}
                spacing={2}
              >
                <Grid className={classes.flex} container>
                  <Grid item xs={12} className={isMobile ? 'mt-20' : ''}>
                    <Paper
                      className={classes.userInfo}
                      style={
                        isTabletOrMobile || breakDashboardCard
                          ? { marginLeft: 0 }
                          : {}
                      }
                      elevation={3}
                    >
                      <div className={classes.userInfoTitle}>
                        {t('dashboard.user_info')}
                      </div>
                      <div>
                        {userInfo.map((info, key) => (
                          <div className={classes.userInfoText} key={key}>
                            {info.text}:{' '}
                            {info?.key === 'License Status' ? (
                              <span
                                className={
                                  info.value === 'active'
                                    ? classes.greenBlock
                                    : classes.redBlock
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
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid
              item
              lg={breakDashboardCard ? 6 : 4}
              md={6}
              xs={12}
              style={{ width: '100%' }}
            >
              {StatusCard}
            </Grid>
          </Grid>
          <Grid container className={`px-40`}>
            <Grid lg={12} xs={12} item>
              <h3 className="text-white">
                {t('dashboard.access_tokens_graph')}
              </h3>
              {isTabletOrMobile ? (
                <Grid container className={`${classes.whiteBg}`}>
                  <Grid
                    xs={12}
                    item
                    style={
                      isTabletOrMobile
                        ? { marginLeft: 40 }
                        : { marginLeft: 40, marginBottom: 40 }
                    }
                  >
                    <div>{t('dashboard.select_date_range')}</div>
                    <DateRange />
                  </Grid>
                  <Grid
                    xs={11}
                    item
                    className={classes.desktopChartStyle}
                  >
                    <DashboardChart />
                  </Grid>
                </Grid>
              ) : (
                <Grid
                  container
                  className={`${classes.whiteBg} ${classes.flex}`}
                >
                  <Grid
                    md={9}
                    xs={12}
                    item
                    className={classes.desktopChartStyle}
                  >
                    <DashboardChart />
                  </Grid>
                  <Grid md={3} xs={6} item>
                    <div>{t('dashboard.select_date_range')}</div>
                    <DateRange />
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid container className={`${classes.flex} px-40`}>
            <Grid xs={12} item>
              <Grid
                xs={12}
                item
                className={`${isMobile ? classes.block : classes.flex} mt-20`}
              >
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
                  <li className={classes.lightGreen}>
                    {t('dashboard.authorization_code_id_token')}
                  </li>
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
