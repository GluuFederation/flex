import React, { useMemo } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
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
import { SERIES_KEYS } from '../hooks'
import { AXIS_KEYS, SPARSE_SERIES_MAX_POINTS } from '../constants'
import { getSeriesColors } from '../utils'
import { useAuthMetricsStyles } from '../AuthMetricsPage.style'
import type { MetricChartRow } from '../types'

type AuthActivityChartProps = {
  rows: MetricChartRow[]
}

const AuthActivityChart: React.FC<AuthActivityChartProps> = ({ rows }) => {
  const { t } = useTranslation()
  const { themeColors, isDark, gridProps, axisTick, renderTooltip } = useChartTheme()
  const { classes } = useAuthMetricsStyles({ isDark, themeColors })
  const palette = useMemo(() => getSeriesColors(themeColors), [themeColors])

  const legend = useMemo(
    () => [
      { label: t('fields.auth_success'), color: palette.success },
      { label: t('fields.auth_failure'), color: palette.failure },
    ],
    [t, palette],
  )

  const countAxis = useMemo(
    () =>
      buildCountAxis(
        rows.reduce(
          (max, row) =>
            Math.max(max, Number(row[SERIES_KEYS.SUCCESS]), Number(row[SERIES_KEYS.FAILURE])),
          0,
        ),
      ),
    [rows],
  )

  const isEmpty = rows.length === 0

  // A coarse bucket can leave a handful of points, and ALL leaves exactly one. An unmarked lone
  // point draws nothing at all, so markers come back once the series is sparse enough to need them.
  const dot = rows.length <= SPARSE_SERIES_MAX_POINTS && { r: 3 }

  return (
    <SecurityChartCard
      title={t('titles.auth_activity')}
      subtitle={t('fields.auth_activity_subtitle')}
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
          <LineChart data={rows} margin={{ top: 12, right: 16, bottom: 8, left: 0 }}>
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
            <Line
              type="monotone"
              dataKey={SERIES_KEYS.SUCCESS}
              name={t('fields.auth_success')}
              stroke={palette.success}
              dot={dot}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey={SERIES_KEYS.FAILURE}
              name={t('fields.auth_failure')}
              stroke={palette.failure}
              dot={dot}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </SecurityChartCard>
  )
}

export default React.memo(AuthActivityChart)
