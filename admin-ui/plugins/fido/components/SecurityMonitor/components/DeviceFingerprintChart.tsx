import React, { useMemo } from 'react'
import {
  AreaChart,
  Area,
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
import { getSecurityPalette } from '../utils'
import SecurityChartCard from './SecurityChartCard'
import type { DeviceShiftChartProps } from '../types'

const PERCENT_DOMAIN: [number, number] = [0, 100]

const DeviceFingerprintChart: React.FC<DeviceShiftChartProps> = ({ trend }) => {
  const { t } = useTranslation()
  const { themeColors, gridProps, axisTick, renderTooltip } = useChartTheme()
  const palette = useMemo(() => getSecurityPalette(themeColors), [themeColors])

  const legend = useMemo(
    () => [
      { label: t('fields.platform'), color: palette.chart.platform },
      { label: t('fields.cross_platform'), color: palette.chart.crossPlatform },
    ],
    [t, palette.chart],
  )

  const chartData = useMemo(() => [...trend.points], [trend.points])

  return (
    <SecurityChartCard
      title={t('titles.device_fingerprint_shift')}
      subtitle={t('fields.device_fingerprint_subtitle')}
      statusLabel={
        trend.shiftDayLabel ? t('fields.shift_detected', { day: trend.shiftDayLabel }) : undefined
      }
      statusColor={palette.chart.platform}
      legend={legend}
      isEmpty={trend.points.length === 0}
      emptyLabel={t('fields.no_data')}
    >
      <div style={{ width: '100%', height: SECURITY_CHART_HEIGHT }}>
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={RECHARTS_INITIAL_DIMENSION}
        >
          <AreaChart data={chartData} margin={{ top: 12, right: 16, bottom: 8, left: 0 }}>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="label" tick={axisTick} />
            <YAxis domain={PERCENT_DOMAIN} tick={axisTick} />
            <Tooltip content={renderTooltip} />
            <Area
              type="monotone"
              stackId="devices"
              dataKey="platform"
              name={t('fields.platform')}
              stroke={palette.chart.platform}
              fill={palette.chart.platform}
              fillOpacity={SECURITY_CHART_FILL_OPACITY}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              stackId="devices"
              dataKey="crossPlatform"
              name={t('fields.cross_platform')}
              stroke={palette.chart.crossPlatform}
              fill={palette.chart.crossPlatform}
              fillOpacity={SECURITY_CHART_FILL_OPACITY}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </SecurityChartCard>
  )
}

export default React.memo(DeviceFingerprintChart)
