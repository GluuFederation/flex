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
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import TooltipDesign from '@/routes/Dashboards/Chart/TooltipDesign'
import type { TooltipPayloadItem } from '@/routes/Dashboards/types'
import { getScrollCanvasStyle, useMetricsStyles } from '../MetricsPage.style'
import {
  ACTIVITY_LINE_AXIS_PADDING,
  ACTIVITY_LINE_DOT_RADIUS,
  ACTIVITY_LINE_MAX_DOTS,
  ACTIVITY_LINE_STROKE_WIDTH,
  ACTIVITY_TREND_SERIES_COLORS,
} from '../constants'
import { formatCompactNumber } from '../utils'
import type { ActivityChartProps, ActivityDataPoint } from '../types'
import {
  CHART_HEIGHT,
  ChartCard,
  ChartLegend,
  MultiLineTick,
  RECHARTS_INITIAL_DIMENSION,
} from 'Plugins/fido/shared/charts'
import type { ChartTickProps } from 'Plugins/fido/shared/charts'
import { useActivityChartGeometry } from '../hooks'

const ACTIVITY_ACTIVE_DOT = { r: ACTIVITY_LINE_DOT_RADIUS + 2 }

// Same series as ActivityBarChart, drawn as trend lines: the bars answer "how much in this
// bucket", the lines answer "which way is it heading across buckets".
const ActivityLineChart: React.FC<ActivityChartProps> = ({
  title,
  caption,
  data,
  height = CHART_HEIGHT.DESKTOP,
}) => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const themeColors = useMemo(() => getThemeColor(state.theme), [state.theme])
  const isDark = state.theme === THEME_DARK
  const { classes } = useMetricsStyles({ isDark, themeColors })

  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card?.background
  const gridColor = themeColors.chart.gridColor
  const axisColor = themeColors.fontColor

  const hasMultiLineLabel = useMemo(() => data.some((d) => d.label.includes('\n')), [data])

  const showDots = data.length <= ACTIVITY_LINE_MAX_DOTS

  const {
    isMobile,
    isCompact,
    chartGeometry,
    isDense,
    cardTickInterval,
    tickFontSize,
    axisTick,
    scrollWidth,
  } = useActivityChartGeometry(data.length, axisColor)

  const series = useMemo(
    () =>
      [
        { key: 'authAttempts', name: t('fields.agg_auth_attempts') },
        { key: 'authSuccess', name: t('fields.agg_auth_success') },
        { key: 'authFailed', name: t('fields.agg_auth_failed') },
      ] as const,
    [t],
  )

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
      <div style={getScrollCanvasStyle(isFullscreen, zoom, scrollWidth)}>
        <ResponsiveContainer
          key={`${isMobile}-${isCompact}-${isDense}-${isFullscreen}`}
          width="100%"
          height={
            isFullscreen
              ? CHART_HEIGHT.FULLSCREEN * zoom
              : isCompact && !isMobile
                ? CHART_HEIGHT.COMPACT
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
              tick={(props: ChartTickProps) => (
                <MultiLineTick {...props} fill={axisColor} fontSize={tickFontSize} />
              )}
            />
            <YAxis
              tick={axisTick}
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
                activeDot={ACTIVITY_ACTIVE_DOT}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )

  return (
    <ChartCard title={title} caption={caption} zoomable isEmpty={data.length === 0}>
      {(isFullscreen, zoom) => (
        <>
          {renderChart(isFullscreen, zoom)}
          {chartLegend}
        </>
      )}
    </ChartCard>
  )
}

export default React.memo(ActivityLineChart)
