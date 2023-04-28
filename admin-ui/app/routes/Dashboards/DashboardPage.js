import React, { useState, useEffect, useContext } from 'react'
import { subMonths } from 'date-fns'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import { useMediaQuery } from 'react-responsive'
import 'react-datepicker/dist/react-datepicker.css'
import GluuLoader from '../Apps/Gluu/GluuLoader'
import GluuViewWrapper from '../Apps/Gluu/GluuViewWrapper'
import { getMau } from 'Redux/actions/MauActions'
import { getClients } from 'Redux/actions/InitActions'
import {
  hasBoth,
  buildPayload,
  STAT_READ,
  STAT_JANS_READ,
} from 'Utils/PermChecker'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { getLicenseDetails } from 'Redux/actions/LicenseDetailsActions'
import { getHealthStatus } from 'Redux/actions/HealthAction'
import DashboardChart from './Chart/DashboardChart'
import DateRange from './DateRange'
import CheckIcon from '../../images/svg/check.svg'
import CrossIcon from '../../images/svg/cross.svg'
import Logo from '../../images/gluu-white-logo.png'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import SetTitle from 'Utils/SetTitle'
import styles from './styles'

function DashboardPage({
  statData,
  permissions,
  clients,
  license,
  serverStatus,
  dbStatus,
  loading,
  users,
  totalClientsEntries,
  dispatch,
}) {
  const { t } = useTranslation()
  const [startDate] = useState(subMonths(new Date(), 3))
  const [endDate] = useState(new Date())
  const [mobileChartStyle, setMobileChartStyle] = useState({})
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  const breakDashboardCard = useMediaQuery({ query: '(max-width: 1424px)' })
  const isMobile = useMediaQuery({ maxWidth: 767 })
  const userAction = {}
  const options = {}
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const { classes } = styles()
  const FETCHING_LICENSE_DETAILS = 'Fetch license details'
  const [mauCount, setMauCount] = useState(null)
  const [tokenCount, setTokenCount] = useState(null)

  SetTitle(t('menus.dashboard'))

  useEffect(() => {
    setMobileChartStyle({
      overflowX: 'scroll',
      overflowY: 'hidden',
      scrollBehavior: 'smooth',
    })
  }, [isMobile])

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
        if (statData.length === 0 && count < 2) {
          search()
        }
        if (clients.length === 0 && count < 2) {
          buildPayload(userAction, 'Fetch openid connect clients', {})
          dispatch(getClients(userAction))
        }
        if (Object.keys(license).length === 0 && count < 2) {
          getLicense()
        }
        if (count < 2) {
          getServerStatus()
          interval()
        }
        count++
      }, 1000)
    }
    interval()
    return () => {}
  }, [1000])

  function search() {
    options['startMonth'] = getYearMonth(startDate)
    options['endMonth'] = getYearMonth(endDate)
    buildPayload(userAction, 'GET MAU', options)
    dispatch(getMau(userAction))
  }

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
    dispatch(getHealthStatus(userAction))
  }

  function getYearMonth(date) {
    return date.getFullYear() + getMonth(date)
  }

  function getMonth(aDate) {
    const value = String(aDate.getMonth() + 1)
    if (value.length > 1) {
      return value
    } else {
      return '0' + value
    }
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
      text: t('dashboard.company_name'),
      value: `${license?.customerFirstName} ${license?.customerLastName}`,
    },
    {
      text: t('dashboard.license_status'),
      value: license?.licenseActive ? 'active' : 'inactive',
    },
  ]

  const StatusCard = () => {
    return (
      <Grid xs={12} item>
        <Paper className={`${classes.statusContainer} ml-20`} elevation={3}>
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
  }

  const SupportCard = () => {
    return (
      <Grid item xs={12} className={classes.supportContainer}>
        <Paper
          className={`${classes.supportCard}`}
          style={{ background: themeColors.dashboard.supportCard }}
        >
          <div style={{ zIndex: 2 }}>
            <img src={Logo} alt="logo" className={classes.supportLogo} />
            <div className="mt-40">Gluu Services</div>
            <div className="mt-40">Community Support</div>
            <div className="mt-40">FAQ</div>
          </div>
        </Paper>
        <Paper
          className={`${classes.verticalTextContainer}`}
          style={{ background: themeColors.dashboard.supportCard }}
        >
          <div
            style={{
              zIndex: 4,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div className={classes.textVertical}>WORLD</div>
            <div className={`${classes.textVertical} text-center`}>WIDE</div>
            <div className={`${classes.textVertical} text-right`}>
              SU<span className={`${classes.redText}`}>PP</span>ORT
            </div>
          </div>
        </Paper>
      </Grid>
    )
  }

  return (
    <GluuLoader blocking={loading}>
      <GluuViewWrapper
        canShow={hasBoth(permissions, STAT_READ, STAT_JANS_READ)}
      >
        <div className={classes.root}>
          <Grid container className="px-40">
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
                            {info.text === 'License Status' ? (
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
              <StatusCard />
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
                    md={9}
                    xs={12}
                    style={isMobile ? mobileChartStyle : {}}
                    item
                  >
                    <div
                      className={
                        isTabletOrMobile
                          ? classes.chartContainerTable
                          : classes.chartContainer
                      }
                    >
                      <DashboardChart />
                    </div>
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
            {/* TODO: Implement support Card later */}
            {/* <Grid
              lg={3}
              item
              xs={isTabletOrMobile ? 5 : 3}
              className={`${classes.bannerContainer} top-minus-40`}
            >
              <SupportCard />
            </Grid>
            {isTabletOrMobile && !isMobile && <StatusCard />} */}
          </Grid>
          <Grid container className={`${classes.flex} px-40`}>
            <Grid xs={12} item>
              <Grid
                xs={12}
                item
                className={`${isMobile ? classes.block : classes.flex} mt-20`}
              >
                {isMobile && <StatusCard />}
                <ul className="mr-40">
                  <li className={classes.orange}>
                    {t('dashboard.client_credentials_access_token')}
                  </li>
                </ul>
                <ul className="mr-40">
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

const mapStateToProps = (state) => {
  return {
    statData: state.mauReducer.stat,
    loading: state.mauReducer.loading,
    clients: state.initReducer.clients,
    totalClientsEntries: state.initReducer.totalClientsEntries,
    license: state.licenseDetailsReducer.item,
    serverStatus: state.healthReducer.serverStatus,
    dbStatus: state.healthReducer.dbStatus,
    permissions: state.authReducer.permissions,
    users: state.userReducer.items,
  }
}

export default connect(mapStateToProps)(DashboardPage)
