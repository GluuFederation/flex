import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { GluuBadge } from '@/components/GluuBadge'
import { useSecurityTheme } from '../hooks'
import { useSecurityStyles } from '../SecurityMonitorPage.style'
import { KPI_PERIOD_GRANULARITY, THREAT_LEVELS } from '../constants'
import { countByThreatLevel, getBadgeBackground, getSecurityPalette } from '../utils'
import KpiDeltaLabel from './KpiDeltaLabel'
import type { SecurityKpiStripProps } from '../types'

const SecurityKpiStrip: React.FC<SecurityKpiStripProps> = ({ summary, suspiciousIps, period }) => {
  const { t } = useTranslation()
  const { themeColors, isDark } = useSecurityTheme()
  const palette = useMemo(() => getSecurityPalette(themeColors), [themeColors])
  const { classes } = useSecurityStyles({ isDark, themeColors })

  const anomalyGranularity = KPI_PERIOD_GRANULARITY[period]

  const criticalCount = useMemo(
    () => countByThreatLevel(suspiciousIps, THREAT_LEVELS.CRITICAL),
    [suspiciousIps],
  )

  const anomalyDelta = summary.anomaliesDelta[anomalyGranularity]
  const failureDelta = summary.failureDelta[period]
  const successDelta = summary.successRateDelta[period]

  const anomalyCount = summary.anomalies[anomalyGranularity]
  const failureCount = summary.failures[period]
  const successRate = summary.successRate[period]

  const alertColor = (value: number, activeColor: string) =>
    value > 0 ? activeColor : themeColors.fontColor

  return (
    <div className={classes.kpiGrid}>
      <div className={classes.kpiCard}>
        <p className={classes.kpiLabel}>{t('fields.anomalies_captured')}</p>
        <p
          className={classes.kpiValue}
          style={{ color: alertColor(anomalyCount, palette.chart.failures) }}
        >
          {anomalyCount.toLocaleString()}
        </p>
        <KpiDeltaLabel delta={anomalyDelta} label={t('fields.delta_vs_previous')} />
      </div>

      <div className={classes.kpiCard}>
        <p className={classes.kpiLabel}>{t('fields.auth_failures')}</p>
        <p
          className={classes.kpiValue}
          style={{ color: alertColor(failureCount, palette.chart.failures) }}
        >
          {failureCount.toLocaleString()}
        </p>
        <KpiDeltaLabel delta={failureDelta} label={t('fields.delta_vs_baseline')} />
      </div>

      <div className={classes.kpiCard}>
        <p className={classes.kpiLabel}>{t('fields.auth_success_rate')}</p>
        <p
          className={classes.kpiValue}
          style={{ color: alertColor(successRate, palette.chart.success) }}
        >
          {successRate}
          <span className={classes.kpiValueUnit}>%</span>
        </p>
        <KpiDeltaLabel delta={successDelta} label={t('fields.delta_vs_previous')} increaseIsGood />
      </div>

      <div className={classes.kpiCard}>
        <p className={classes.kpiLabel}>{t('fields.suspicious_ips')}</p>
        <p
          className={classes.kpiValue}
          style={{ color: alertColor(suspiciousIps.length, palette.chart.suspicious) }}
        >
          {suspiciousIps.length.toLocaleString()}
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
              backgroundColor={getBadgeBackground(
                palette.threatLevels[stat.threatLevel],
                isDark,
                stat.threatLevel === THREAT_LEVELS.CRITICAL
                  ? palette.statusBg.inactive
                  : palette.statusBg.active,
              )}
              textColor={palette.threatLevels[stat.threatLevel]}
            >
              {stat.ipAddress}
            </GluuBadge>
          ))}
        </div>
      </div>
    </div>
  )
}

export default React.memo(SecurityKpiStrip)
