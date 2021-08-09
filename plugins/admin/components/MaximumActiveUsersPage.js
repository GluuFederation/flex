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
  const options = {}
  const currentDate = new Date()
  const currentMonth =
    currentDate.getFullYear() +
    String(currentDate.getMonth() + 1).padStart(2, '0')
  useEffect(() => {
    options['month'] = currentMonth
    options['format'] = "json"
    buildPayload(userAction, 'GET MAU', options)
    dispatch(getMau(userAction))
  }, [])
  const { t } = useTranslation()
 // console.log('========================= ' + JSON.stringify(currentMonth))
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
                <InputGroup style={{ width: '100px' }}>
                  <CustomInput label="From" type="select" id="fromMonth">
                    <option>2021</option>
                    <option>2020</option>
                    <option>2019</option>
                  </CustomInput>
                </InputGroup>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;</div>
                <InputGroup style={{ width: '100px' }}>
                  <CustomInput label="From" type="select" id="fromMonth">
                    <option>January</option>
                    <option>February</option>
                    <option>March</option>
                    <option>April</option>
                    <option>May</option>
                    <option>June</option>
                    <option>July</option>
                    <option>August</option>
                    <option>September</option>
                    <option>October</option>
                    <option>November</option>
                    <option>December</option>
                  </CustomInput>
                </InputGroup>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                <InputGroup style={{ width: '100px' }}>
                  <CustomInput label="From" type="select" id="fromMonth">
                    <option>2021</option>
                    <option>2020</option>
                    <option>2019</option>
                  </CustomInput>
                </InputGroup>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;</div>
                <InputGroup style={{ width: '100px' }}>
                  <CustomInput type="select" label="To" id="toMonth">
                    <option>January</option>
                    <option>February</option>
                    <option>March</option>
                    <option>April</option>
                    <option>May</option>
                    <option>June</option>
                    <option>July</option>
                    <option>August</option>
                    <option>September</option>
                    <option>October</option>
                    <option>November</option>
                    <option>December</option>
                  </CustomInput>
                </InputGroup>
                <Col>
                  <Button color="primary" type="button">
                    <i className="fa fa-bell mr-2"></i>
                    {t('Current year')}
                  </Button>
                  {'  '}
                  <Button color="primary" type="button">
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
