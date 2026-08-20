import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useChartTheme } from '@/hooks/useChartTheme'
import { getSeriesColors } from '../utils'
import { useAuthMetricsStyles } from '../AuthMetricsPage.style'

type AuthMetricsKpiStripProps = {
  totals: {
    attempts: number
    success: number
    failure: number
    successRate: number | null
    acrCount: number
  }
}

const AuthMetricsKpiStrip: React.FC<AuthMetricsKpiStripProps> = ({ totals }) => {
  const { t } = useTranslation()
  const { themeColors, isDark } = useChartTheme()
  const { classes } = useAuthMetricsStyles({ isDark, themeColors })
  const palette = useMemo(() => getSeriesColors(themeColors), [themeColors])

  // An unknown rate is shown as a dash: printing 0% with no attempts recorded would read as
  // every authentication having failed.
  const successRateLabel = totals.successRate === null ? '—' : `${totals.successRate.toFixed(1)}%`

  const cards = [
    { label: t('fields.auth_attempts'), value: totals.attempts.toLocaleString() },
    {
      label: t('fields.auth_success'),
      value: totals.success.toLocaleString(),
      color: palette.success,
    },
    {
      label: t('fields.auth_failure'),
      value: totals.failure.toLocaleString(),
      color: totals.failure > 0 ? palette.failure : undefined,
    },
    { label: t('fields.auth_success_rate'), value: successRateLabel },
    { label: t('fields.acr_in_use'), value: totals.acrCount.toLocaleString() },
  ]

  return (
    <div className={classes.kpiGrid}>
      {cards.map((card) => (
        <div key={card.label} className={classes.kpiCard}>
          <p className={classes.kpiLabel}>{card.label}</p>
          <p className={classes.kpiValue} style={card.color ? { color: card.color } : undefined}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  )
}

export default React.memo(AuthMetricsKpiStrip)
