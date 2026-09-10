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
import useMediaQuery from '@mui/material/useMediaQuery'
import { MEDIA_QUERY_OPTIONS, MOBILE_MEDIA_QUERY, TABLET_MAX_MEDIA_QUERY } from '@/constants'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import MetricsChartCard from './MetricsChartCard'
import ChartLegend from './ChartLegend'
import TooltipDesign from '@/routes/Dashboards/Chart/TooltipDesign'
import type { TooltipPayloadItem } from '@/routes/Dashboards/types'
import { useMetricsStyles } from '../MetricsPage.style'
import {
  METRICS_CHART_COLORS,
  METRICS_CHART_HEIGHT,
  METRICS_DESKTOP_CHART,
  METRICS_MOBILE_CHART,
  RECHARTS_INITIAL_DIMENSION,
} from '../constants'
import { usePerformanceAnalytics } from '../hooks'
import { formatChartValue, toNumber } from '../utils'
import type { OnboardingTimeChartProps, OnboardingTimeEntry } from '../types'

const ONBOARDING_DURATION_ROWS = [
  {
    categoryKey: 'fields.authentication',
    min: 'authenticationMinDuration',
    avg: 'authenticationAvgDuration',
    max: 'authenticationMaxDuration',
  },
  {
    categoryKey: 'fields.registration',
    min: 'registrationMinDuration',
    avg: 'registrationAvgDuration',
    max: 'registrationMaxDuration',
  },
] as const

const ONBOARDING_COMPACT_MARGIN = { top: 24, right: 8, bottom: 5, left: 12 }
const ONBOARDING_COMPACT_AXIS_WIDTH = 56

const OnboardingTimeChart: React.FC<OnboardingTimeChartProps> = ({ dateRange }) => {
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

  const { data: performanceData } = usePerformanceAnalytics(dateRange)

  const chartData = useMemo<OnboardingTimeEntry[]>(
    () =>
      ONBOARDING_DURATION_ROWS.map((row) => ({
        category: t(row.categoryKey),
        minDuration: toNumber(performanceData?.[row.min]),
        avgDuration: toNumber(performanceData?.[row.avg]),
        maxDuration: toNumber(performanceData?.[row.max]),
      })),
    [t, performanceData],
  )

  const legendItems = useMemo(
    () => [
      { color: METRICS_CHART_COLORS.minDuration, label: t('fields.min_duration') },
      { color: METRICS_CHART_COLORS.avgDuration, label: t('fields.avg_duration') },
      { color: METRICS_CHART_COLORS.maxDuration, label: t('fields.max_duration') },
    ],
    [t],
  )

  const bottomLegend = (
    <ChartLegend
      marker="dash"
      items={legendItems.map((item) => ({
        key: item.label,
        color: item.color,
        label: item.label,
        labelColor: item.color,
      }))}
    />
  )

  const legend = isCompact ? (
    bottomLegend
  ) : (
    <div className={classes.onboardingLegend}>
      {legendItems.map((item) => (
        <div key={item.label} className={classes.onboardingLegendItem}>
          <span className={classes.onboardingLegendDash} style={{ backgroundColor: item.color }} />
          <span className={classes.onboardingLegendLabel} style={{ color: item.color }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )

  const renderChart = (isFullscreen: boolean, zoom: number) => (
    <>
      <div
        className={isFullscreen ? classes.chartFullscreenFrame : classes.onboardingChartArea}
        data-chart-frame={isFullscreen ? true : undefined}
      >
        {!isFullscreen && !isCompact && legend}
        <div
          className={classes.onboardingCanvas}
          style={
            isFullscreen
              ? {
                  height: METRICS_CHART_HEIGHT.FULLSCREEN * zoom,
                  width: `${zoom * 100}%`,
                  flexShrink: 0,
                }
              : undefined
          }
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
            initialDimension={RECHARTS_INITIAL_DIMENSION}
          >
            <BarChart
              data={chartData}
              barSize={chartGeometry.ONBOARDING_BAR_SIZE}
              barGap={chartGeometry.ONBOARDING_BAR_GAP}
              barCategoryGap="30%"
              margin={isCompact ? ONBOARDING_COMPACT_MARGIN : undefined}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis
                dataKey="category"
                tick={{ fill: axisColor, fontSize: isMobile ? 11 : 13 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                label={{
                  value: t('fields.duration_msec'),
                  angle: -90,
                  position: 'insideLeft',
                  fill: axisColor,
                  fontSize: 12,
                  dy: 60,
                }}
                tick={{ fill: axisColor, fontSize: isMobile ? 10 : 12 }}
                width={isCompact ? ONBOARDING_COMPACT_AXIS_WIDTH : undefined}
                axisLine={false}
                tickLine={false}
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
                dataKey="minDuration"
                name={t('fields.min_duration')}
                fill={METRICS_CHART_COLORS.minDuration}
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              >
                <LabelList
                  dataKey="minDuration"
                  position="top"
                  className={classes.chartLabelMd}
                  formatter={formatChartValue}
                />
              </Bar>
              <Bar
                dataKey="avgDuration"
                name={t('fields.avg_duration')}
                fill={METRICS_CHART_COLORS.avgDuration}
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              >
                <LabelList
                  dataKey="avgDuration"
                  position="top"
                  className={classes.chartLabelMd}
                  formatter={formatChartValue}
                />
              </Bar>
              <Bar
                dataKey="maxDuration"
                name={t('fields.max_duration')}
                fill={METRICS_CHART_COLORS.maxDuration}
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              >
                <LabelList
                  dataKey="maxDuration"
                  position="top"
                  className={classes.chartLabelMd}
                  formatter={formatChartValue}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {isFullscreen ? bottomLegend : isCompact && legend}
    </>
  )

  return (
    <MetricsChartCard
      title={t('titles.onboarding_time_graph')}
      caption={t('titles.auth_vs_registration_performance')}
      zoomable
    >
      {renderChart}
    </MetricsChartCard>
  )
}

export default React.memo(OnboardingTimeChart)
