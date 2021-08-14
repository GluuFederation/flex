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
import GluuViewWrapper from '../../../app/routes/Apps/Gluu/GluuViewWrapper'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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
  function search() {
    options['month'] = startDate + '%' + endDate
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
  const { t } = useTranslation()
  console.log('========stat ' + JSON.stringify(stat))
  const data = {
    '202101': {
      monthly_active_users: 1939497078,
      token_count_per_granttype: {
        implicit: {
          access_token: 8843443,
          refresh_token: 361678620,
          uma_token: 257653798,
          id_token: 1196937417,
        },
        refresh_token: {
          access_token: 198484847,
          refresh_token: 527458534,
          uma_token: 1552211159,
          id_token: 2077968838,
        },
        password: {
          access_token: 21293868,
          refresh_token: 2003904704,
          uma_token: 44144850,
          id_token: 1713870170,
        },
        client_credentials: {
          access_token: 1656091541,
          refresh_token: 875245682,
          uma_token: 1920358732,
          id_token: 2029924857,
        },
        'urn:ietf:params:oauth:grant-type:device_code': {
          access_token: 871050693,
          refresh_token: 735390384,
          uma_token: 902227655,
          id_token: 572398177,
        },
        authorization_code: {
          access_token: 1468057290,
          refresh_token: 1576996227,
          uma_token: 1755565333,
          id_token: 944346498,
        },
        'urn:openid:params:grant-type:ciba': {
          access_token: 1187334485,
          refresh_token: 1043290537,
          uma_token: 206572517,
          id_token: 1850166398,
        },
        'urn:ietf:params:oauth:grant-type:uma-ticket': {
          access_token: 933970698,
          refresh_token: 1089756841,
          uma_token: 352343374,
          id_token: 645686974,
        },
      },
    },
    '202012': {
      monthly_active_users: 1620607010,
      token_count_per_granttype: {
        implicit: {
          access_token: 20676511,
          refresh_token: 960308503,
          uma_token: 703633153,
          id_token: 573544490,
        },
        refresh_token: {
          access_token: 526463917,
          refresh_token: 483679318,
          uma_token: 545888615,
          id_token: 951286042,
        },
        password: {
          access_token: 1883167951,
          refresh_token: 1636169697,
          uma_token: 1753544837,
          id_token: 1675535757,
        },
        client_credentials: {
          access_token: 290209545,
          refresh_token: 1635984977,
          uma_token: 1066472511,
          id_token: 463520941,
        },
        'urn:ietf:params:oauth:grant-type:device_code': {
          access_token: 84124820,
          refresh_token: 1705729386,
          uma_token: 2070635541,
          id_token: 970034925,
        },
        authorization_code: {
          access_token: 387026047,
          refresh_token: 907425179,
          uma_token: 370523863,
          id_token: 1807260512,
        },
        'urn:openid:params:grant-type:ciba': {
          access_token: 1408098991,
          refresh_token: 819153423,
          uma_token: 936295536,
          id_token: 378210748,
        },
        'urn:ietf:params:oauth:grant-type:uma-ticket': {
          access_token: 381038617,
          refresh_token: 828068056,
          uma_token: 448746427,
          id_token: 650520169,
        },
      },
    },
  }
  const mData = Object.entries(data)
  const mapData = mData.map((entry) => {
    let jsonData = {}
    jsonData['month'] = String(entry[0])
    jsonData['monthly_active_users'] = entry[1].monthly_active_users
    jsonData['monthly_refresh_token'] =
      entry[1].token_count_per_granttype.refresh_token.refresh_token
    jsonData['monthly_password'] =
      entry[1].token_count_per_granttype.password.refresh_token
    jsonData['monthly_implicit'] =
      entry[1].token_count_per_granttype.implicit.refresh_token
    jsonData['monthly_client_credentials'] =
      entry[1].token_count_per_granttype.client_credentials.refresh_token
    jsonData['monthly_authorization_code'] =
      entry[1].token_count_per_granttype.authorization_code.refresh_token
    return jsonData
  })

  console.log('================= ' + JSON.stringify(mapData))

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
              <Container>
                <FormGroup
                  row
                  style={{ marginLeft: '20px', marginBottom: '20px' }}
                >
                  <InputGroup style={{ width: '70px' }} onChange={getStartDate}>
                    <CustomInput label="From" type="select" id={FROM_YEAR_ID}>
                      <option value="2021">2021</option>
                      <option value="2020">2020</option>
                    </CustomInput>
                  </InputGroup>
                  <div>&nbsp;&nbsp;&nbsp;&nbsp;</div>
                  <InputGroup
                    style={{ width: '100px' }}
                    onChange={getStartDate}
                  >
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
                  <InputGroup style={{ width: '70px' }} onChange={getEndDate}>
                    <CustomInput label="From" type="select" id={TO_YEAR_ID}>
                      <option value="2021">2021</option>
                      <option value="2020">2020</option>
                    </CustomInput>
                  </InputGroup>
                  <div>&nbsp;&nbsp;&nbsp;&nbsp;</div>
                  <InputGroup style={{ width: '100px' }} onChange={getEndDate}>
                    {MonthsComponent}
                  </InputGroup>
                  <Col>
                    <Button color="info" type="button" onClick={search}>
                      <i className="fa fa-search mr-2"></i>
                      {t('actions.search')}
                    </Button>
                    {'  '}
                    <Button
                      color="primary"
                      type="button"
                      onClick={getCurrentYearStat}
                    >
                      <i className="fa fa-bell mr-2"></i>
                      {t('actions.currentYear')}
                    </Button>
                    {'  '}
                    <Button
                      color="primary"
                      type="button"
                      onClick={getCurrentMonthStat}
                    >
                      <i className="fa fa-asterisk mr-2"></i>
                      {t('actions.currentMonth')}
                    </Button>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <BarChart
                    width={900}
                    height={400}
                    data={mapData}
                    margin={{
                      top: 5,
                      right: 5,
                      left: 60,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="monthly_active_users"
                      fill="#009624"
                      background={{ fill: '#eee' }}
                    />
                    <Bar dataKey="monthly_refresh_token" fill="#88ffff" />
                    <Bar dataKey="monthly_password" fill="#000051" />
                    <Bar dataKey="monthly_implicit" fill="#ffc4ff" />
                  </BarChart>
                </FormGroup>
              </Container>
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
