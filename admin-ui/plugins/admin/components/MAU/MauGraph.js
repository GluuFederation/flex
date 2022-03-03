import React, { useState, useEffect } from 'react'
import { subMonths } from 'date-fns'
import moment from 'moment'
import CustomPieGraph from '../../../../app/routes/Dashboards/Grapths/CustomPieGraph'
import ActiveUsersGraph from '../../../../app/routes/Dashboards/Grapths/ActiveUsersGraph'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import GluuLoader from '../../../../app/routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from '../../../../app/routes/Apps/Gluu/GluuViewWrapper'
import { getMau } from '../../../../app/redux/actions/MauActions'
import { getClients } from '../../../../app/redux/actions/InitActions'
import applicationstyle from '../../../../app/routes/Apps/Gluu/styles/applicationstyle'
import GluuLabel from '../../../../app/routes/Apps/Gluu/GluuLabel'
import GluuRibbon from '../../../../app/routes/Apps/Gluu/GluuRibbon'
import {
  Button,
  Card,
  CardFooter,
  CardBody,
  FormGroup,
  Col,
  Row,
} from '../../../../app/components'
import {
  hasBoth,
  buildPayload,
  STAT_READ,
  STAT_JANS_READ,
} from '../../../../app/utils/PermChecker'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'

function MauGraph({ statData, permissions, clients, loading, dispatch }) {
  const { t } = useTranslation()
  const [startDate, setStartDate] = useState(subMonths(new Date(), 3))
  const [endDate, setEndDate] = useState(new Date())
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

  function search() {
    options['month'] = getFormattedMonth()
    buildPayload(userAction, 'GET MAU', options)
    dispatch(getMau(userAction))
  }

  function doDataAugmentation(input) {
    let stat = input
    if (stat && stat.length >= 1) {
      let flattendStat = stat.map((entry) => entry['month'])
      let aRange = generateDateRange(moment(startDate), moment(endDate))
      console.log(moment(startDate).format())
      console.log(moment(endDate).format())
      for (const ele of aRange) {
        const currentMonth = getYearMonth(new Date(ele))
        if (flattendStat.indexOf(parseInt(currentMonth, 10)) === -1) {
          let newEntry = new Object()
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
  function getFormattedMonth() {
    return getYearMonth(startDate) + '%' + getYearMonth(endDate)
  }
  function getMonth(aDate) {
    let value = String(aDate.getMonth() + 1)
    if (value.length > 1) {
      return value
    } else {
      return '0' + value
    }
  }

  function generateDateRange(start, end) {
    var result = []
    while (start.isBefore(end)) {
      result.push(start.format('YYYY-MM-01'))
      start.add(1, 'month')
    }
    return result
  }

  const CustomButton = React.forwardRef(({ value, onClick }, ref) => (
    <Button
      color="primary"
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
        <Card>
          <GluuRibbon title={t('fields.monthly_active_users')} fromLeft />
          <FormGroup row />
          <FormGroup row />
          <FormGroup row />
          <FormGroup row />
          <FormGroup row />
          <FormGroup row />

          <CardBody>
            <Row>
              <Col sm={2}></Col>
              <Col sm={10}>
                <GluuLabel label="Select a date range" size="4" />
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  isClearable
                  startDate={startDate}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  endDate={endDate}
                  customInput={<CustomButton />}
                />
                &nbsp;&nbsp;
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  isClearable
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  minDate={startDate}
                  maxDate={new Date()}
                  customInput={<CustomButton />}
                />
                &nbsp;&nbsp;
                <Button
                  style={applicationstyle.customButtonStyle}
                  color="primary"
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
