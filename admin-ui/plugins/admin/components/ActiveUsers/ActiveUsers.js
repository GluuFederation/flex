import React, { useState, useEffect } from 'react'
import { addMonths, subMonths, addDays } from 'date-fns'
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

function ActiveUsers({ stat, permissions, loading, dispatch }) {
  console.log('==========================Stat ' + JSON.stringify(stat))
  const { t } = useTranslation()
  const [startDate, setStartDate] = useState(subMonths(new Date(), 2))
  const [endDate, setEndDate] = useState(addMonths(new Date(), 2))
  const userAction = {}
  const options = {}
  useEffect(() => {
    options['month'] = getMonths()
    buildPayload(userAction, 'GET MAU', options)
    dispatch(getMau(userAction))
  }, [])
  function search() {
    options['month'] = getMonths()
    buildPayload(userAction, 'GET MAU', options)
    dispatch(getMau(userAction))
  }
  function getMonths() {
    let month =
      startDate.getFullYear() +
      getMonth(startDate) +
      '%' +
      endDate.getFullYear() +
      getMonth(endDate)

    return month
  }
  function getMonth(startDate) {
    let value = String(startDate.getMonth() + 1)
    if (value.length > 1) {
      return value
    } else {
      return '0' + value
    }
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
              <div style={{ width: '100%', height: 300, background: 'white' }}>
                <ResponsiveContainer>
                  <LineChart height={300} data={Object.values(stat)}>
                    <Line
                      name={t('fields.monthly_active_users')}
                      type="monotone"
                      dataKey="monthly_active_users"
                      stroke="#8884d8"
                    />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis
                      dataKey="month"
                      tickFormatter={(tickItem) => {
                        return (
                          (tickItem % 100) + '/' + Math.floor(tickItem / 100)
                        )
                      }}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                  </LineChart>
                </ResponsiveContainer>
              </div>
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
    stat: state.mauReducer.stat,
    loading: state.mauReducer.loading,
    permissions: state.authReducer.permissions,
  }
}
export default connect(mapStateToProps)(ActiveUsers)
