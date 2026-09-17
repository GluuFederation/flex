import React, { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
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
  AGGREGATION_SERIES_COLORS,
  METRICS_CHART_HEIGHT,
  METRICS_DESKTOP_CHART,
  METRICS_MOBILE_CHART,
  RECHARTS_INITIAL_DIMENSION,
} from '../constants'
import { formatCompactNumber, formatNonZeroChartValue } from '../utils'
import MetricsChartCard from './MetricsChartCard'
import ChartLegend from './ChartLegend'
import type { ActivityBarChartProps, ActivityDataPoint } from '../types'

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

const COMPACT_MAX_TICKS = 4

const BAR_SERIES = [
  { key: 'regAttempts', labelKey: 'fields.agg_reg_attempts' },
  { key: 'regSuccess', labelKey: 'fields.agg_reg_success' },
  { key: 'authAttempts', labelKey: 'fields.agg_auth_attempts' },
  { key: 'authSuccess', labelKey: 'fields.agg_auth_success' },
] as const

const ActivityBarChart: React.FC<ActivityBarChartProps> = ({
  title,
  caption,
  data,
  height = METRICS_CHART_HEIGHT.DESKTOP,
  barSize = 28,
  barCategoryGap = '25%',
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
      BAR_SERIES.map((series) => ({
        key: series.key,
        color: AGGREGATION_SERIES_COLORS[series.key],
        label: t(series.labelKey),
      })),
    [t],
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
                minWidth: `${zoom * 100}%`,
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
              : isCompact && !isMobile
                ? METRICS_CHART_HEIGHT.COMPACT
                : height
          }
          initialDimension={RECHARTS_INITIAL_DIMENSION}
        >
          <BarChart
            data={data as ActivityDataPoint[]}
            barSize={isMobile ? chartGeometry.BAR_SIZE : barSize}
            barCategoryGap={barCategoryGap}
            barGap={2}
            margin={chartGeometry.BAR_MARGIN}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
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
            <Bar
              dataKey="regAttempts"
              name={t('fields.agg_reg_attempts')}
              fill={AGGREGATION_SERIES_COLORS.regAttempts}
              radius={[3, 3, 0, 0]}
              isAnimationActive={!isDense}
            >
              {!isDense && (
                <LabelList
                  dataKey="regAttempts"
                  position="top"
                  className={classes.chartLabelSm}
                  formatter={formatNonZeroChartValue}
                />
              )}
            </Bar>
            <Bar
              dataKey="regSuccess"
              name={t('fields.agg_reg_success')}
              fill={AGGREGATION_SERIES_COLORS.regSuccess}
              radius={[3, 3, 0, 0]}
              isAnimationActive={!isDense}
            >
              {!isDense && (
                <LabelList
                  dataKey="regSuccess"
                  position="top"
                  className={classes.chartLabelSm}
                  formatter={formatNonZeroChartValue}
                />
              )}
            </Bar>
            <Bar
              dataKey="authAttempts"
              name={t('fields.agg_auth_attempts')}
              fill={AGGREGATION_SERIES_COLORS.authAttempts}
              radius={[3, 3, 0, 0]}
              isAnimationActive={!isDense}
            >
              {!isDense && (
                <LabelList
                  dataKey="authAttempts"
                  position="top"
                  className={classes.chartLabelSm}
                  formatter={formatNonZeroChartValue}
                />
              )}
            </Bar>
            <Bar
              dataKey="authSuccess"
              name={t('fields.agg_auth_success')}
              fill={AGGREGATION_SERIES_COLORS.authSuccess}
              radius={[3, 3, 0, 0]}
              isAnimationActive={!isDense}
            >
              {!isDense && (
                <LabelList
                  dataKey="authSuccess"
                  position="top"
                  className={classes.chartLabelSm}
                  formatter={formatNonZeroChartValue}
                />
              )}
            </Bar>
          </BarChart>
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

export default React.memo(ActivityBarChart)
