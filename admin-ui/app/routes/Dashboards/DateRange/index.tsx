import React from 'react'
import Grid from '@mui/material/Grid'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useTranslation } from 'react-i18next'
import type { Dayjs } from 'dayjs'

interface DateRangeProps {
  startDate: Dayjs
  endDate: Dayjs
  onStartDateChange: (date: Dayjs | null) => void
  onEndDateChange: (date: Dayjs | null) => void
}

export default function DateRange({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateRangeProps) {
  const { t } = useTranslation()

  return (
    <Grid container gap={2}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="d-flex flex-column gap-4 my-3 align-items-center ">
          <DatePicker
            format="MM/DD/YYYY"
            label={t('dashboard.start_date')}
            value={startDate}
            onChange={onStartDateChange}
            slotProps={{
              textField: {
                size: 'small',
                InputLabelProps: { shrink: true },
              },
            }}
            sx={{
              '& .MuiInputLabel-sizeSmall': {
                padding: '0 2px',
                background: 'white',
                fontSize: '19px',
                marginTop: '-2px',
              },
            }}
          />
          <DatePicker
            format="MM/DD/YYYY"
            label={t('dashboard.end_date')}
            value={endDate}
            onChange={onEndDateChange}
            slotProps={{
              textField: {
                size: 'small',
                InputLabelProps: { shrink: true },
              },
            }}
            sx={{
              '& .MuiInputLabel-sizeSmall': {
                padding: '0 2px',
                background: 'white',
                fontSize: '19px',
                marginTop: '-2px',
              },
            }}
          />
        </div>
      </LocalizationProvider>
    </Grid>
  )
}
