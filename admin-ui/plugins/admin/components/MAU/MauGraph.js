import React, { useState, useEffect, useContext } from 'react'
import { subMonths } from 'date-fns'
import moment from 'moment'
import ActiveUsersGraph from 'Routes/Dashboards/Grapths/ActiveUsersGraph'
import Grid from '@mui/material/Grid'
import 'react-datepicker/dist/react-datepicker.css'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { getMau } from 'Redux/actions/MauActions'
import { getClients } from 'Redux/actions/InitActions'
import applicationstyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import {
  Button,
  Card,
  CardFooter,
  CardBody,
  FormGroup,
  Col,
  Row,
} from 'Components'
import {
  hasBoth,
  buildPayload,
  STAT_READ,
  STAT_JANS_READ,
} from 'Utils/PermChecker'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import SetTitle from 'Utils/SetTitle'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { ThemeContext } from 'Context/theme/themeContext'
import dayjs from 'dayjs'

function MauGraph({ statData, permissions, clients, loading, dispatch }) {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const [startDate, setStartDate] = useState(dayjs().subtract(3, "months"))
  const [endDate, setEndDate] = useState(dayjs())
  const userAction = {}
  const options = {}
  useEffect(() => {
    let count = 0
    const interval = setInterval(() => {
      if (statData.length === 0 && count < 2) {
        search()
      }
      if (clients.length === 0 && count < 2) {
        buildPayload(userAction, 'Fetch openid connect clients', {})
        dispatch(getClients(userAction))
      }
      count++
    }, 1000)
    return () => clearInterval(interval)
  }, [1000])
  SetTitle(t('fields.monthly_active_users'))

  function search() {
    // options['month'] = getFormattedMonth()
    options['startMonth'] = getYearMonth(startDate.toDate())
    options['endMonth'] = getYearMonth(endDate.toDate())
    buildPayload(userAction, 'GET MAU', options)
    dispatch(getMau(userAction))
  }

  function doDataAugmentation(input) {
    const stat = input
    if (stat && stat.length >= 1) {
      const flattendStat = stat.map((entry) => entry['month'])
      const aRange = generateDateRange(startDate.toDate(), endDate.toDate())
      for (const ele of aRange) {
        const currentMonth = getYearMonth(new Date(ele))
        if (flattendStat.indexOf(parseInt(currentMonth, 10)) === -1) {
          const newEntry = new Object()
          newEntry['month'] = parseInt(getYearMonth(new Date(ele)), 10)
          newEntry['mau'] = 0
          newEntry['client_credentials_access_token_count'] = 0
          newEntry['authz_code_access_token_count'] = 0
          newEntry['authz_code_idtoken_count'] = 0
          stat.push(newEntry)
        }
      }
      return Array.from(new Set(stat)).sort(
        (a, b) => parseInt(a.month, 10) - parseInt(b.month, 10),
      )
    }
    return stat
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

  function generateDateRange(startDate, endDate) {
    const start = moment(startDate)
    const end = moment(endDate)
    const result = []
    while (end > start || start.format('M') === end.format('M')) {
      result.push(start.format('YYYY-MM') + '-01')
      start.add(1, 'month')
    }
    return result
  }

  const CustomButton = React.forwardRef(({ value, onClick }, ref) => (
    <Button
      color={`primary-${selectedTheme}`}
      outline
      style={applicationstyle.customButtonStyle}
      className="example-custom-input"
      onClick={onClick}
      ref={ref}
    >
      {value}
    </Button>
  ))

  return (
    <GluuLoader blocking={loading}>
      <GluuViewWrapper
        canShow={hasBoth(permissions, STAT_READ, STAT_JANS_READ)}
      >
        <Card style={applicationStyle.mainCard}>
          <CardBody>
            <Row>
              <Col sm={5}>
                <GluuLabel label={t('fields.select_date_range')} size="4" style={{ minWidth: '200px' }} />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Grid container gap={2} justifyContent="space-around">
                    <DatePicker
                      format="MM/DD/YYYY"
                      id="date-picker-inline"
                      label={t('dashboard.start_date')}
                      value={startDate}
                      onChange={(date) => setStartDate(date)}
                    />
                    <DatePicker
                      format="MM/DD/YYYY"
                      id="date-picker-inline"
                      label={t('dashboard.end_date')}
                      value={endDate}
                      onChange={(date) => setEndDate(date)}
                    />
                  </Grid>
                </LocalizationProvider>
              </Col>
              <Col sm={2}>
                <Button
                  style={{ position: 'relative', top: '55px', ...applicationstyle.customButtonStyle }}
                  color={`primary-${selectedTheme}`}
                  onClick={search}
                >
                  <i className="fa fa-search mr-2"></i>
                  {t('actions.view')}
                </Button>
              </Col>
            </Row>
            <FormGroup row />
            <FormGroup row />
            <FormGroup row>
              <Col sm={12}>
                <ActiveUsersGraph data={doDataAugmentation(statData)} />
              </Col>
            </FormGroup>
          </CardBody>
          <CardFooter className="p-4 bt-0"></CardFooter>
        </Card>
      </GluuViewWrapper>
    </GluuLoader>
  )
}

const mapStateToProps = (state) => {
  return {
    statData: state.mauReducer.stat,
    loading: state.mauReducer.loading,
    clients: state.initReducer.clients,
    permissions: state.authReducer.permissions,
  }
}

export default connect(mapStateToProps)(MauGraph)
