import React from 'react'
import { ButtonGroup } from 'Components'
import Grid from '@mui/material/Grid'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import { THEME_DARK } from '@/context/theme/constants'
import customColors from '@/customColors'
import { GluuButton } from '@/components/GluuButton'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { fontFamily, fontWeights, fontSizes, lineHeights, letterSpacing } from '@/styles/fonts'
import type { DateRangeSelectorProps } from '../types'
import { DATE_PRESETS } from '../constants'
import { getDatePickerTextFieldSlotProps } from '../utils'

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
  const { state } = useTheme()
  const selectedTheme = state.theme
  const isDark = selectedTheme === THEME_DARK
  const datePickerTextFieldSlotProps = getDatePickerTextFieldSlotProps(isDark)

  return (
    <Grid container spacing={2} alignItems="center" justifyContent="space-between">
      <Grid item>
        <GluuText
          variant="h5"
          style={{
            fontFamily,
            fontSize: fontSizes['2xl'],
            fontStyle: 'normal',
            fontWeight: fontWeights.medium,
            lineHeight: lineHeights.tight,
          }}
        >
          {t('titles.usage_token_analytics')}
        </GluuText>
      </Grid>
      <Grid item>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <ButtonGroup size="small">
              {DATE_PRESETS.map((preset) => {
                const isSelected = selectedPreset === preset.months
                return (
                  <GluuButton
                    key={preset.months}
                    onClick={() => onPresetSelect(preset.months)}
                    theme={selectedTheme}
                    outlined={!isSelected}
                    style={{
                      minWidth: 110,
                      borderRadius: 8,
                      borderColor: isDark ? customColors.darkBorder : customColors.borderInput,
                      backgroundColor: isSelected
                        ? isDark
                          ? customColors.darkInputBg
                          : customColors.lightInputBg
                        : 'transparent',
                    }}
                  >
                    {t(preset.labelKey)}
                  </GluuButton>
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
                    slotProps={{ textField: datePickerTextFieldSlotProps }}
                  />
                </Grid>
                <Grid item>
                  <DatePicker
                    format="MM/DD/YYYY"
                    label={t('dashboard.end_date')}
                    value={endDate}
                    onChange={onEndDateChange}
                    slotProps={{ textField: datePickerTextFieldSlotProps }}
                  />
                </Grid>
              </Grid>
            </LocalizationProvider>
          </Grid>
          <Grid item>
            <GluuButton
              backgroundColor={customColors.statusActive}
              textColor={customColors.white}
              onClick={onApply}
              disabled={isLoading}
              disableHoverStyles
              fontSize={fontSizes.base}
              fontWeight={fontWeights.bold}
              style={{
                minWidth: 96,
                borderRadius: 8,
                fontFamily,
                fontStyle: 'normal',
                lineHeight: lineHeights.normal,
                letterSpacing: letterSpacing.button,
              }}
            >
              {t('actions.view')}
            </GluuButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default DateRangeSelector
