import React, { useMemo } from 'react'
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useTranslation } from 'react-i18next'
import { useChartTheme } from '@/hooks/useChartTheme'
import { RECHARTS_INITIAL_DIMENSION } from '../../Metrics/constants'
import { SECURITY_CHART_FILL_OPACITY, SECURITY_CHART_HEIGHT } from '../constants'
import { findPeakSpike, getSecurityPalette, spikeRatio } from '../utils'
import SecurityChartCard from './SecurityChartCard'
import type { FailureSpikeTimelineProps } from '../types'

const AttackPulseChart: React.FC<FailureSpikeTimelineProps> = ({ series }) => {
  const { t } = useTranslation()
  const { themeColors, gridProps, axisTick, renderTooltip } = useChartTheme()
  const palette = useMemo(() => getSecurityPalette(themeColors), [themeColors])

  const peak = useMemo(() => findPeakSpike(series), [series])

  const legend = useMemo(
    () => [
      { label: t('fields.auth_failures'), color: palette.chart.failures },
      { label: t('fields.rolling_baseline'), color: palette.chart.baseline },
    ],
    [t, palette.chart],
  )

  const chartData = useMemo(() => [...series], [series])

  return (
    <SecurityChartCard
      title={t('titles.attack_pulse')}
      subtitle={t('fields.attack_pulse_subtitle')}
      statusLabel={
        peak ? t('fields.spike_alert', { ratio: spikeRatio(peak), hour: peak.label }) : undefined
      }
      accentColor={peak ? palette.chart.failures : undefined}
      legend={legend}
      isEmpty={series.length === 0}
      emptyLabel={t('fields.no_data')}
    >
      <div style={{ width: '100%', height: SECURITY_CHART_HEIGHT }}>
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={RECHARTS_INITIAL_DIMENSION}
        >
          <ComposedChart data={chartData} margin={{ top: 12, right: 16, bottom: 8, left: 0 }}>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="label" tick={axisTick} interval={0} minTickGap={4} />
            <YAxis tick={axisTick} allowDecimals={false} />
            <Tooltip content={renderTooltip} />
            <Area
              type="monotone"
              dataKey="failures"
              name={t('fields.auth_failures')}
              stroke={palette.chart.failures}
              fill={palette.chart.failures}
              fillOpacity={SECURITY_CHART_FILL_OPACITY}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="baseline"
              name={t('fields.rolling_baseline')}
              stroke={palette.chart.baseline}
              strokeDasharray="6 4"
              dot={false}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </SecurityChartCard>
  )
}

export default React.memo(AttackPulseChart)
