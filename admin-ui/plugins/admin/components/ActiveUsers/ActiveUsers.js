import React, { useState, useEffect } from 'react'
import { addMonths, subMonths } from 'date-fns'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import GluuLoader from '../../../../app/routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from '../../../../app/routes/Apps/Gluu/GluuViewWrapper'
import { getMau } from './../../redux/actions/MauActions'
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
} from '../../../../app/components'
import {
  hasBoth,
  buildPayload,
  STAT_READ,
  STAT_JANS_READ,
} from '../../../../app/utils/PermChecker'
import {
  LineChart,
  XAxis,
  YAxis,
  Line,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'

function ActiveUsers({ statData, permissions, loading, dispatch }) {
  const { t } = useTranslation()
  const [startDate, setStartDate] = useState(subMonths(new Date(), 2))
  const [endDate, setEndDate] = useState(addMonths(new Date(), 2))
  const userAction = {}
  const options = {}
  useEffect(() => {
    search()
  }, [])

  function search() {
    options['month'] = getFormattedMonth()
    buildPayload(userAction, 'GET MAU', options)
    dispatch(getMau(userAction))
  }

  function completeData(theData) {
    let stat = theData
    if (stat && stat.length >= 1) {
      let flattendStat = stat.map((entry) => entry['month'])
      let aRange = generateDateRange(moment(startDate), moment(endDate))
      for (const ele of aRange) {
        const currentMonth = getYearMonth(new Date(ele))
        if (flattendStat.indexOf(parseInt(currentMonth, 10)) === -1) {
          let newEntry = new Object()
          newEntry['month'] = getYearMonth(new Date(ele))
          newEntry['mau'] = 0
          newEntry['cc_at'] = 0
          newEntry['ac_at'] = 0
          newEntry['ac_id'] = 0
          stat.push(newEntry)
        }
      }
      return Array.from(new Set(stat)).sort(
        (a, b) => parseInt(a, 10) - parseInt(b, 10),
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
          <GluuRibbon title={t('titles.active_users')} fromLeft />
          <FormGroup row />
          <FormGroup row />
          <FormGroup row />
          <CardBody>
            <FormGroup row>
              <Col sm={4}> </Col>
              <Col sm={4}>
                <GluuLabel label="Start" />
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  isClearable
                  startDate={startDate}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  endDate={endDate}
                  placeholderText="Select the starting month"
                  customInput={<CustomButton />}
                />
              </Col>
              <Col sm={4}>
                <GluuLabel label="End" />
                <DatePicker
                  style={{ width: '100%' }}
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
                  placeholderText="Select the end month"
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <ResponsiveContainer className="mau" width="80%" height={350}>
                <LineChart height={400} data={completeData(statData)}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                  <Line
                    name={t('fields.monthly_active_users')}
                    type="monotone"
                    dataKey="mau"
                    stroke="#8884d8"
                  />
                  <Tooltip />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            </FormGroup>
            <FormGroup row>
              <ResponsiveContainer className="bar" width="80%" height={350}>
                <LineChart
                  width={400}
                  height={300}
                  data={completeData(statData)}
                >
                  <XAxis dataKey="month" />
                  <YAxis />
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                  <Line
                    name="Client credentials access token"
                    type="monotone"
                    dataKey="cc_at"
                    stroke="#8884d8"
                  />
                  <Line
                    name="Authorization code access token"
                    type="monotone"
                    dataKey="ac_at"
                    stroke="#82ca9d"
                  />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
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
    permissions: state.authReducer.permissions,
  }
}
export default connect(mapStateToProps)(ActiveUsers)
