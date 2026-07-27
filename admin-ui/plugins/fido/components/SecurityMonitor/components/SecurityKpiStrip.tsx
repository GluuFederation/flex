import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { GluuBadge } from '@/components/GluuBadge'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { useSecurityStyles } from '../SecurityMonitorPage.style'
import { KPI_PERIOD_GRANULARITY, THREAT_LEVELS } from '../constants'
import { countByThreatLevel, getSecurityPalette } from '../utils'
import type { KpiDeltaLabelProps, SecurityKpiStripProps } from '../types'

const DeltaLabel: React.FC<KpiDeltaLabelProps> = ({ delta, label, className, arrowClassName }) => (
  <p className={className}>
    <span className={arrowClassName}>{delta.isIncrease ? '↑' : '↓'}</span> {label}
  </p>
)

const SecurityKpiStrip: React.FC<SecurityKpiStripProps> = ({ summary, suspiciousIps, period }) => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const themeColors = useMemo(() => getThemeColor(state.theme), [state.theme])
  const palette = useMemo(() => getSecurityPalette(themeColors), [themeColors])
  const isDark = state.theme === THEME_DARK
  const { classes } = useSecurityStyles({ isDark, themeColors })

  const anomalyGranularity = KPI_PERIOD_GRANULARITY[period]

  const criticalCount = useMemo(
    () => countByThreatLevel(suspiciousIps, THREAT_LEVELS.CRITICAL),
    [suspiciousIps],
  )

  const anomalyDelta = summary.anomaliesDelta[anomalyGranularity]
  const failureDelta = summary.failureDelta[period]
  const successDelta = summary.successRateDelta[period]

  return (
    <div className={classes.kpiGrid}>
      <div className={classes.kpiCard}>
        <p className={classes.kpiLabel}>{t('fields.anomalies_captured')}</p>
        <p className={classes.kpiValue} style={{ color: palette.chart.failures }}>
          {summary.anomalies[anomalyGranularity]}
        </p>
        <DeltaLabel
          delta={anomalyDelta}
          className={classes.kpiCaption}
          arrowClassName={classes.kpiDeltaArrow}
          label={t('fields.delta_vs_previous', { value: anomalyDelta.value })}
        />
      </div>

      <div className={classes.kpiCard}>
        <p className={classes.kpiLabel}>{t('fields.auth_failures')}</p>
        <p className={classes.kpiValue} style={{ color: palette.chart.failures }}>
          {summary.failures[period].toLocaleString()}
        </p>
        <DeltaLabel
          delta={failureDelta}
          className={classes.kpiCaption}
          arrowClassName={classes.kpiDeltaArrow}
          label={t('fields.delta_vs_baseline', { value: `${failureDelta.value}%` })}
        />
      </div>

      <div className={classes.kpiCard}>
        <p className={classes.kpiLabel}>{t('fields.suspicious_ips')}</p>
        <p className={classes.kpiValue} style={{ color: palette.chart.suspicious }}>
          {suspiciousIps.length}
        </p>
        <p className={classes.kpiCaption}>
          {t('fields.suspicious_ips_breakdown', {
            critical: criticalCount,
            warning: suspiciousIps.length - criticalCount,
          })}
        </p>
        <div className={classes.kpiChips}>
          {suspiciousIps.slice(0, 3).map((stat) => (
            <GluuBadge
              key={stat.ipAddress}
              pill
              backgroundColor={
                stat.threatLevel === THREAT_LEVELS.CRITICAL
                  ? palette.statusBg.inactive
                  : palette.statusBg.active
              }
              textColor={palette.threatLevels[stat.threatLevel]}
            >
              {stat.ipAddress}
            </GluuBadge>
          ))}
        </div>
      </div>

      <div className={classes.kpiCard}>
        <p className={classes.kpiLabel}>{t('fields.auth_success_rate')}</p>
        <p className={classes.kpiValue} style={{ color: palette.chart.success }}>
          {summary.successRate[period]}%
        </p>
        <DeltaLabel
          delta={successDelta}
          className={classes.kpiCaption}
          arrowClassName={classes.kpiDeltaArrow}
          label={t('fields.delta_points_vs_previous', { value: successDelta.value })}
        />
      </div>
    </div>
  )
}

export default React.memo(SecurityKpiStrip)
