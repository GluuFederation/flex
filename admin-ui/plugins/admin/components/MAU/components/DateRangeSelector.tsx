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
  headingKey = 'titles.usage_token_analytics',
  presets = DATE_PRESETS,
  applyLabelKey = 'actions.view',
  presetMenu,
  presetMenuAnchor,
}) => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const selectedTheme = state.theme
  const themeColors = getThemeColor(selectedTheme)
  const { classes } = useStyles()

  // The unselected preset fill doubles as the date field fill, so the whole filter row reads as one
  // surface with only the active preset lifted out of it.
  const unselectedBg = themeColors.dashboard.supportCard ?? themeColors.menu.background
  const presetButtonBg = (isSelected: boolean) =>
    isSelected ? themeColors.inputBackground : unselectedBg
  const presetButtonBorder = themeColors.borderColor

  return (
    <Grid container spacing={2} className={classes.container}>
      <Grid className={classes.headingCol}>
        <GluuText variant="h5" className={classes.heading}>
          {t(headingKey)}
        </GluuText>
      </Grid>
      <Grid className={classes.controlsCol}>
        <Grid container spacing={2} className={classes.controls}>
          <Grid className={classes.presetColWrap}>
            <Box className={classes.presetGroup}>
              {presets.map((preset, index) => {
                const isSelected = selectedPreset === preset.value
                const isFirst = index === 0
                const isLast = index === presets.length - 1
                return (
                  <Box key={preset.value} className={classes.presetSlot}>
                    <GluuButton
                      onClick={() => onPresetSelect(preset.value)}
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
                    {presetMenu && presetMenuAnchor === preset.value ? (
                      <Box className={classes.presetMenu}>{presetMenu}</Box>
                    ) : null}
                  </Box>
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
              inputBackgroundColor={unselectedBg}
              backgroundColor={unselectedBg}
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
              {t(applyLabelKey)}
            </GluuButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default DateRangeSelector
