import React, { useContext } from 'react'
import { Button, ButtonGroup } from 'Components'
import Grid from '@mui/material/Grid'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import type { DateRangeSelectorProps } from '../types'
import { DATE_PRESETS } from '../constants'

interface ThemeState {
  state: {
    theme: string
  }
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  startDate,
  endDate,
  selectedPreset,
  onStartDateChange,
  onEndDateChange,
  onPresetSelect,
  onApply,
  isLoading,
}) => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext) as ThemeState
  const selectedTheme = theme.state.theme

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item>
        <ButtonGroup size="small">
          {DATE_PRESETS.map((preset) => {
            const isSelected = selectedPreset === preset.months
            return (
              <Button
                key={preset.months}
                onClick={() => onPresetSelect(preset.months)}
                color={isSelected ? `primary-${selectedTheme}` : 'secondary'}
                outline={!isSelected}
              >
                {t(preset.labelKey)}
              </Button>
            )
          })}
        </ButtonGroup>
      </Grid>
      <Grid item>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={2}>
            <Grid item>
              <DatePicker
                format="MM/DD/YYYY"
                label={t('dashboard.start_date')}
                value={startDate}
                onChange={onStartDateChange}
                slotProps={{ textField: { size: 'small' } }}
              />
            </Grid>
            <Grid item>
              <DatePicker
                format="MM/DD/YYYY"
                label={t('dashboard.end_date')}
                value={endDate}
                onChange={onEndDateChange}
                slotProps={{ textField: { size: 'small' } }}
              />
            </Grid>
          </Grid>
        </LocalizationProvider>
      </Grid>
      <Grid item>
        <Button color={`primary-${selectedTheme}`} onClick={onApply} disabled={isLoading}>
          <i className={`fa fa-search me-2 ${isLoading ? 'fa-spin' : ''}`}></i>
          {t('actions.view')}
        </Button>
      </Grid>
    </Grid>
  )
}

export default DateRangeSelector
