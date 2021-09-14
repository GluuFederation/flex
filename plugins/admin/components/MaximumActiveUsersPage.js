import React, { Component, useState, useEffect } from 'react'
import {
  Button,
  Card,
  CardFooter,
  CardBody,
  CustomInput,
  Label,
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
import Picker from 'react-month-picker'
import PropTypes from 'prop-types'

class MonthBox extends Component {
  static propTypes = {
    value: PropTypes.string,
    onClick: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      value: this.props.value || 'N/A',
    }
  }
  static getDerivedStateFromProps(props, state) {
    return {
      value: props.value || 'N/A',
    }
  }
  render() {
    return (
      <div className="box" onClick={this._handleClick}>
        <label className="mb-0">{this.state.value}</label>
      </div>
    )
  }
  _handleClick = (e) => {
    this.props.onClick && this.props.onClick(e)
  }
}

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

  const pickRange2 = React.createRef()
  const [rangeValue2,setRangeValue2] = useState({from: {year: 2021, month: 7}, to: {year: 2021, month: 9}})
  const pickerLang = {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    from: 'From', to: 'To',
  }

  useEffect(() => {
    options['month'] = '202109%20202108%20202107'
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
    options['month'] = '202109%20202108%20202107' //startDate + String('%') + endDate
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

  
  const MonthsComponent = () => (
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
  const CustomTooltipForMAU = ({ active, payload, label }) => {
    if (active && payload) {
      return (
        <div className="custom-tooltip" style={{backgroundColor:"white"}}>
          <p className="label">{`Month:${label}`}</p>
          <p className="label">{`Monthly Active Users:${payload[0].value}`}</p>
        </div>
      );
    }
  
    return null;
  };
  const CustomTooltipForTokens = ({ active, payload, label }) => {
    if (active && payload) {
      return (
        <div className="custom-tooltip" style={{backgroundColor:"white"}}>
          <p className="label">{`Month:${label}`}</p>
          <p className="label">{`Authorization Code Access Token:${payload[0].value}`}</p>
          <p className="label">{`Client Credentials Access Token:${payload[1].value}`}</p>
        </div>
      );
    }
  
    return null;
  };
  const makeText = m => {
    if (m && m.year && m.month) return (pickerLang.months[m.month-1] + '. ' + m.year)
    return '?'
  }
  const _handleClickRangeBox2 = (e) => {
    pickRange2.current.show()
  }
  const handleRangeChange2 = (value, text, listIndex) => {
    
  }
  const handleRangeDissmis2 = (value) => {
    setRangeValue2(value)
  }
  return (
    <GluuLoader blocking={loading}>
      <GluuViewWrapper
        canShow={hasBoth(permissions, STAT_READ, STAT_JANS_READ)}
      >
        <ResponsiveContainer>
          <Card>
            <CardBody
              className="d-flex flex-column justify-content-center align-items-center pt-5"
              style={{ minHeight: '400px' }}
            >
              <div className="d-flex justify-content-center mb-5">
                <Picker
                    ref={pickRange2}
                    years={{min: {year: 2020, month: 1}, max: {year: 2021, month: 9}}}
                    value={rangeValue2}
                    lang={pickerLang}
                    theme="dark"
                    onChange={handleRangeChange2}
                    onDismiss={handleRangeDissmis2}
                >
                    <MonthBox value={makeText(rangeValue2.from) + ' ~ ' + makeText(rangeValue2.to) } onClick={_handleClickRangeBox2} />
                </Picker>
                {/* <Label className="d-flex flex-column justify-content-center mb-0">From</Label>
                <CustomInput className="ml-4 mr-4" type="select" label="From" id={FROM_MONTH_ID}>
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
                <Label className="d-flex flex-column justify-content-center mb-0">To</Label>
                <CustomInput className="ml-4 mr-4" type="select" label="To" id={TO_MONTH_ID}>
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
                </CustomInput>*/}
                <Button className="ml-4 mr-4" color="primary" onClick={search}>
                  {t('actions.view')}
                </Button> 
              </div>
              <ResponsiveContainer width="80%" height={500}>
                <LineChart width={'100%'} height={300} data={stat} >
                  <Line name="Monthly Active Users" type="monotone" dataKey="monthly_active_users" stroke="#8884d8" />
                  {/* <Line name="Authorization Access Token" type="monotone" dataKey="token_count_per_granttype.authorization_code.access_token" stroke="#ff1e86" /> */}
                  {/* <Line name="Client Credential Access Token" type="monotone" dataKey="token_count_per_granttype.client_credentials.access_token" stroke="#4f1e86" /> */}
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltipForMAU />}/>
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
              <ResponsiveContainer width="80%" height={500}>
                <LineChart width={'100%'} height={300} data={stat} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  {/* <Line name="Monthly Active Users" type="monotone" dataKey="monthly_active_users" stroke="#8884d8" /> */}
                  <Line name="Authorization Code Access Token" type="monotone" dataKey="token_count_per_granttype.authorization_code.access_token" stroke="#ff1e86" />
                  <Line name="Client Credentials Access Token" type="monotone" dataKey="token_count_per_granttype.client_credentials.access_token" stroke="#4f1e86" />
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltipForTokens />}/>
                  <Legend />
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
