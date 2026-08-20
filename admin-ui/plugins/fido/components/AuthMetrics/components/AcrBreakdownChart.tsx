import React, { useMemo } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useTranslation } from 'react-i18next'
import { useChartTheme } from '@/hooks/useChartTheme'
import { RECHARTS_INITIAL_DIMENSION } from '../../Metrics/constants'
import { buildCountAxis } from '../../SecurityMonitor/utils'
import SecurityChartCard from '../../SecurityMonitor/components/SecurityChartCard'
import { AXIS_KEYS, SPARSE_SERIES_MAX_POINTS } from '../constants'
import { acrColorAt } from '../utils'
import { useAuthMetricsStyles } from '../AuthMetricsPage.style'
import type { MetricChartRow, NamedSeries } from '../types'

const AREA_FILL_OPACITY = 0.35

type AcrBreakdownChartProps = {
  rows: MetricChartRow[]
  series: NamedSeries[]
}

const AcrBreakdownChart: React.FC<AcrBreakdownChartProps> = ({ rows, series }) => {
  const { t } = useTranslation()
  const { themeColors, isDark, gridProps, axisTick, renderTooltip } = useChartTheme()
  const { classes } = useAuthMetricsStyles({ isDark, themeColors })

  const legend = useMemo(
    () =>
      series.map((entry, index) => ({
        label: entry.label ?? entry.key,
        color: acrColorAt(themeColors, index),
      })),
    [series, themeColors],
  )

  const countAxis = useMemo(
    () =>
      buildCountAxis(
        rows.reduce(
          (max, row) =>
            Math.max(
              max,
              series.reduce((total, entry) => total + Number(row[entry.key] ?? 0), 0),
            ),
          0,
        ),
      ),
    [rows, series],
  )

  const isEmpty = rows.length === 0 || series.length === 0

  const dot = rows.length <= SPARSE_SERIES_MAX_POINTS && { r: 3 }

  return (
    <SecurityChartCard
      title={t('titles.auth_by_acr')}
      subtitle={t('fields.auth_by_acr_subtitle')}
      legend={legend}
      isEmpty={isEmpty}
      emptyLabel={t('fields.no_data')}
    >
      <div className={classes.chartCanvas}>
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={RECHARTS_INITIAL_DIMENSION}
        >
          <AreaChart data={rows} margin={{ top: 12, right: 16, bottom: 8, left: 0 }}>
            <CartesianGrid {...gridProps} />
            <XAxis
              dataKey={AXIS_KEYS.LABEL}
              tick={axisTick}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <YAxis
              tick={axisTick}
              allowDecimals={false}
              domain={countAxis.domain}
              ticks={countAxis.ticks}
            />
            {isEmpty ? null : <Tooltip content={renderTooltip} />}
            {series.map((entry, index) => {
              const color = acrColorAt(themeColors, index)
              return (
                <Area
                  key={entry.key}
                  type="monotone"
                  dataKey={entry.key}
                  name={entry.label ?? entry.key}
                  stackId="acr"
                  stroke={color}
                  fill={color}
                  fillOpacity={AREA_FILL_OPACITY}
                  dot={dot}
                  isAnimationActive={false}
                />
              )
            })}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </SecurityChartCard>
  )
}

export default React.memo(AcrBreakdownChart)
