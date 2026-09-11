import React, { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import useMediaQuery from '@mui/material/useMediaQuery'
import { MEDIA_QUERY_OPTIONS, MOBILE_MEDIA_QUERY, TABLET_MAX_MEDIA_QUERY } from '@/constants'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import TooltipDesign from '@/routes/Dashboards/Chart/TooltipDesign'
import type { TooltipPayloadItem } from '@/routes/Dashboards/types'
import { useMetricsStyles } from '../MetricsPage.style'
import {
  ACTIVITY_DENSE_BUCKET_COUNT,
  ACTIVITY_COMPACT_DENSE_BUCKET_COUNT,
  ACTIVITY_MOBILE_DENSE_BUCKET_COUNT,
  ACTIVITY_MIN_BUCKET_WIDTH,
  ACTIVITY_LINE_AXIS_PADDING,
  ACTIVITY_LINE_DOT_RADIUS,
  ACTIVITY_LINE_MAX_DOTS,
  ACTIVITY_LINE_STROKE_WIDTH,
  ACTIVITY_TREND_SERIES_COLORS,
  RECHARTS_INITIAL_DIMENSION,
  METRICS_CHART_HEIGHT,
  METRICS_DESKTOP_CHART,
  METRICS_MOBILE_CHART,
} from '../constants'
import { formatCompactNumber } from '../utils'
import type { ActivityChartProps, ActivityDataPoint } from '../types'
import MetricsChartCard from './MetricsChartCard'
import ChartLegend from './ChartLegend'

type TickProps = {
  x?: number | string
  y?: number | string
  payload?: { value: string }
}

const MultiLineTick = ({
  x = 0,
  y = 0,
  payload,
  fill,
  fontSize = 12,
}: TickProps & { fill: string; fontSize?: number }): ReactNode => {
  const lines = (payload?.value ?? '').split('\n')
  return (
    <g transform={`translate(${x},${y})`}>
      {lines.map((line, i) => (
        <text
          key={i}
          x={0}
          y={0}
          dy={i === 0 ? 12 : 12 + i * 14}
          textAnchor="middle"
          fill={fill}
          fontSize={fontSize}
        >
          {line}
        </text>
      ))}
    </g>
  )
}

// Same series as ActivityBarChart, drawn as trend lines: the bars answer "how much in this
// bucket", the lines answer "which way is it heading across buckets".
const COMPACT_MAX_TICKS = 4

const ActivityLineChart: React.FC<ActivityChartProps> = ({
  title,
  caption,
  data,
  height = METRICS_CHART_HEIGHT.DESKTOP,
}) => {
  const { t } = useTranslation()
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY, MEDIA_QUERY_OPTIONS)
  const isCompact = useMediaQuery(TABLET_MAX_MEDIA_QUERY, MEDIA_QUERY_OPTIONS)
  const chartGeometry = isMobile ? METRICS_MOBILE_CHART : METRICS_DESKTOP_CHART
  const { state } = useTheme()
  const themeColors = useMemo(() => getThemeColor(state.theme), [state.theme])
  const isDark = state.theme === THEME_DARK
  const { classes } = useMetricsStyles({ isDark, themeColors })

  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card?.background
  const gridColor = themeColors.chart.gridColor
  const axisColor = themeColors.fontColor

  const hasMultiLineLabel = useMemo(() => data.some((d) => d.label.includes('\n')), [data])

  const showDots = data.length <= ACTIVITY_LINE_MAX_DOTS

  const series = useMemo(
    () =>
      [
        { key: 'authAttempts', name: t('fields.agg_auth_attempts') },
        { key: 'authSuccess', name: t('fields.agg_auth_success') },
        { key: 'authFailed', name: t('fields.agg_auth_failed') },
      ] as const,
    [t],
  )

  const denseBucketCount = isMobile
    ? ACTIVITY_MOBILE_DENSE_BUCKET_COUNT
    : isCompact
      ? ACTIVITY_COMPACT_DENSE_BUCKET_COUNT
      : ACTIVITY_DENSE_BUCKET_COUNT
  const isDense = data.length > denseBucketCount
  const cardTickInterval =
    isCompact && !isDense ? Math.max(0, Math.ceil(data.length / COMPACT_MAX_TICKS) - 1) : 0
  const tickFontSize = isCompact
    ? METRICS_MOBILE_CHART.TICK_FONT_SIZE
    : chartGeometry.TICK_FONT_SIZE

  const minBucketWidth = isMobile
    ? ACTIVITY_MIN_BUCKET_WIDTH.MOBILE
    : isCompact
      ? ACTIVITY_MIN_BUCKET_WIDTH.COMPACT
      : ACTIVITY_MIN_BUCKET_WIDTH.DESKTOP
  const scrollWidth = data.length > 0 ? data.length * minBucketWidth : undefined

  const legendItems = useMemo(
    () =>
      series.map((line) => ({
        key: line.key,
        color: ACTIVITY_TREND_SERIES_COLORS[line.key],
        label: line.name,
      })),
    [series],
  )

  const chartLegend = <ChartLegend items={legendItems} />

  const renderChart = (isFullscreen: boolean, zoom: number) => (
    <div
      className={isFullscreen ? classes.chartFullscreenFrame : classes.chartScrollArea}
      data-chart-frame={isFullscreen ? true : undefined}
    >
      <div
        style={
          isFullscreen
            ? {
                width: scrollWidth ? scrollWidth * zoom : `${zoom * 100}%`,
                minWidth: '100%',
                flexShrink: 0,
              }
            : scrollWidth
              ? { width: scrollWidth, minWidth: '100%' }
              : undefined
        }
      >
        <ResponsiveContainer
          key={`${isMobile}-${isCompact}-${isDense}-${isFullscreen}`}
          width="100%"
          height={
            isFullscreen
              ? METRICS_CHART_HEIGHT.FULLSCREEN * zoom
              : isCompact
                ? METRICS_CHART_HEIGHT.COMPACT
                : height
          }
          initialDimension={RECHARTS_INITIAL_DIMENSION}
        >
          <LineChart data={data as ActivityDataPoint[]} margin={chartGeometry.LINE_MARGIN}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              // Tight like a time series, but with just enough gutter that the first and last
              // tick labels stay inside the card instead of being clipped by its edge.
              padding={ACTIVITY_LINE_AXIS_PADDING}
              interval={cardTickInterval}
              height={hasMultiLineLabel ? 50 : 30}
              tick={(props: TickProps) => (
                <MultiLineTick {...props} fill={axisColor} fontSize={tickFontSize} />
              )}
            />
            <YAxis
              tick={{ fill: axisColor, fontSize: tickFontSize }}
              axisLine={false}
              tickLine={false}
              width={chartGeometry.AXIS_WIDTH}
              allowDecimals={false}
              tickFormatter={isCompact ? formatCompactNumber : undefined}
            />
            <Tooltip
              cursor={false}
              content={({ payload, active }) => (
                <TooltipDesign
                  payload={payload as ReadonlyArray<TooltipPayloadItem> | undefined}
                  active={active}
                  backgroundColor={cardBg}
                  textColor={themeColors.fontColor}
                  isDark={isDark}
                />
              )}
            />
            {series.map((line) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                name={line.name}
                stroke={ACTIVITY_TREND_SERIES_COLORS[line.key]}
                strokeWidth={ACTIVITY_LINE_STROKE_WIDTH}
                dot={
                  showDots
                    ? {
                        r: ACTIVITY_LINE_DOT_RADIUS,
                        fill: ACTIVITY_TREND_SERIES_COLORS[line.key],
                        strokeWidth: 0,
                      }
                    : false
                }
                activeDot={{ r: ACTIVITY_LINE_DOT_RADIUS + 2 }}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )

  return (
    <MetricsChartCard title={title} caption={caption} zoomable isEmpty={data.length === 0}>
      {(isFullscreen, zoom) => (
        <>
          {renderChart(isFullscreen, zoom)}
          {chartLegend}
        </>
      )}
    </MetricsChartCard>
  )
}

export default React.memo(ActivityLineChart)
