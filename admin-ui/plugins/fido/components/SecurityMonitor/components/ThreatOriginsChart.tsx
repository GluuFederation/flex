import React, { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTranslation } from 'react-i18next'
import { useChartTheme } from '@/hooks/useChartTheme'
import { RECHARTS_INITIAL_DIMENSION } from '../../Metrics/constants'
import { CHART_EMPTY_INSET, THREAT_LEVELS } from '../constants'
import {
  buildCountAxis,
  buildIpScaffold,
  countByThreatLevel,
  getSecurityPalette,
  takeTopUsersByFailure,
} from '../utils'
import { useSecurityStyles } from '../SecurityMonitorPage.style'
import SecurityChartCard from './SecurityChartCard'
import type { FailureBurstByIpProps } from '../types'

const IP_LABEL_WIDTH = 130

const BAR_EMPTY_INSET = {
  top: CHART_EMPTY_INSET.TOP_MARGIN,
  bottom: CHART_EMPTY_INSET.AXIS_HEIGHT,
  left: CHART_EMPTY_INSET.BAR_LEFT_MARGIN,
  right: CHART_EMPTY_INSET.BAR_LEFT_MARGIN,
}

const ThreatOriginsChart: React.FC<FailureBurstByIpProps> = ({ userStats }) => {
  const { t } = useTranslation()
  const { themeColors, isDark, gridProps, axisTick, renderTooltip } = useChartTheme()
  const { classes } = useSecurityStyles({ isDark, themeColors })
  const palette = useMemo(() => getSecurityPalette(themeColors), [themeColors])

  const data = useMemo(
    () =>
      takeTopUsersByFailure(userStats).map((stat) => ({
        ipAddress: stat.username,
        failures: stat.failures,
        abandoned: stat.abandoned,
        failed: stat.failed,
        fill: palette.threatLevels[stat.threatLevel],
      })),
    [userStats, palette.threatLevels],
  )

  const isEmpty = data.length === 0
  const chartData = useMemo(() => (isEmpty ? buildIpScaffold() : data), [data, isEmpty])

  const countAxis = useMemo(
    () => buildCountAxis(chartData.reduce((max, item) => Math.max(max, item.failures), 0)),
    [chartData],
  )

  const criticalCount = useMemo(
    () => countByThreatLevel(userStats, THREAT_LEVELS.CRITICAL),
    [userStats],
  )

  const legend = useMemo(
    () =>
      Object.entries(palette.threatLevels).map(([level, color]) => ({
        label: t(`fields.threat_level_${level}`),
        color,
      })),
    [t, palette.threatLevels],
  )

  return (
    <SecurityChartCard
      title={t('titles.threat_origins')}
      subtitle={t('fields.threat_origins_subtitle')}
      statusLabel={criticalCount ? t('fields.critical_ips', { total: criticalCount }) : undefined}
      accentColor={criticalCount ? palette.threatLevels[THREAT_LEVELS.CRITICAL] : undefined}
      legend={legend}
      isEmpty={isEmpty}
      emptyLabel={t('fields.no_data')}
      emptyInset={BAR_EMPTY_INSET}
    >
      <div className={classes.chartCanvas}>
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={RECHARTS_INITIAL_DIMENSION}
        >
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 12, right: 24, bottom: 8, left: 24 }}
          >
            <CartesianGrid {...gridProps} />
            <XAxis
              type="number"
              allowDecimals={false}
              tick={axisTick}
              domain={countAxis.domain}
              ticks={countAxis.ticks}
            />
            <YAxis
              type="category"
              dataKey="ipAddress"
              width={isEmpty ? 0 : IP_LABEL_WIDTH}
              tick={axisTick}
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
    </SecurityChartCard>
  )
}

export default React.memo(ThreatOriginsChart)
