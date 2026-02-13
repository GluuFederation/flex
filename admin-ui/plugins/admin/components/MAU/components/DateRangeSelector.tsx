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
import { fontFamily, fontWeights, fontSizes, lineHeights, letterSpacing } from '@/styles/fonts'
import { DATE_FORMATS } from '@/utils/dayjsUtils'
import type { DateRangeSelectorProps } from '../types'
import { DATE_PRESETS } from '../constants'

const VIEW_BUTTON_STYLE = {
  minWidth: 96,
  borderRadius: 8,
  fontFamily,
  fontStyle: 'normal' as const,
  lineHeight: lineHeights.normal,
  letterSpacing: letterSpacing.button,
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
  const { state } = useTheme()
  const selectedTheme = state.theme
  const themeColors = getThemeColor(selectedTheme)

  const presetButtonBg = (isSelected: boolean) =>
    isSelected
      ? themeColors.inputBackground
      : (themeColors.dashboard.supportCard ?? themeColors.menu.background)
  const presetButtonBorder = themeColors.borderColor

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
            <Box sx={{ display: 'flex', gap: 0 }}>
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
                    style={{
                      minWidth: 110,
                      borderRadius: isFirst ? '8px 0 0 8px' : isLast ? '0 8px 8px 0' : 0,
                      marginLeft: isFirst ? 0 : -1,
                    }}
                  >
                    {t(preset.labelKey)}
                  </GluuButton>
                )
              })}
            </Box>
          </Grid>
          <Grid item>
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
          <Grid item>
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
