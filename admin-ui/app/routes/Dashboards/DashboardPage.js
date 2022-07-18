import React, { useState, useEffect, useContext } from 'react'
import { subMonths } from 'date-fns'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
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
import DashboardTable from './Table/DashboardTable'
import DateRange from './DateRange'
import CheckIcon from '../../images/svg/check.svg'
import CrossIcon from '../../images/svg/cross.svg'
import Logo from '../../images/gluu-white-logo.png'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { getUsers } from '../../redux/actions'
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
  const classes = styles()
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
    const userOptions = {
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
      text: 'OIDC Clients Count',
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
      <Grid xs={12}>
        <Paper
          className={`${classes.statusContainer} ml-20`}
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

  const SupportCard = () => {
    return (
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
    )
  }

  return (
    <GluuLoader blocking={loading}>
      <GluuViewWrapper
        canShow={hasBoth(permissions, STAT_READ, STAT_JANS_READ)}
      >
        <div className={classes.root}>
          <Grid container className="px-40">
            <Grid item lg={4} md={12}>
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
            <Grid item lg={4} md={6} xs={12} style={{ width: '100%' }}>
              <Paper
                className={`${classes.dashboardCard} top-minus-40`}
                elevation={0}
                spacing={2}
              >
                <Grid className={classes.flex} container>
                  <Grid
                    item
                    xs={12}
                    className={isMobile ? 'mt-20' : ''}
                  >
                    <Paper
                      className={classes.userInfo}
                      style={isTabletOrMobile ? { marginLeft: 0 } : {}}
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
            <Grid item lg={4} md={6} xs={12} style={{ width: '100%' }}>
              <StatusCard />
            </Grid>
          </Grid>
          <Grid container className={`px-40`}>
            <Grid lg={12} xs={12}>
              <h3 className="text-white">Access Tokens Graph</h3>
              {isTabletOrMobile ? (
                <Grid container className={`${classes.whiteBg}`}>
                  <Grid
                    xs={12}
                    item
                    style={isTabletOrMobile ? { marginLeft: 40 } : { marginLeft: 40, marginBottom: 40 }}
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
                    <div className={isTabletOrMobile ? classes.chartContainerTable : classes.chartContainer}>
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
            {/* TODO: Implement support Card later */}
            {/* <Grid
              lg={3}
              xs={isTabletOrMobile ? 5 : 3}
              className={`${classes.bannerContainer} top-minus-40`}
            >
              <SupportCard />
            </Grid>
            {isTabletOrMobile && !isMobile && <StatusCard />} */}
          </Grid>
          <Grid container className={`${classes.flex} px-40`}>
            <Grid xs={12}>
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
