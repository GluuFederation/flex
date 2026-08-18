import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import SecurityInfoTooltip from './SecurityInfoTooltip'
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
    () => usersUnderSiege.map((stat) => <div key={stat.username}>{stat.username}</div>),
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
        <KpiDeltaLabel
          delta={anomalyDelta}
          label={t('fields.delta_vs_previous')}
          hint={t('fields.delta_anomalies_hint')}
        />
      </div>

      <div className={classes.kpiCard}>
        <p className={classes.kpiLabel}>{t('fields.auth_failures_drop_off')}</p>
        <p
          className={classes.kpiValue}
          style={{ color: alertColor(failureCount, palette.chart.failures) }}
        >
          {failureCount.toLocaleString()}
        </p>
        <KpiDeltaLabel
          delta={failureDelta}
          label={t('fields.delta_vs_baseline')}
          hint={t('fields.delta_failures_hint')}
        />
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
        <KpiDeltaLabel
          delta={successDelta}
          label={t('fields.delta_vs_previous')}
          increaseIsGood
          hint={t('fields.delta_success_rate_hint')}
        />
      </div>

      <div className={classes.kpiCard}>
        <p className={classes.kpiLabel}>{t('fields.users_under_siege')}</p>
        <p
          className={classes.kpiValue}
          style={{ color: alertColor(usersUnderSiege.length, palette.chart.suspicious) }}
        >
          {usersUnderSiege.length.toLocaleString()}
        </p>
        <div className={classes.kpiDeltaRow}>
          <SecurityInfoTooltip title={allUsernames}>
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
                {overflowCount > 0
                  ? t('fields.siege_summary', { username: stat.username, total: overflowCount })
                  : stat.username}
              </GluuBadge>
            ))}
          </SecurityInfoTooltip>
          <SecurityInfoTooltip title={t('fields.users_under_siege_breakdown_hint')}>
            <span className={classes.kpiCaption}>
              {t('fields.users_under_siege_breakdown', {
                critical: criticalCount,
                warning: usersUnderSiege.length - criticalCount,
              })}
            </span>
          </SecurityInfoTooltip>
        </div>
      </div>
    </div>
  )
}

export default React.memo(SecurityKpiStrip)
