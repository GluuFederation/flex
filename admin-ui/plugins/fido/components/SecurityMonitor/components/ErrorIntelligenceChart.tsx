import React, { useMemo } from 'react'
import { PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts'
import { useTranslation } from 'react-i18next'
import { useChartTheme } from '@/hooks/useChartTheme'
import { RECHARTS_INITIAL_DIMENSION } from '../../Metrics/constants'
import { useSecurityStyles } from '../SecurityMonitorPage.style'
import SecurityChartCard from './SecurityChartCard'
import type { ErrorCategoryChartProps } from '../types'

const ErrorIntelligenceChart: React.FC<ErrorCategoryChartProps> = ({ slices }) => {
  const { t } = useTranslation()
  const { themeColors, isDark, renderTooltip } = useChartTheme()
  const { classes } = useSecurityStyles({ isDark, themeColors })

  const legend = useMemo(
    () =>
      slices.map((slice) => ({
        label: `${slice.category} ${slice.share}%`,
        color: slice.color,
      })),
    [slices],
  )

  const isEmpty = slices.length === 0
  const chartData = useMemo(
    () =>
      isEmpty
        ? [{ category: '', count: 1, share: 0, fill: themeColors.borderColor }]
        : slices.map((slice) => ({ ...slice, fill: slice.color })),
    [slices, isEmpty, themeColors.borderColor],
  )
  const leadSlice = slices[0]

  return (
    <SecurityChartCard
      title={t('titles.error_intelligence')}
      subtitle={t('fields.error_intelligence_subtitle')}
      statusLabel={
        leadSlice
          ? t('fields.error_lead_share', { category: leadSlice.category, share: leadSlice.share })
          : undefined
      }
      legend={legend}
      isEmpty={isEmpty}
      emptyLabel={t('fields.no_data')}
      emptyCompact
    >
      <div className={classes.chartCanvas}>
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={RECHARTS_INITIAL_DIMENSION}
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius="58%"
              outerRadius="92%"
              isAnimationActive={false}
            />
            {isEmpty ? null : <Tooltip content={renderTooltip} />}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </SecurityChartCard>
  )
}

export default React.memo(ErrorIntelligenceChart)
