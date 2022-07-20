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
import { useTranslation } from 'react-i18next'

export default function MaterialUIPickers() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
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
      <Grid container>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id="date-picker-inline"
          label={t('dashboard.start_date')}
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
          label={t('dashboard.end_date')}
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
