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
import TooltipDesign from '@/routes/Dashboards/Chart/TooltipDesign'
import type { TooltipPayloadItem } from '@/routes/Dashboards/types'
import { useMetricsStyles } from '../MetricsPage.style'
import { METRICS_CHART_COLORS } from '../constants'
import { formatChartValue, toNumber } from '../utils'
import type { OnboardingTimeChartProps, OnboardingTimeEntry } from '../types'
import { usePerformanceAnalytics } from 'Plugins/fido/shared/api'
import {
  ChartCard,
  ChartLegend,
  DESKTOP_CHART_GEOMETRY,
  MOBILE_CHART_GEOMETRY,
  RECHARTS_INITIAL_DIMENSION,
  getFullscreenCanvasStyle,
} from 'Plugins/fido/shared/charts'

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

const ONBOARDING_COMPACT_MARGIN = { top: 24, right: 8, bottom: 5, left: 0 }
const ONBOARDING_MARGIN = { top: 24, right: 5, bottom: 5, left: 5 }
const ONBOARDING_COMPACT_AXIS_WIDTH = 56

const ONBOARDING_CATEGORY_TICK_FONT_SIZE = { MOBILE: 11, DEFAULT: 13 }

const ONBOARDING_VALUE_TICK_FONT_SIZE = { MOBILE: 10, DEFAULT: 12 }

const ONBOARDING_AXIS_LABEL_FONT_SIZE = 12

const ONBOARDING_AXIS_LABEL_OFFSET = 60

const OnboardingTimeChart: React.FC<OnboardingTimeChartProps> = ({ dateRange }) => {
  const { t } = useTranslation()
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY, MEDIA_QUERY_OPTIONS)
  const isCompact = useMediaQuery(TABLET_MAX_MEDIA_QUERY, MEDIA_QUERY_OPTIONS)
  const chartGeometry = isMobile ? MOBILE_CHART_GEOMETRY : DESKTOP_CHART_GEOMETRY
  const { state } = useTheme()
  const themeColors = useMemo(() => getThemeColor(state.theme), [state.theme])
  const isDark = state.theme === THEME_DARK
  const { classes } = useMetricsStyles({ isDark, themeColors })

  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card?.background
  const gridColor = themeColors.chart.gridColor
  const axisColor = themeColors.fontColor

  const categoryTick = useMemo(
    () => ({
      fill: axisColor,
      fontSize: isMobile
        ? ONBOARDING_CATEGORY_TICK_FONT_SIZE.MOBILE
        : ONBOARDING_CATEGORY_TICK_FONT_SIZE.DEFAULT,
    }),
    [axisColor, isMobile],
  )
  const valueTick = useMemo(
    () => ({
      fill: axisColor,
      fontSize: isMobile
        ? ONBOARDING_VALUE_TICK_FONT_SIZE.MOBILE
        : ONBOARDING_VALUE_TICK_FONT_SIZE.DEFAULT,
    }),
    [axisColor, isMobile],
  )

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

  const bottomLegendItems = useMemo(
    () =>
      legendItems.map((item) => ({
        key: item.label,
        color: item.color,
        label: item.label,
        labelColor: item.color,
      })),
    [legendItems],
  )

  const bottomLegend = <ChartLegend marker="dash" items={bottomLegendItems} />

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
          style={getFullscreenCanvasStyle(isFullscreen, zoom)}
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
              margin={isCompact ? ONBOARDING_COMPACT_MARGIN : ONBOARDING_MARGIN}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="category" tick={categoryTick} axisLine={false} tickLine={false} />
              <YAxis
                label={{
                  value: t('fields.duration_msec'),
                  angle: -90,
                  position: 'insideLeft',
                  fill: axisColor,
                  fontSize: ONBOARDING_AXIS_LABEL_FONT_SIZE,
                  dy: ONBOARDING_AXIS_LABEL_OFFSET,
                }}
                tick={valueTick}
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
    <ChartCard
      title={t('titles.onboarding_time_graph')}
      caption={t('titles.auth_vs_registration_performance')}
      zoomable
      isEmpty={chartData.every(
        (row) => row.minDuration === 0 && row.avgDuration === 0 && row.maxDuration === 0,
      )}
    >
      {renderChart}
    </ChartCard>
  )
}

export default React.memo(OnboardingTimeChart)
