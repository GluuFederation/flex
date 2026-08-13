import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Tooltip from '@mui/material/Tooltip'
import { GluuBadge } from '@/components/GluuBadge'
import { useSecurityTheme } from '../hooks'
import { useSecurityStyles } from '../SecurityMonitorPage.style'
import { SIEGE_CHIP_LIMIT, THREAT_LEVELS } from '../constants'
import { countByThreatLevel, getBadgeBackground, getSecurityPalette } from '../utils'
import KpiDeltaLabel from './KpiDeltaLabel'
import type { SecurityKpiStripProps } from '../types'

const SecurityKpiStrip: React.FC<SecurityKpiStripProps> = ({
  summary,
  usersUnderSiege,
  period,
}) => {
  const { t } = useTranslation()
  const { themeColors, isDark } = useSecurityTheme()
  const palette = useMemo(() => getSecurityPalette(themeColors), [themeColors])
  const { classes } = useSecurityStyles({ isDark, themeColors })

  const criticalCount = useMemo(
    () => countByThreatLevel(usersUnderSiege, THREAT_LEVELS.CRITICAL),
    [usersUnderSiege],
  )

  const chipUsers = usersUnderSiege.slice(0, SIEGE_CHIP_LIMIT)
  const overflowCount = usersUnderSiege.length - chipUsers.length
  const allUsernames = useMemo(
    () => usersUnderSiege.map((stat) => stat.username).join(', '),
    [usersUnderSiege],
  )

  const anomalyDelta = summary.anomaliesDelta[period]
  const failureDelta = summary.failureDelta[period]
  const successDelta = summary.successRateDelta[period]

  const anomalyCount = summary.anomalies[period]
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
        <p className={classes.kpiLabel}>{t('fields.auth_failures_drop_off')}</p>
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
          style={{ color: alertColor(usersUnderSiege.length, palette.chart.suspicious) }}
        >
          {usersUnderSiege.length.toLocaleString()}
        </p>
        <p className={classes.kpiCaption}>
          {t('fields.suspicious_ips_breakdown', {
            critical: criticalCount,
            warning: usersUnderSiege.length - criticalCount,
          })}
        </p>
        <Tooltip title={allUsernames} arrow>
          <div className={classes.kpiChips}>
            {chipUsers.map((stat) => (
              <GluuBadge
                key={stat.username}
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
                {stat.username}
              </GluuBadge>
            ))}
            {overflowCount > 0 && (
              <GluuBadge
                pill
                backgroundColor={palette.statusBg.active}
                textColor={palette.chart.suspicious}
              >
                {t('fields.siege_overflow', { total: overflowCount })}
              </GluuBadge>
            )}
          </div>
        </Tooltip>
      </div>
    </div>
  )
}

export default React.memo(SecurityKpiStrip)
