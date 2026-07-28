import React from 'react'
import { GluuButton } from '@/components/GluuButton'
import { getSegmentedButtonStyle } from '@/constants'
import { useSecurityTheme } from '../hooks'
import { useSecurityStyles } from '../SecurityMonitorPage.style'
import type { PeriodToggleProps } from '../types'

const PeriodToggle: React.FC<PeriodToggleProps> = ({ options, value, onChange, ariaLabel }) => {
  const { theme, themeColors, isDark } = useSecurityTheme()
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
            theme={theme}
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
