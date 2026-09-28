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
import useMediaQuery from '@mui/material/useMediaQuery'
import { MEDIA_QUERY_OPTIONS, MOBILE_MEDIA_QUERY } from '@/constants'
import { useChartTheme } from '@/hooks/useChartTheme'
import {
  CHART_EMPTY_INSET,
  CHART_PERCENT_DOMAIN,
  CHART_PERCENT_TICKS,
  DROP_OFF_ALERT_RATE,
  SECURITY_CHART_FILL_OPACITY,
} from '../constants'
import { buildDropOffScaffold, findDropOffPeak, getSecurityPalette } from '../utils'
import { useSecurityStyles } from '../SecurityMonitorPage.style'
import SecurityChartCard from './SecurityChartCard'
import type { DropOffChartProps } from '../types'
import {
  AxisStartTick,
  DESKTOP_CHART_GEOMETRY,
  MOBILE_CHART_GEOMETRY,
  RECHARTS_INITIAL_DIMENSION,
  getFullscreenCanvasStyle,
} from 'Plugins/fido/shared/charts'

const AXIS_EMPTY_INSET = {
  top: CHART_EMPTY_INSET.TOP_MARGIN,
  bottom: CHART_EMPTY_INSET.AXIS_HEIGHT,
  left: CHART_EMPTY_INSET.AXIS_WIDTH,
}

const SessionIntegrityChart: React.FC<DropOffChartProps> = ({ series }) => {
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

  const peak = useMemo(() => findDropOffPeak(series), [series])
  const hasAlert = !!peak && peak.dropOffRate >= DROP_OFF_ALERT_RATE

  const legend = useMemo(
    () => [
      { label: t('fields.success'), color: palette.chart.success },
      { label: t('fields.failure'), color: palette.chart.failureBand },
      { label: t('fields.drop_off'), color: palette.chart.dropOff },
    ],
    [t, palette.chart],
  )

  const isEmpty = series.length === 0
  const chartData = useMemo(
    () => (isEmpty ? buildDropOffScaffold() : [...series]),
    [series, isEmpty],
  )

  return (
    <SecurityChartCard
      title={t('titles.session_integrity_monitor')}
      subtitle={t('fields.session_integrity_subtitle')}
      statusLabel={
        hasAlert && peak
          ? t('fields.drop_off_alert', { rate: peak.dropOffRate, day: peak.label })
          : undefined
      }
      statusColor={palette.chart.suspicious}
      accentColor={hasAlert ? palette.chart.suspicious : undefined}
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
              <AreaChart data={chartData} margin={chartGeometry.LINE_MARGIN_FLUSH}>
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
                  domain={CHART_PERCENT_DOMAIN}
                  ticks={CHART_PERCENT_TICKS}
                  tick={axisStartTick}
                  width={chartGeometry.AXIS_WIDTH}
                  axisLine={false}
                  tickLine={false}
                />
                {isEmpty ? null : <Tooltip content={renderTooltip} />}
                <Area
                  type="monotone"
                  stackId="rates"
                  dataKey="successRate"
                  name={t('fields.success')}
                  stroke={palette.chart.success}
                  fill={palette.chart.success}
                  fillOpacity={SECURITY_CHART_FILL_OPACITY}
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  stackId="rates"
                  dataKey="failureRate"
                  name={t('fields.failure')}
                  stroke={palette.chart.failureBand}
                  fill={palette.chart.failureBand}
                  fillOpacity={SECURITY_CHART_FILL_OPACITY}
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  stackId="rates"
                  dataKey="dropOffRate"
                  name={t('fields.drop_off')}
                  stroke={palette.chart.dropOff}
                  fill={palette.chart.dropOff}
                  fillOpacity={SECURITY_CHART_FILL_OPACITY}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </SecurityChartCard>
  )
}

export default React.memo(SessionIntegrityChart)
