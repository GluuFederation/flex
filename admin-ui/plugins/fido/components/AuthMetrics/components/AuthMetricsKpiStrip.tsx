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
  const { t, i18n } = useTranslation()
  const { themeColors, isDark } = useChartTheme()
  const { classes } = useAuthMetricsStyles({ isDark, themeColors })
  const palette = useMemo(() => getSeriesColors(themeColors), [themeColors])

  const formatCount = useMemo(() => {
    const formatter = new Intl.NumberFormat(i18n.resolvedLanguage)
    return (value: number) => formatter.format(value)
  }, [i18n.resolvedLanguage])

  const successRateLabel = totals.successRate === null ? '—' : `${totals.successRate.toFixed(1)}%`

  const cards = [
    { label: t('fields.auth_attempts'), value: formatCount(totals.attempts) },
    {
      label: t('fields.auth_success'),
      value: formatCount(totals.success),
      color: palette.success,
    },
    {
      label: t('fields.auth_failure'),
      value: formatCount(totals.failure),
      color: totals.failure > 0 ? palette.failure : undefined,
    },
    { label: t('fields.auth_success_rate'), value: successRateLabel },
    { label: t('fields.acr_in_use'), value: formatCount(totals.acrCount) },
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
