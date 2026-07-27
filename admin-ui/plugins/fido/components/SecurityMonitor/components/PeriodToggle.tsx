import React, { useMemo } from 'react'
import { GluuButton } from '@/components/GluuButton'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { getSegmentedButtonStyle } from '@/constants'
import { useSecurityStyles } from '../SecurityMonitorPage.style'
import type { PeriodToggleProps } from '../types'

const PeriodToggle: React.FC<PeriodToggleProps> = ({ options, value, onChange, ariaLabel }) => {
  const { state } = useTheme()
  const themeColors = useMemo(() => getThemeColor(state.theme), [state.theme])
  const isDark = state.theme === THEME_DARK
  const { classes } = useSecurityStyles({ isDark, themeColors })

  const unselectedBg = themeColors.dashboard.supportCard ?? themeColors.menu.background

  return (
    <div className={classes.toggleGroup} role="group" aria-label={ariaLabel}>
      {options.map((option, index) => {
        const isSelected = option.value === value
        return (
          <GluuButton
            key={option.value}
            type="button"
            theme={state.theme}
            aria-label={option.label}
            outlined={!isSelected}
            backgroundColor={isSelected ? themeColors.inputBackground : unselectedBg}
            textColor={themeColors.fontColor}
            borderColor={themeColors.borderColor}
            disableHoverStyles
            style={getSegmentedButtonStyle(index === 0, index === options.length - 1)}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </GluuButton>
        )
      })}
    </div>
  )
}

export default React.memo(PeriodToggle)
