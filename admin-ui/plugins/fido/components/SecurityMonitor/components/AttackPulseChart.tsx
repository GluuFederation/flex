import React, { useMemo } from 'react'
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useTranslation } from 'react-i18next'
import useMediaQuery from '@mui/material/useMediaQuery'
import { MEDIA_QUERY_OPTIONS, MOBILE_MEDIA_QUERY } from '@/constants'
import { useChartTheme } from '@/hooks/useChartTheme'
import { CHART_EMPTY_INSET, SPIKE_LINE_DOT_RADIUS } from '../constants'
import {
  buildCountAxis,
  buildHourScaffold,
  findPeakSpike,
  getSecurityPalette,
  spikeRatio,
} from '../utils'
import { useSecurityStyles } from '../SecurityMonitorPage.style'
import SecurityChartCard from './SecurityChartCard'
import type { FailureSpikeTimelineProps } from '../types'
import {
  AxisStartTick,
  DESKTOP_CHART_GEOMETRY,
  MOBILE_CHART_GEOMETRY,
  RECHARTS_INITIAL_DIMENSION,
  getFullscreenCanvasStyle,
} from 'Plugins/fido/shared/charts'

const SPIKE_ACTIVE_DOT = { r: SPIKE_LINE_DOT_RADIUS + 1 }

const AXIS_EMPTY_INSET = {
  top: CHART_EMPTY_INSET.TOP_MARGIN,
  bottom: CHART_EMPTY_INSET.AXIS_HEIGHT,
  left: CHART_EMPTY_INSET.AXIS_WIDTH,
}

const AttackPulseChart: React.FC<FailureSpikeTimelineProps> = ({ series }) => {
  const { t } = useTranslation()
  const { themeColors, isDark, gridProps, axisTick, renderTooltip } = useChartTheme()
  const { classes } = useSecurityStyles({ isDark, themeColors })
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY, MEDIA_QUERY_OPTIONS)
  const chartGeometry = isMobile ? MOBILE_CHART_GEOMETRY : DESKTOP_CHART_GEOMETRY
  const chartTick = useMemo(
    () => ({ ...axisTick, fontSize: chartGeometry.TICK_FONT_SIZE }),
    [axisTick, chartGeometry.TICK_FONT_SIZE],
  )
  const axisStartTick = useMemo(
    () => <AxisStartTick fill={chartTick.fill} fontSize={chartTick.fontSize} />,
    [chartTick],
  )
  const palette = useMemo(() => getSecurityPalette(themeColors), [themeColors])

  const spikeDot = useMemo(
    () => ({ r: SPIKE_LINE_DOT_RADIUS, fill: palette.chart.failures, strokeWidth: 0 }),
    [palette.chart.failures],
  )

  const peak = useMemo(() => findPeakSpike(series), [series])

  const legend = useMemo(
    () => [
      { label: t('fields.auth_failures'), color: palette.chart.failures },
      { label: t('fields.agg_auth_attempts'), color: palette.chart.attempts },
      { label: t('fields.rolling_baseline'), color: palette.chart.baseline },
    ],
    [t, palette.chart],
  )

  const isEmpty = series.length === 0
  const chartData = useMemo(() => (isEmpty ? buildHourScaffold() : [...series]), [series, isEmpty])

  const countAxis = useMemo(
    () =>
      buildCountAxis(
        chartData.reduce(
          (max, point) => Math.max(max, point.failures, point.attempts, point.baseline),
          0,
        ),
      ),
    [chartData],
  )

  return (
    <SecurityChartCard
      title={t('titles.attack_pulse')}
      subtitle={t('fields.attack_pulse_subtitle')}
      statusLabel={
        peak ? t('fields.spike_alert', { ratio: spikeRatio(peak), hour: peak.label }) : undefined
      }
      accentColor={peak ? palette.chart.failures : undefined}
      legend={legend}
      isEmpty={isEmpty}
      emptyLabel={t('fields.no_data')}
      emptyInset={AXIS_EMPTY_INSET}
    >
      {(isFullscreen, zoom) => (
        <div
          className={isFullscreen ? classes.chartFullscreenFrame : undefined}
          data-chart-frame={isFullscreen ? true : undefined}
        >
          <div className={classes.chartCanvas} style={getFullscreenCanvasStyle(isFullscreen, zoom)}>
            <ResponsiveContainer
              width="100%"
              height="100%"
              initialDimension={RECHARTS_INITIAL_DIMENSION}
            >
              <ComposedChart data={chartData} margin={chartGeometry.LINE_MARGIN_FLUSH}>
                <CartesianGrid {...gridProps} />
                <XAxis
                  dataKey="label"
                  tick={chartTick}
                  interval="preserveStartEnd"
                  minTickGap={chartGeometry.TICK_MIN_GAP}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={axisStartTick}
                  width={chartGeometry.AXIS_WIDTH}
                  allowDecimals={false}
                  domain={countAxis.domain}
                  ticks={countAxis.ticks}
                  axisLine={false}
                  tickLine={false}
                />
                {isEmpty ? null : <Tooltip content={renderTooltip} />}
                <Line
                  type="monotone"
                  dataKey="failures"
                  name={t('fields.auth_failures')}
                  stroke={palette.chart.failures}
                  dot={spikeDot}
                  activeDot={SPIKE_ACTIVE_DOT}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="attempts"
                  name={t('fields.agg_auth_attempts')}
                  stroke={palette.chart.attempts}
                  dot={false}
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
        </div>
      )}
    </SecurityChartCard>
  )
}

export default React.memo(AttackPulseChart)
