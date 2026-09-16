import React, { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTranslation } from 'react-i18next'
import useMediaQuery from '@mui/material/useMediaQuery'
import { MEDIA_QUERY_OPTIONS, MOBILE_MEDIA_QUERY } from '@/constants'
import { useChartTheme } from '@/hooks/useChartTheme'
import { CHART_EMPTY_INSET, THREAT_LEVELS } from '../constants'
import {
  buildCountAxis,
  buildUserScaffold,
  countByThreatLevel,
  getSecurityPalette,
  measureLabelColumn,
  summarizeThreatBuckets,
  takeTopUsersByFailure,
  truncateLabel,
} from '../utils'
import { useSecurityStyles } from '../SecurityMonitorPage.style'
import SecurityChartCard from './SecurityChartCard'
import type { ThreatLevel, TopTargetedAccountsProps } from '../types'
import {
  AxisStartTick,
  DESKTOP_CHART_GEOMETRY,
  MOBILE_CHART_GEOMETRY,
  RECHARTS_INITIAL_DIMENSION,
  getFullscreenCanvasStyle,
} from 'Plugins/fido/shared/charts'

const USER_LABEL_FONT_SIZE = 14

const USER_LABEL_WIDTH = { COMPACT: 132, DEFAULT: 168 }

const USER_LABEL_MAX_CHARS = 18

const USER_LABEL_GUTTER = 8

const FULLSCREEN_BAR_CATEGORY_GAP = '35%'

const formatUserLabel = (value: string) => truncateLabel(value, USER_LABEL_MAX_CHARS)

const BAR_EMPTY_INSET = {
  top: CHART_EMPTY_INSET.TOP_MARGIN,
  bottom: CHART_EMPTY_INSET.AXIS_HEIGHT,
  left: CHART_EMPTY_INSET.BAR_LEFT_MARGIN,
  right: CHART_EMPTY_INSET.BAR_LEFT_MARGIN,
}

const TopTargetedAccountsChart: React.FC<TopTargetedAccountsProps> = ({ userStats }) => {
  const { t } = useTranslation()
  const { themeColors, isDark, gridProps, axisTick, renderTooltip } = useChartTheme()
  const { classes } = useSecurityStyles({ isDark, themeColors })
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY, MEDIA_QUERY_OPTIONS)
  const chartGeometry = isMobile ? MOBILE_CHART_GEOMETRY : DESKTOP_CHART_GEOMETRY
  const chartTick = useMemo(
    () => ({ ...axisTick, fontSize: chartGeometry.TICK_FONT_SIZE }),
    [axisTick, chartGeometry.TICK_FONT_SIZE],
  )
  const userLabel = useMemo(
    () =>
      isMobile
        ? { fontSize: chartGeometry.TICK_FONT_SIZE, maxWidth: USER_LABEL_WIDTH.COMPACT }
        : { fontSize: USER_LABEL_FONT_SIZE, maxWidth: USER_LABEL_WIDTH.DEFAULT },
    [isMobile, chartGeometry.TICK_FONT_SIZE],
  )
  const axisStartTick = useMemo(
    () => <AxisStartTick fill={chartTick.fill} fontSize={userLabel.fontSize} />,
    [chartTick.fill, userLabel.fontSize],
  )
  const palette = useMemo(() => getSecurityPalette(themeColors), [themeColors])

  // The legend describes the bars this chart draws, so both read from the same truncated set.
  const topStats = useMemo(() => takeTopUsersByFailure(userStats), [userStats])

  const data = useMemo(
    () =>
      topStats.map((stat) => ({
        username: stat.username,
        name: stat.username,
        failures: stat.failures,
        abandoned: stat.abandoned,
        failed: stat.failed,
        fill: palette.threatLevels[stat.threatLevel],
      })),
    [topStats, palette.threatLevels],
  )

  const isEmpty = data.length === 0
  const chartData = useMemo(() => (isEmpty ? buildUserScaffold() : data), [data, isEmpty])

  const countAxis = useMemo(
    () => buildCountAxis(chartData.reduce((max, item) => Math.max(max, item.failures), 0)),
    [chartData],
  )

  const axisWidth = useMemo(
    () =>
      measureLabelColumn(
        chartData.map((item) => truncateLabel(item.username, USER_LABEL_MAX_CHARS)),
        userLabel.fontSize,
        USER_LABEL_GUTTER,
        userLabel.maxWidth,
      ),
    [chartData, userLabel.fontSize, userLabel.maxWidth],
  )

  const criticalCount = useMemo(
    () => countByThreatLevel(userStats, THREAT_LEVELS.CRITICAL),
    [userStats],
  )

  const threatBuckets = useMemo(() => summarizeThreatBuckets(topStats), [topStats])

  const legend = useMemo(
    () =>
      Object.entries(palette.threatLevels).map(([level, color]) => ({
        label: t(`fields.threat_level_${level}`),
        color,
        hint: t('fields.threat_level_breakdown', threatBuckets[level as ThreatLevel]),
      })),
    [t, palette.threatLevels, threatBuckets],
  )

  return (
    <SecurityChartCard
      title={t('titles.top_targeted_accounts')}
      subtitle={t('fields.top_targeted_accounts_subtitle')}
      statusLabel={
        criticalCount ? t('fields.critical_accounts', { total: criticalCount }) : undefined
      }
      accentColor={criticalCount ? palette.threatLevels[THREAT_LEVELS.CRITICAL] : undefined}
      legend={legend}
      isEmpty={isEmpty}
      emptyLabel={t('fields.no_data')}
      emptyInset={BAR_EMPTY_INSET}
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
              <BarChart
                data={chartData}
                layout="vertical"
                margin={chartGeometry.BAR_MARGIN_FLUSH}
                barSize={isFullscreen ? undefined : chartGeometry.BAR_SIZE}
                barCategoryGap={isFullscreen ? FULLSCREEN_BAR_CATEGORY_GAP : undefined}
              >
                <CartesianGrid {...gridProps} />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={chartTick}
                  domain={countAxis.domain}
                  ticks={countAxis.ticks}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="username"
                  width={isEmpty ? 0 : axisWidth}
                  tickFormatter={formatUserLabel}
                  tick={axisStartTick}
                  interval={0}
                  axisLine={false}
                  tickLine={false}
                />
                {isEmpty ? null : <Tooltip content={renderTooltip} cursor={false} />}
                <Bar
                  dataKey="failures"
                  name={t('fields.auth_failures_drop_off')}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </SecurityChartCard>
  )
}

export default React.memo(TopTargetedAccountsChart)
