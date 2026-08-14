import React from 'react'
import SecurityInfoTooltip from './SecurityInfoTooltip'
import { TrendingDownIcon, TrendingUpIcon } from '@/components/icons'
import { useSecurityTheme } from '../hooks'
import { useSecurityStyles } from '../SecurityMonitorPage.style'
import type { KpiDeltaLabelProps } from '../types'

const KpiDeltaLabel: React.FC<KpiDeltaLabelProps> = ({
  delta,
  label,
  increaseIsGood = false,
  hint,
}) => {
  const { themeColors, isDark } = useSecurityTheme()
  const { classes, cx } = useSecurityStyles({ isDark, themeColors })

  const isFlat = delta.value === 0
  const isGood = delta.isIncrease === increaseIsGood
  const toneClass = isFlat
    ? classes.kpiDeltaNeutral
    : isGood
      ? classes.kpiDeltaGood
      : classes.kpiDeltaBad

  const row = (
    <p className={classes.kpiDeltaRow}>
      <span className={cx(classes.kpiDeltaBadge, toneClass)}>
        {isFlat ? null : delta.isIncrease ? <TrendingUpIcon /> : <TrendingDownIcon />}
        {delta.value}
      </span>
      <span className={classes.kpiCaption}>{label}</span>
    </p>
  )

  return <SecurityInfoTooltip title={hint}>{row}</SecurityInfoTooltip>
}

export default React.memo(KpiDeltaLabel)
