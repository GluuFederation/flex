import 'date-fns'
import React, { useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import DateFnsUtils from '@date-io/date-fns'
import { buildPayload } from 'Utils/PermChecker'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { getMau } from 'Redux/actions/MauActions'

export default function MaterialUIPickers() {
  const dispatch = useDispatch()
  // The first commit of Material-UI
  const [startDate, setStartDate] = React.useState(
    moment().subtract(3, 'months'),
  )
  const [endDate, setEndDate] = React.useState(moment())
  const userAction = {}
  const options = {}

  useEffect(() => {
    options['startMonth'] = startDate.format('YYYYMM')
    options['endMonth'] = endDate.format('YYYYMM')
    buildPayload(userAction, 'GET MAU', options)
    dispatch(getMau(userAction))
  }, [startDate, endDate])

  const setDate = (val, type) => {
    if (type == 'start') {
      setStartDate(moment(val))
    } else {
      setEndDate(moment(val))
    }
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justifyContent="space-around">
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id="date-picker-inline"
          label="Start Date"
          value={startDate}
          onChange={(val) => setDate(val, 'start')}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
          autoOk={true}
        />
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id="date-picker-inline"
          label="Start Date"
          value={endDate}
          onChange={(val) => setDate(val, 'end')}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
          autoOk={true}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  )
}
