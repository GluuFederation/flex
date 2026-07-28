import React from 'react'
import { useTranslation } from 'react-i18next'
import { GluuBadge } from '@/components/GluuBadge'
import { getBadgeBackground } from '../utils'
import { useSecurityTheme } from '../hooks'
import { useSecurityStyles } from '../SecurityMonitorPage.style'
import type { AnomalyBannerProps } from '../types'

const AnomalyBanner: React.FC<AnomalyBannerProps> = ({ anomalies }) => {
  const { t } = useTranslation()
  const { themeColors, isDark } = useSecurityTheme()
  const { classes } = useSecurityStyles({ isDark, themeColors })

  const hasAnomalies = anomalies.count > 0
  const chipBackground = getBadgeBackground(
    themeColors.badges.statusInactive,
    isDark,
    themeColors.badges.statusInactiveBg,
  )

  return (
    <div className={classes.anomalySummary} role="status">
      <span className={hasAnomalies ? classes.anomalyCount : classes.anomalyCountClear}>
        {t('fields.active_anomalies', { total: anomalies.count })}
      </span>
      {anomalies.chips.map((chip) => (
        <GluuBadge
          key={chip.kind}
          pill
          backgroundColor={chipBackground}
          textColor={themeColors.badges.statusInactive}
        >
          {chip.label}
        </GluuBadge>
      ))}
    </div>
  )
}

export default React.memo(AnomalyBanner)
