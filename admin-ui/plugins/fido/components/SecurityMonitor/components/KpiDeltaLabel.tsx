import React, { useMemo } from 'react'
import { TrendingDownIcon, TrendingUpIcon } from '@/components/icons'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { useSecurityStyles } from '../SecurityMonitorPage.style'
import type { KpiDeltaLabelProps } from '../types'

const KpiDeltaLabel: React.FC<KpiDeltaLabelProps> = ({ delta, label, increaseIsGood = false }) => {
  const { state } = useTheme()
  const themeColors = useMemo(() => getThemeColor(state.theme), [state.theme])
  const isDark = state.theme === THEME_DARK
  const { classes, cx } = useSecurityStyles({ isDark, themeColors })

  const isFlat = delta.value === 0
  const isGood = delta.isIncrease === increaseIsGood
  const toneClass = isFlat
    ? classes.kpiDeltaNeutral
    : isGood
      ? classes.kpiDeltaGood
      : classes.kpiDeltaBad

  return (
    <p className={classes.kpiDeltaRow}>
      <span className={cx(classes.kpiDeltaBadge, toneClass)}>
        {delta.isIncrease ? <TrendingUpIcon /> : <TrendingDownIcon />}
        {delta.value}
      </span>
      <span className={classes.kpiCaption}>{label}</span>
    </p>
  )
}

export default React.memo(KpiDeltaLabel)
