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
import ActiveUserStatPanel from './ActiveUserStatPanel'
import {
  BarChart,
  LineChart,
  Bar,
  XAxis,
  YAxis,
  Line,
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
  const [selectedStat, setSelectedStat] = useState(stat)
  const userAction = {}
  const FROM_YEAR_ID = 'FROM_YEAR_ID'
  const FROM_MONTH_ID = 'FROM_MONTH_ID'
  const TO_YEAR_ID = 'TO_YEAR_ID'
  const TO_MONTH_ID = 'TO_MONTH_ID'
  const options = {}
  const data1 = [{name: 'Jan', uv: 200, pv: 2400}, {name: 'Feb', uv: 400, pv: 400},{name: 'Mar', uv: 300, pv: 1400}];
  const currentDate = new Date()
  const currentMonth =
    currentDate.getFullYear() +
    String(currentDate.getMonth() + 1).padStart(2, '0')
  const [startDate, setStartDate] = useState('202101')
  const [endDate, setEndDate] = useState('202101')

  useEffect(() => {
    options['month'] = '202108'
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
  const { t } = useTranslation()
  console.log('========stat ' + JSON.stringify(stat))
  const data = {
    '202102': {
      monthly_active_users: 1539,
      token_count_per_granttype: {
        implicit: {
          access_token: 8,
          refresh_token: 361,
          uma_token: 257,
          id_token: 1196,
        },
        refresh_token: {
          access_token: 198,
          refresh_token: 527,
          uma_token: 1552,
          id_token: 2077,
        },
        password: {
          access_token: 21,
          refresh_token: 2003,
          uma_token: 44,
          id_token: 1713,
        },
        client_credentials: {
          access_token: 1656,
          refresh_token: 875,
          uma_token: 1920,
          id_token: 2029,
        },
        'urn:ietf:params:oauth:grant-type:device_code': {
          access_token: 871,
          refresh_token: 735,
          uma_token: 902,
          id_token: 572,
        },
        authorization_code: {
          access_token: 1468,
          refresh_token: 1576,
          uma_token: 1755,
          id_token: 944,
        },
        'urn:openid:params:grant-type:ciba': {
          access_token: 1187,
          refresh_token: 1043,
          uma_token: 206,
          id_token: 1850,
        },
        'urn:ietf:params:oauth:grant-type:uma-ticket': {
          access_token: 933,
          refresh_token: 1089,
          uma_token: 352,
          id_token: 645,
        },
      },
    },
    '202101': {
      monthly_active_users: 1939,
      token_count_per_granttype: {
        implicit: {
          access_token: 8,
          refresh_token: 361,
          uma_token: 257,
          id_token: 1196,
        },
        refresh_token: {
          access_token: 198,
          refresh_token: 527,
          uma_token: 1552,
          id_token: 2077,
        },
        password: {
          access_token: 21,
          refresh_token: 2003,
          uma_token: 44,
          id_token: 1713,
        },
        client_credentials: {
          access_token: 1656,
          refresh_token: 875,
          uma_token: 1920,
          id_token: 2029,
        },
        'urn:ietf:params:oauth:grant-type:device_code': {
          access_token: 871,
          refresh_token: 735,
          uma_token: 902,
          id_token: 572,
        },
        authorization_code: {
          access_token: 1468,
          refresh_token: 1576,
          uma_token: 1755,
          id_token: 944,
        },
        'urn:openid:params:grant-type:ciba': {
          access_token: 1187,
          refresh_token: 1043,
          uma_token: 206,
          id_token: 1850,
        },
        'urn:ietf:params:oauth:grant-type:uma-ticket': {
          access_token: 933,
          refresh_token: 1089,
          uma_token: 352,
          id_token: 645,
        },
      },
    },
    '202012': {
      monthly_active_users: 1620,
      token_count_per_granttype: {
        implicit: {
          access_token: 20,
          refresh_token: 960,
          uma_token: 703,
          id_token: 573,
        },
        refresh_token: {
          access_token: 526,
          refresh_token: 483,
          uma_token: 545,
          id_token: 951,
        },
        password: {
          access_token: 1883,
          refresh_token: 1636,
          uma_token: 1753,
          id_token: 1675,
        },
        client_credentials: {
          access_token: 290,
          refresh_token: 1635,
          uma_token: 1066,
          id_token: 463,
        },
        'urn:ietf:params:oauth:grant-type:device_code': {
          access_token: 84,
          refresh_token: 1705,
          uma_token: 2070,
          id_token: 970,
        },
        authorization_code: {
          access_token: 387,
          refresh_token: 907,
          uma_token: 370,
          id_token: 1807,
        },
        'urn:openid:params:grant-type:ciba': {
          access_token: 1408,
          refresh_token: 819,
          uma_token: 936,
          id_token: 378,
        },
        'urn:ietf:params:oauth:grant-type:uma-ticket': {
          access_token: 381,
          refresh_token: 828,
          uma_token: 448,
          id_token: 650,
        },
      },
    },
  }
  console.log("reducer Stat :", JSON.stringify(stat))
  const mData = Object.entries(JSON.stringify(stat))
  const mapData = mData.map((entry) => {
    let jsonData = {}
    jsonData['month'] = String(entry[0])
    jsonData['monthly_active_users'] = entry[1].monthly_active_users

    

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
              <ResponsiveContainer width="60%" height={300}>
                <LineChart width={600} height={300} data={mapData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
