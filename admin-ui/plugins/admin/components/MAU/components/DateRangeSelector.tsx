import React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import customColors from '@/customColors'
import { GluuButton } from '@/components/GluuButton'
import { GluuDatePicker } from '@/components/GluuDatePicker'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { fontWeights, fontSizes } from '@/styles/fonts'
import { DATE_FORMATS } from '@/utils/dayjsUtils'
import type { DateRangeSelectorProps } from '../types'
import { DATE_PRESETS } from '../constants'
import { useStyles, VIEW_BUTTON_STYLE, getPresetButtonStyle } from './DateRangeSelector.style'

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
  const themeColors = getThemeColor(selectedTheme)
  const { classes } = useStyles()

  const presetButtonBg = (isSelected: boolean) =>
    isSelected
      ? themeColors.inputBackground
      : (themeColors.dashboard.supportCard ?? themeColors.menu.background)
  const presetButtonBorder = themeColors.borderColor

  return (
    <Grid container spacing={2} className={classes.container}>
      <Grid className={classes.headingCol}>
        <GluuText variant="h5" className={classes.heading}>
          {t('titles.usage_token_analytics')}
        </GluuText>
      </Grid>
      <Grid className={classes.controlsCol}>
        <Grid container spacing={2} className={classes.controls}>
          <Grid className={classes.presetColWrap}>
            <Box className={classes.presetGroup}>
              {DATE_PRESETS.map((preset, index) => {
                const isSelected = selectedPreset === preset.months
                const isFirst = index === 0
                const isLast = index === DATE_PRESETS.length - 1
                return (
                  <GluuButton
                    key={preset.months}
                    onClick={() => onPresetSelect(preset.months)}
                    theme={selectedTheme}
                    outlined={!isSelected}
                    textColor={themeColors.fontColor}
                    backgroundColor={presetButtonBg(isSelected)}
                    borderColor={presetButtonBorder}
                    disableHoverStyles
                    style={getPresetButtonStyle(isFirst, isLast)}
                  >
                    {t(preset.labelKey)}
                  </GluuButton>
                )
              })}
            </Box>
          </Grid>
          <Grid className={classes.datePickerCol}>
            <GluuDatePicker
              mode="range"
              layout="row"
              format={DATE_FORMATS.DATE_PICKER_DISPLAY_US}
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={onStartDateChange}
              onEndDateChange={onEndDateChange}
            />
          </Grid>
          <Grid className={classes.viewCol}>
            <GluuButton
              backgroundColor={customColors.statusActive}
              textColor={customColors.white}
              onClick={onApply}
              disabled={isLoading}
              disableHoverStyles
              fontSize={fontSizes.base}
              fontWeight={fontWeights.bold}
              style={VIEW_BUTTON_STYLE}
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
