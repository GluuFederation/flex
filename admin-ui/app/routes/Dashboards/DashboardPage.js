import React, { useState, useEffect, useContext } from 'react'
import { subMonths } from 'date-fns'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import { useMediaQuery } from 'react-responsive'
import { makeStyles } from '@material-ui/core/styles'
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
import DashboardTable from './Table/DashboardTable'
import DateRange from './DateRange'
import CheckIcon from '../../images/svg/check.svg'
import CrossIcon from '../../images/svg/cross.svg'
import Logo from '../../images/gluu-white-logo.png'
import DetailReport from '../../images/detail-report.png'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { getUsers } from '../../redux/actions'
import SetTitle from 'Utils/SetTitle'

const useStyles = makeStyles(() => ({
  root: {
    color: '#FFFFFF',
    maxWidth: '100vw',
  },
  flex: {
    flexGrow: 1,
    display: 'flex',
  },
  block: {
    display: 'block',
  },
  summary: {
    height: 41,
    maxWidth: 270,
    display: 'flex',
    justifyContent: 'space-between',
    padding: 0,
    border: '3px solid #FFF',
    borderRadius: 10,
    background: 'transparent',
    color: '#FFF',
    alignItems: 'center',
    marginBottom: 24,
  },
  summaryText: {
    paddingLeft: 8,
  },
  summaryValue: {
    background: '#FFF',
    color: '#303641',
    width: 80,
    height: 36,
    fontWeight: 600,
    fontSize: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashboardCard: {
    background: 'transparent',
    marginTop: 40,
  },
  slider: {
    border: '5px solid #fff',
    borderRadius: 24,
    height: 120,
    background: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'center',
    color: '#fff',
    padding: '0px 14px 0px 14px',
  },
  news: {
    borderRadius: 24,
    height: 140,
    background: '#3B6694',
    color: '#FFF',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newsTitle: {
    fontSize: 20,
  },
  logo: {
    width: '40%',
    height: '40%',
    marginBottom: 10,
  },
  reports: {
    borderRadius: 24,
    marginLeft: 20,
    height: 140,
    background: '#FFF',
    color: '#303641',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0 20px',
  },
  reportTitle: {
    fontSize: 20,
  },
  detailReportImg: {
    width: '70%',
    height: '60%',
    marginRight: 10,
  },
  userInfo: {
    borderRadius: 24,
    marginLeft: 20,
    height: 280,
    background: '#FFF',
    color: '#303641',
    display: 'block',
    padding: '20px',
    minWidth: 350,
  },
  userInfoTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 20,
  },
  userInfoText: {
    fontSize: 16,
    marginBottom: 16,
  },
  chartContainer: {
    width: 780,
    maxWidth: '40vw',
    height: 'max-content',
  },
  supportContainer: {
    display: 'flex',
    marginLeft: 20,
  },
  supportCard: {
    borderRadius: 14,
    color: '#FFF',
    padding: 20,
    width: '100%',
    maxWidth: 140,
    display: 'flex',
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    textAlign: 'center',
    fontSize: 20,
  },
  supportLogo: {
    width: '50%',
  },
  verticalTextContainer: {
    borderRadius: 14,
    color: '#FFF',
    padding: '20px 10px',
    width: '100%',
    maxWidth: 140,
    display: 'flex',
    marginRight: 20,
    justifyContent: 'space-between',
    fontSize: 24,
    flexDirection: 'row',
    fontWeight: 700,
    zIndex: 3,
  },
  textVertical: {
    writingMode: 'vertical-rl',
    textOrientation: 'upright',
  },
  statusContainer: {
    borderRadius: 24,
    height: 180,
    minWidth: 320,
    background: '#FFF',
    color: '#303641',
    display: 'block',
    padding: '20px',
  },
  statusText: {
    fontSize: 18,
    marginBottom: 28,
    display: 'flex',
    justifyContent: 'space-between',
  },
  iconCheck: {
    width: 22,
    height: 22,
    marginLeft: 10,
    marginRight: 10,
  },
  iconCross: {
    width: 18,
    height: 18,
    marginLeft: 10,
    marginRight: 10,
  },
  checkText: {
    color: '#26BC26',
  },
  crossText: {
    color: '#F22222',
  },
  orange: {
    color: '#FE9F01',
    fontWeight: 600,
  },
  lightBlue: {
    color: '#9CBEE0',
    fontWeight: 600,
  },
  lightGreen: {
    color: '#8D9460',
    fontWeight: 600,
  },
  whiteBg: {
    background: '#FFF',
    paddingTop: 30,
    paddingBottom: 20,
    color: '#303641',
    borderRadius: 20,
    height: 370,
  },
  redText: {
    color: '#F22222',
  },
  greenBlock: {
    background: '#25C309',
    color: '#FFF',
    borderRadius: 10,
    paddingLeft: 5,
    paddingRight: 5,
  },
  redBlock: {
    background: '#c30909',
    color: '#FFF',
    borderRadius: 10,
    paddingLeft: 5,
    paddingRight: 5,
  },
  bannerContainer: {
    marginTop: 35,
  },
  desktopChartStyle: {
    maxWidth: 760,
    overflowX: 'scroll',
    overflowY: 'hidden',
    scrollBehavior: 'smooth',
  },
}))

function DashboardPage({
  statData,
  permissions,
  clients,
  license,
  serverStatus,
  dbStatus,
  loading,
  users,
  dispatch,
}) {
  const { t } = useTranslation()
  const [startDate, setStartDate] = useState(subMonths(new Date(), 3))
  const [endDate, setEndDate] = useState(new Date())
  const [mobileChartStyle, setMobileChartStyle] = useState({})
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  const isSmallDesktop = useMediaQuery({ query: '(max-width: 1469px)' })
  const isMobile = useMediaQuery({ maxWidth: 767 })
  const userAction = {}
  const options = {}
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const classes = useStyles()
  const FETCHING_LICENSE_DETAILS = 'Fetch license details'

  SetTitle(t('menus.dashboard'))

  useEffect(() => {
    setMobileChartStyle({
      overflowX: 'scroll',
      overflowY: 'hidden',
      scrollBehavior: 'smooth',
    })
  }, [isMobile])

  useEffect(() => {
    let count = 0
    let userOptions = {
      limit: 3,
    }
    const interval = () => {
      setTimeout(() => {
        if (statData.length === 0 && count < 2) {
          search()
        }
        if (clients.length === 0 && count < 2) {
          buildPayload(userAction, 'Fetch openid connect clients', {})
          dispatch(getClients(userAction))
          dispatch(getUsers(userOptions))
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
    options['month'] = getFormattedMonth()
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

  function getFormattedMonth() {
    return getYearMonth(startDate) + '%' + getYearMonth(endDate)
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
      text: 'OIDC Clinets Count',
      value: clients?.length,
    },
    {
      text: 'Active Users Count',
      value: 1,
    },
    {
      text: 'Token Issued Count',
      value: 150,
    },
  ]

  const userInfo = [
    {
      text: 'Product name',
      value: license?.productName,
    },
    {
      text: 'License Type',
      value: license?.licenseType,
    },
    {
      text: 'Customer Email',
      value: license?.customerEmail,
    },
    {
      text: 'Company Name',
      value: `${license?.customerFirstName} ${license?.customerLastName}`,
    },
    {
      text: 'License Status',
      value: license?.licenseActive ? 'active' : 'inactive',
    },
  ]

  const StatusCard = () => {
    return (
      <Grid
        xs={isTabletOrMobile ? (isMobile ? 12 : 6) : isSmallDesktop ? 4 : 3}
      >
        <Paper
          className={`${classes.statusContainer} ${
            !isTabletOrMobile ? 'mt-40 ml-20' : 'mt-20 ml-20'
          }`}
          elevation={3}
        >
          <div className={classes.userInfoText}>
            <div className={classes.statusText}>
              <Box display="flex" justifyContent="flex-start">
                <span>OAuth server status</span>
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
                <span>Database status</span>
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
                <span>Server status</span>
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

  return (
    <GluuLoader blocking={loading}>
      <GluuViewWrapper
        canShow={hasBoth(permissions, STAT_READ, STAT_JANS_READ)}
      >
        <div className={classes.root}>
          <Grid container className="px-40">
            <Grid item lg={5} md={12}>
              <h3 className="txt-white">
                Actives Users &amp; Access Token Stats
              </h3>
              <div className="mt-20">
                {summaryData.map((data, key) => (
                  <Paper key={key} className={classes.summary}>
                    <div className={classes.summaryText}>{data.text}</div>
                    <div className={classes.summaryValue}>{data.value}</div>
                  </Paper>
                ))}
              </div>
            </Grid>
            <Grid item lg={7} md={12} style={{ width: '100%' }}>
              <Paper
                className={`${classes.dashboardCard} top-minus-40`}
                elevation={0}
                spacing={2}
              >
                <Grid className={classes.flex} container>
                  <Grid item md={6} xs={isMobile ? 12 : 6}>
                    <Grid container className={classes.slider}>
                      <Grid item md={6} xs={isMobile ? 12 : 6}>
                        <div>
                          <div>Infinite Scale</div>
                          <div>Complete Privacy</div>
                          <div>Gluu.com</div>
                        </div>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} className={classes.flex}>
                      <Grid item md={4} xs={12} className="mt-20">
                        <Paper
                          className={`${classes.news}`}
                          elevation={3}
                          style={
                            isTabletOrMobile ? { paddingBottom: '10px' } : {}
                          }
                        >
                          <img src={Logo} alt="logo" className={classes.logo} />
                          <div className={classes.newsTitle}>Gluu News</div>
                        </Paper>
                      </Grid>
                      <Grid item md={8} xs={12} className="mt-20">
                        <Paper
                          className={classes.reports}
                          elevation={3}
                          style={
                            isTabletOrMobile
                              ? {
                                  display: 'block',
                                  textAlign: 'center',
                                  paddingBottom: '10px',
                                }
                              : {}
                          }
                        >
                          <img
                            src={DetailReport}
                            alt="report"
                            className={classes.detailReportImg}
                          />
                          <div className={classes.reportTitle}>
                            Detailed Reports
                          </div>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    md={6}
                    xs={isMobile ? 12 : 6}
                    className={isMobile ? 'mt-20' : ''}
                  >
                    <Paper
                      className={classes.userInfo}
                      style={isMobile ? { marginLeft: 0 } : {}}
                      elevation={3}
                    >
                      <div className={classes.userInfoTitle}>User Info</div>
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
          </Grid>
          <Grid container className={`px-40`}>
            <Grid lg={9} xs={12} className="top-minus-40">
              <h3 className="text-white">Access Tokens Graph</h3>
              {isTabletOrMobile ? (
                <Grid container className={`${classes.whiteBg}`}>
                  <Grid
                    xs={12}
                    item
                    style={{ marginLeft: 40, marginBottom: 40 }}
                  >
                    <div>Select a date range</div>
                    <DateRange />
                  </Grid>
                  <Grid
                    md={9}
                    xs={12}
                    style={isMobile ? mobileChartStyle : {}}
                    item
                  >
                    <div className={classes.chartContainer}>
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
                    <div>Select a date range</div>
                    <DateRange />
                  </Grid>
                </Grid>
              )}
            </Grid>
            <Grid
              lg={3}
              xs={isTabletOrMobile ? 5 : 3}
              className={`${classes.bannerContainer} top-minus-40`}
            >
              <Grid item xs={12} className={classes.supportContainer}>
                <Paper
                  className={`${classes.supportCard}`}
                  style={{ background: themeColors.dashboard.supportCard }}
                >
                  <div style={{ zIndex: 2 }}>
                    <img
                      src={Logo}
                      alt="logo"
                      className={classes.supportLogo}
                    />
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
                    <div className={`${classes.textVertical} text-center`}>
                      WIDE
                    </div>
                    <div className={`${classes.textVertical} text-right`}>
                      SU<span className={`${classes.redText}`}>PP</span>ORT
                    </div>
                  </div>
                </Paper>
              </Grid>
            </Grid>
            {isTabletOrMobile && !isMobile && <StatusCard />}
          </Grid>
          <Grid container className={`${classes.flex} px-40 top-minus-40`}>
            <Grid xs={isTabletOrMobile ? 12 : isSmallDesktop ? 8 : 9}>
              <Grid
                xs={12}
                item
                className={`${isMobile ? classes.block : classes.flex} mt-20`}
              >
                {isMobile && <StatusCard />}
                <ul className="mr-40">
                  <li className={classes.orange}>
                    Client credentials access token
                  </li>
                </ul>
                <ul className="mr-40">
                  <li className={classes.lightBlue}>
                    Authorization code access token
                  </li>
                </ul>
                <ul>
                  <li className={classes.lightGreen}>
                    Authorization code ID token
                  </li>
                </ul>
              </Grid>
              <DashboardTable />
            </Grid>
            {!isTabletOrMobile && <StatusCard />}
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
    license: state.licenseDetailsReducer.item,
    serverStatus: state.healthReducer.serverStatus,
    dbStatus: state.healthReducer.dbStatus,
    permissions: state.authReducer.permissions,
    users: state.userReducer.items,
  }
}

export default connect(mapStateToProps)(DashboardPage)
