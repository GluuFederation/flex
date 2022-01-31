import React, { useState, useEffect } from 'react'
import { addMonths, subMonths, addDays } from 'date-fns'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import GluuLoader from '../../../../app/routes/Apps/Gluu/GluuLoader'
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
      getMonth(startDate) +
      startDate.getFullYear() +
      '%' +
      getMonth(endDate) +
      endDate.getFullYear()
    console.log('=============================' + month)
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
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(addMonths(new Date(), 1))

  const CustomButton = React.forwardRef(({ value, onClick }, ref) => (
    <Button
      color="primary"
      outline
      style={applicationstyle.buttonStyle}
      className="example-custom-input"
      onClick={onClick}
      ref={ref}
    >
      {value}
      {'  '}
    </Button>
  ))

  return (
    <Card>
      <GluuRibbon title={t('titles.active_users')} fromLeft />
      <FormGroup row />
      <FormGroup row />
      <FormGroup row />
      <CardBody>
        <FormGroup row>
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
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              isClearable
              startDate={startDate}
              endDate={endDate}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              minDate={startDate}
              customInput={<CustomButton />}
              placeholderText="Select the end month"
            />
          </Col>
          <Col sm={4}> </Col>
        </FormGroup>
      </CardBody>
      <CardFooter className="p-4 bt-0"></CardFooter>
    </Card>
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
