import React from 'react'
import { useTranslation } from 'react-i18next'
import GluuTooltip from 'Routes/Apps/Gluu/GluuTooltip'
import { GluuBadge } from '@/components/GluuBadge'
import { getBadgeBackground } from '../utils'
import { RECENT_ANOMALY_WINDOW_HOURS } from '../constants'
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
      <GluuTooltip
        doc_entry="security_active_anomalies"
        content={t('fields.active_anomalies_hint', { hours: RECENT_ANOMALY_WINDOW_HOURS })}
      >
        <span className={hasAnomalies ? classes.anomalyCount : classes.anomalyCountClear}>
          {t('fields.active_anomalies', {
            total: anomalies.count,
            hours: RECENT_ANOMALY_WINDOW_HOURS,
          })}
        </span>
      </GluuTooltip>
      {anomalies.chips.map((chip) => {
        const badge = (
          <GluuBadge
            pill
            backgroundColor={chipBackground}
            textColor={themeColors.badges.statusInactive}
          >
            {chip.label}
          </GluuBadge>
        )

        return chip.detail?.length ? (
          <GluuTooltip
            key={chip.kind}
            doc_entry={`anomaly_chip_${chip.kind}`}
            content={chip.detail.map((entry) => (
              <div key={entry}>{entry}</div>
            ))}
          >
            {badge}
          </GluuTooltip>
        ) : (
          <React.Fragment key={chip.kind}>{badge}</React.Fragment>
        )
      })}
    </div>
  )
}

export default React.memo(AnomalyBanner)
