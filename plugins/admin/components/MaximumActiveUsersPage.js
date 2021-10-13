import React, { Component, useState, useEffect } from 'react'
import { Button, Card, CardFooter, CardBody } from '../../../app/components'
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
  const { t } = useTranslation()
  const userAction = {}
  const options = {}
  const currentDate = new Date()
  const [average, setAverage] = useState(0)
  const [codeAT, setCodeAT] = useState(true)
  const [credentialAT, setCredentialAT] = useState(true)

  const pickRange2 = React.createRef()
  const [rangeValue2, setRangeValue2] = useState({
    from: { year: 2021, month: 5 },
    to: { year: 2021, month: 9 },
  })
  const pickerLang = {
    months: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    from: 'From',
    to: 'To',
  }

  useEffect(() => {
    options['month'] = '202109%20202108%20202107%20202106%20202105'
    buildPayload(userAction, 'GET MAU', options)
    dispatch(getMau(userAction))
  }, [])
  function search() {
    options['month'] = makeOptions()
    buildPayload(userAction, 'GET MAU', options)
    dispatch(getMau(userAction))
  }
  function makeOptions() {
    const date = new Date()
    date.setFullYear(rangeValue2.from.year)
    date.setMonth(rangeValue2.from.month - 1)
    var monthRange = date.toISOString().substr(0, 7).replace('-', '')
    for (let i = rangeValue2.from.year; i <= rangeValue2.to.year; i++) {
      date.setFullYear(i)
      for (
        let j = i == rangeValue2.from.year ? rangeValue2.from.month : 0;
        j < (i < rangeValue2.to.year ? 12 : rangeValue2.to.month);
        j++
      ) {
        date.setMonth(j)
        const temp = date.toISOString().substr(0, 7).replace('-', '')
        monthRange = monthRange + '%20' + temp
      }
    }
    return monthRange
  }

  const CustomTooltipForMAU = ({ active, payload, label }) => {
    if (active && payload) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: 'lightGray',
            padding: '5px',
            border: '1px solid gray',
            borderRadius: '5px',
            color: 'black',
          }}
        >
          <p className="label">{`Month : ${label % 100}/${Math.floor(
            label / 100,
          )}`}</p>
          <p className="label">{`Monthly Active Users : ${payload[0].value}`}</p>
        </div>
      )
    }

    return null
  }
  const CustomTooltipForTokens = ({ active, payload, label }) => {
    if (active && payload) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: 'lightGray',
            padding: '5px',
            border: '1px solid gray',
            borderRadius: '5px',
            color: 'black',
          }}
        >
          <p className="label">{`Month : ${label % 100}/${Math.floor(
            label / 100,
          )}`}</p>
          <p className="label">{`Authorization Code Access Token : ${payload[0].value}`}</p>
          <p className="label">{`Client Credentials Access Token : ${payload[1].value}`}</p>
        </div>
      )
    }

    return null
  }
  const makeText = (m) => {
    if (m && m.year && m.month)
      return pickerLang.months[m.month - 1] + '. ' + m.year
    return '?'
  }
  const _handleClickRangeBox2 = (e) => {
    pickRange2.current.show()
  }
  const handleRangeChange2 = (value, text, listIndex) => {}
  const handleRangeDissmis2 = (value) => {
    setRangeValue2(value)
  }
  const arrAvg = (arr) => {
    let sum = 0
    let length = arr.length
    if (length < 1) return 0
    for (let i = 0; i < length; i++) {
      sum += arr[i].monthly_active_users
    }
    return (sum / length).toFixed(2)
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
              <div className="d-flex justify-content-center mb-3">
                <Picker
                  ref={pickRange2}
                  years={{
                    min: { year: 2018, month: 1 },
                    max: {
                      year: currentDate.getFullYear(),
                      month: currentDate.getMonth() + 1,
                    },
                  }}
                  value={rangeValue2}
                  lang={pickerLang}
                  theme="dark"
                  onChange={handleRangeChange2}
                  onDismiss={handleRangeDissmis2}
                >
                  <MonthBox
                    value={
                      makeText(rangeValue2.from) +
                      ' ~ ' +
                      makeText(rangeValue2.to)
                    }
                    onClick={_handleClickRangeBox2}
                  />
                </Picker>
                <Button className="ml-4 mr-4" color="primary" onClick={search}>
                  {t('actions.view')}
                </Button>
                <label
                  style={{
                    border: '2px solid gray',
                    borderRadius: '5px',
                    marginBottom: '0px',
                    fontSize: 'larger',
                    padding: '10px',
                    marginLeft: '50px',
                    minWidth: '230px',
                    textAlign: 'center',
                    color: 'black',
                  }}
                >
                  Average of MAU : {arrAvg(Object.values(stat))}
                </label>
              </div>
              <ResponsiveContainer width="80%" height={500}>
                <LineChart height={300} data={Object.values(stat)}>
                  <Line
                    name="Monthly Active Users"
                    type="monotone"
                    dataKey="monthly_active_users"
                    stroke="#8884d8"
                  />
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <XAxis
                    dataKey="month"
                    tickFormatter={(tickItem) => {
                      return (tickItem % 100) + '/' + Math.floor(tickItem / 100)
                    }}
                  />
                  <YAxis />
                  <Tooltip content={<CustomTooltipForMAU />} />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
              <br />
              <br />
              <br />
              <ResponsiveContainer width="80%" height={500}>
                <LineChart height={300} data={Object.values(stat)}>
                  {codeAT && (
                    <Line
                      name="Authorization Code Access Token"
                      type="monotone"
                      dataKey="token_count_per_granttype.authorization_code.access_token"
                      stroke="#ff1e86"
                    />
                  )}
                  {credentialAT && (
                    <Line
                      name="Client Credentials Access Token"
                      type="monotone"
                      dataKey="token_count_per_granttype.client_credentials.access_token"
                      stroke="#4f1e86"
                    />
                  )}
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <XAxis
                    dataKey="month"
                    tickFormatter={(tickItem) => {
                      return (tickItem % 100) + '/' + Math.floor(tickItem / 100)
                    }}
                  />
                  <YAxis />
                  <Tooltip content={<CustomTooltipForTokens />} />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
              <hr />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                <div className="pretty p-default p-curve p-smooth">
                  <input
                    type="checkbox"
                    checked={codeAT}
                    onClick={(e) => {
                      setCodeAT(!codeAT)
                    }}
                  />
                  <div className="state p-primary">
                    <label>Authorization Code Access Token</label>
                  </div>
                </div>
                <div className="pretty p-default p-curve p-smooth">
                  <input
                    type="checkbox"
                    checked={credentialAT}
                    onClick={(e) => {
                      setCredentialAT(!credentialAT)
                    }}
                  />
                  <div className="state p-primary">
                    <label>Client Credentials Access Token</label>
                  </div>
                </div>
              </div>
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
