import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { GluuBadge } from '@/components/GluuBadge'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { useSecurityStyles } from '../SecurityMonitorPage.style'
import type { AnomalyBannerProps } from '../types'

const AnomalyBanner: React.FC<AnomalyBannerProps> = ({ anomalies }) => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const themeColors = useMemo(() => getThemeColor(state.theme), [state.theme])
  const isDark = state.theme === THEME_DARK
  const { classes } = useSecurityStyles({ isDark, themeColors })

  const hasAnomalies = anomalies.count > 0

  return (
    <div className={classes.anomalySummary} role="status">
      <span className={hasAnomalies ? classes.anomalyCount : classes.anomalyCountClear}>
        {t('fields.active_anomalies', { total: anomalies.count })}
      </span>
      {anomalies.chips.map((chip) => (
        <GluuBadge
          key={chip.kind}
          pill
          backgroundColor={themeColors.badges.statusInactiveBg}
          textColor={themeColors.badges.statusInactive}
        >
          {chip.label}
        </GluuBadge>
      ))}
    </div>
  )
}

export default React.memo(AnomalyBanner)
