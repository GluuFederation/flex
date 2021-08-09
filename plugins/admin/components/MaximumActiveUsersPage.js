import React, { useState, useEffect } from 'react'
import {
  Button,
  Card,
  CardFooter,
  CardBody,
  Col,
  FormGroup,
  InputGroup,
  Container,
  CustomInput,
} from '../../../app/components'
import GluuLoader from '../../../app/routes/Apps/Gluu/GluuLoader'
import {
  LineChart,
  Line,
  Legend,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import {
  hasPermission,
  buildPayload,
  CLIENT_WRITE,
  CLIENT_READ,
  CLIENT_DELETE,
} from '../../../app/utils/PermChecker'
import { getMau } from './../redux/actions/MauActions'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'

function MaximumActiveUsersPage({ stat, permissions, loading, dispatch }) {
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
  useEffect(() => {
    options['month'] = currentMonth
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

  function getStartDate() {
    var fromYear = document.getElementById(FROM_YEAR_ID).value
    var fromMonth = document.getElementById(FROM_MONTH_ID).value
    console.log('======FROM: ' + fromYear + fromMonth)
  }
  function getEndDate() {
    var toYear = document.getElementById(TO_YEAR_ID).value
    var toMonth = document.getElementById(TO_MONTH_ID).value
    console.log('======TO: ' + toYear + toMonth)
  }
  const { t } = useTranslation()
  console.log('========================= ' + JSON.stringify(stat))
  const data = [
    {
      name: '19-07-2021',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: '20-07-2021',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: '21-07-2021',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: '22-07-2021',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: '23-07-2021',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: '24-07-2021',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: '25-07-2021',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ]

  return (
    <GluuLoader blocking={loading}>
      <ResponsiveContainer>
        <Card>
          <CardBody
            className="d-flex justify-content-center pt-5"
            style={{ minHeight: '400px' }}
          >
            <Container>
              <FormGroup
                row
                style={{ marginLeft: '20px', marginBottom: '20px' }}
              >
                <InputGroup style={{ width: '100px' }} onChange={getStartDate}>
                  <CustomInput label="From" type="select" id={FROM_YEAR_ID}>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                  </CustomInput>
                </InputGroup>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;</div>
                <InputGroup style={{ width: '100px' }} onChange={getStartDate}>
                  <CustomInput label="From" type="select" id={FROM_MONTH_ID}>
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
                </InputGroup>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                <InputGroup style={{ width: '100px' }} onChange={getEndDate}>
                  <CustomInput label="From" type="select" id={TO_YEAR_ID}>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                  </CustomInput>
                </InputGroup>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;</div>
                <InputGroup style={{ width: '100px' }} onChange={getEndDate}>
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
                </InputGroup>
                <Col>
                  <Button
                    color="primary"
                    type="button"
                    onClick={getCurrentYearStat}
                  >
                    <i className="fa fa-bell mr-2"></i>
                    {t('Current year')}
                  </Button>
                  {'  '}
                  <Button
                    color="primary"
                    type="button"
                    onClick={getCurrentMonthStat}
                  >
                    <i className="fa fa-asterisk mr-2"></i>
                    {t('Current month')}
                  </Button>
                </Col>
              </FormGroup>
              <FormGroup row>
                <LineChart
                  width={900}
                  height={400}
                  data={data}
                  margin={{
                    top: 5,
                    right: 5,
                    left: 5,
                    bottom: 5,
                  }}
                >
                  <XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="uv"
                    stroke="#870000"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pv"
                    stroke="#03a96d"
                    activeDot={{ r: 8 }}
                  />
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                </LineChart>
              </FormGroup>
            </Container>
          </CardBody>
          <CardFooter className="p-4 bt-0"></CardFooter>
        </Card>
      </ResponsiveContainer>
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
