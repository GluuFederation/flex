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
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import TooltipDesign from '@/routes/Dashboards/Chart/TooltipDesign'
import type { TooltipPayloadItem } from '@/routes/Dashboards/types'
import { getScrollCanvasStyle, useMetricsStyles } from '../MetricsPage.style'
import { AGGREGATION_SERIES_COLORS } from '../constants'
import { formatCompactNumber, formatNonZeroChartValue } from '../utils'
import type { ActivityBarChartProps, ActivityDataPoint } from '../types'
import {
  CHART_HEIGHT,
  ChartCard,
  ChartLegend,
  MultiLineTick,
  RECHARTS_INITIAL_DIMENSION,
} from 'Plugins/fido/shared/charts'
import type { ChartTickProps } from 'Plugins/fido/shared/charts'
import { useActivityChartGeometry } from '../hooks'

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
  height = CHART_HEIGHT.DESKTOP,
  barSize = 28,
  barCategoryGap = '25%',
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
              tick={(props: ChartTickProps) => (
                <MultiLineTick {...props} fill={axisColor} fontSize={tickFontSize} />
              )}
            />
            <YAxis
              tick={axisTick}
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

export default React.memo(ActivityBarChart)
