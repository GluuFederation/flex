import React, { useState, useEffect } from 'react'
import {
  Card,
  CardFooter,
  CardBody,
  CustomInput,
} from '../../../app/components'
import GluuLoader from '../../../app/routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from '../../../app/routes/Apps/Gluu/GluuViewWrapper'
import {
  LineChart,
  XAxis,
  YAxis,
  Line,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  hasBoth,
  buildPayload,
  STAT_READ,
  STAT_JANS_READ,
} from '../../../app/utils/PermChecker'
import { getMau } from './../redux/actions/MauActions'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'

function MaximumActiveUsersPage({ stat, permissions, loading, dispatch }) {
  console.log('========Data recieved ' + JSON.stringify(stat))
  const { t } = useTranslation()
  const userAction = {}
  const FROM_YEAR_ID = 'FROM_YEAR_ID'
  const FROM_MONTH_ID = 'FROM_MONTH_ID'
  const TO_YEAR_ID = 'TO_YEAR_ID'
  const TO_MONTH_ID = 'TO_MONTH_ID'
  const options = {}
  const currentDate = new Date()
  const currentMonth =
    currentDate.getFullYear() +
    String(currentDate.getMonth() + 1).padStart(2, '0')
  const [startDate, setStartDate] = useState('202101')
  const [endDate, setEndDate] = useState('202101')

  useEffect(() => {
    options['month'] = '202109'
    buildPayload(userAction, 'GET MAU', options)
    dispatch(getMau(userAction))
  }, [])
  function getCurrentMonthStat() {
    options['month'] = currentMonth
    buildPayload(userAction, 'GET CURRENT MONTH MAU', options)
    dispatch(getMau(userAction))
  }
  function getCurrentYearStat() {
    const year = currentDate.getFullYear()
    options['month'] = String(year) + '01%' + String(year) + '12'
    buildPayload(userAction, 'GET CURENT YEAR MAU', options)
    dispatch(getMau(userAction))
  }
  function search() {
    options['month'] = startDate + String('%') + endDate
    buildPayload(userAction, 'GET CURENT YEAR MAU', options)
    dispatch(getMau(userAction))
  }
  function getStartDate() {
    setStartDate(
      document.getElementById(FROM_YEAR_ID).value +
        document.getElementById(FROM_MONTH_ID).value,
    )
  }

  function getEndDate() {
    setEndDate(
      document.getElementById(TO_YEAR_ID).value +
        document.getElementById(TO_MONTH_ID).value,
    )
  }

  
  const MonthsComponent = (
    <CustomInput type="select" label="To" id={TO_MONTH_ID}>
      <option value="01">January</option>
      <option value="02">February</option>
      <option value="03">March</option>
      <option value="04">April</option>
      <option value="05">May</option>
      <option value="06">June</option>
      <option value="07">July</option>
      <option value="08">August</option>
      <option value="09">September</option>
      <option value="10">October</option>
      <option value="11">November</option>
      <option value="12">December</option>
    </CustomInput>
  )
  return (
    <GluuLoader blocking={loading}>
      <GluuViewWrapper
        canShow={hasBoth(permissions, STAT_READ, STAT_JANS_READ)}
      >
        <ResponsiveContainer>
          <Card>
            <CardBody
              className="d-flex justify-content-center pt-5"
              style={{ minHeight: '400px' }}
            >
              <ResponsiveContainer width="60%" height={300}>
                <LineChart width={600} height={300} data={stat} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <Line type="monotone" dataKey="monthly_active_users" stroke="#8884d8" />
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </CardBody>
            <CardFooter className="p-4 bt-0"></CardFooter>
          </Card>
        </ResponsiveContainer>
      </GluuViewWrapper>
    </GluuLoader>
  )
}

const mapStateToProps = (state) => {
  return {
    stat: state.mauReducer.stat,
    loading: state.oidcReducer.loading,
    permissions: state.authReducer.permissions,
  }
}
export default connect(mapStateToProps)(MaximumActiveUsersPage)
