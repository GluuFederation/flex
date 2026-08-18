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
import {
  CHART_EMPTY_INSET,
  CHART_PERCENT_DOMAIN,
  CHART_PERCENT_TICKS,
  SECURITY_CHART_FILL_OPACITY,
} from '../constants'
import { buildDeviceScaffold, getSecurityPalette } from '../utils'
import { useSecurityStyles } from '../SecurityMonitorPage.style'
import SecurityChartCard from './SecurityChartCard'
import type { DeviceShiftChartProps } from '../types'

const AXIS_EMPTY_INSET = {
  top: CHART_EMPTY_INSET.TOP_MARGIN,
  bottom: CHART_EMPTY_INSET.AXIS_HEIGHT,
  left: CHART_EMPTY_INSET.AXIS_WIDTH,
}

const DeviceFingerprintChart: React.FC<DeviceShiftChartProps> = ({ trend }) => {
  const { t } = useTranslation()
  const { themeColors, isDark, gridProps, axisTick, renderTooltip } = useChartTheme()
  const { classes } = useSecurityStyles({ isDark, themeColors })
  const palette = useMemo(() => getSecurityPalette(themeColors), [themeColors])

  const legend = useMemo(
    () => [
      { label: t('fields.platform'), color: palette.chart.platform },
      { label: t('fields.cross_platform'), color: palette.chart.crossPlatform },
    ],
    [t, palette.chart],
  )

  const splitLabel = useMemo(() => {
    if (!trend.split) return undefined
    return `${t('fields.platform')} ${trend.split.platform}% · ${t('fields.cross_platform')} ${trend.split.crossPlatform}%`
  }, [trend.split, t])

  const isEmpty = trend.points.length === 0
  const chartData = useMemo(
    () => (isEmpty ? buildDeviceScaffold() : [...trend.points]),
    [trend.points, isEmpty],
  )

  return (
    <SecurityChartCard
      title={t('titles.device_fingerprint_shift')}
      subtitle={t('fields.device_fingerprint_subtitle')}
      statusLabel={
        trend.shiftDayLabel ? t('fields.shift_detected', { day: trend.shiftDayLabel }) : splitLabel
      }
      statusColor={palette.chart.platform}
      legend={legend}
      isEmpty={isEmpty}
      emptyLabel={t('fields.no_data')}
      emptyInset={AXIS_EMPTY_INSET}
    >
      <div className={classes.chartCanvas}>
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={RECHARTS_INITIAL_DIMENSION}
        >
          <AreaChart data={chartData} margin={{ top: 12, right: 16, bottom: 8, left: 0 }}>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="label" tick={axisTick} />
            <YAxis domain={CHART_PERCENT_DOMAIN} ticks={CHART_PERCENT_TICKS} tick={axisTick} />
            {isEmpty ? null : <Tooltip content={renderTooltip} />}
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
