import React, { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTranslation } from 'react-i18next'
import { useChartTheme } from '@/hooks/useChartTheme'
import { RECHARTS_INITIAL_DIMENSION } from '../../Metrics/constants'
import { CHART_EMPTY_INSET, THREAT_LEVELS } from '../constants'
import {
  buildCountAxis,
  buildUserScaffold,
  countByThreatLevel,
  getSecurityPalette,
  takeTopUsersByFailure,
} from '../utils'
import { useSecurityStyles } from '../SecurityMonitorPage.style'
import SecurityChartCard from './SecurityChartCard'
import type { TopTargetedAccountsProps } from '../types'

const USER_LABEL_WIDTH = 64

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
  const palette = useMemo(() => getSecurityPalette(themeColors), [themeColors])

  const data = useMemo(
    () =>
      takeTopUsersByFailure(userStats).map((stat) => ({
        username: stat.username,
        failures: stat.failures,
        abandoned: stat.abandoned,
        failed: stat.failed,
        fill: palette.threatLevels[stat.threatLevel],
      })),
    [userStats, palette.threatLevels],
  )

  const isEmpty = data.length === 0
  const chartData = useMemo(() => (isEmpty ? buildUserScaffold() : data), [data, isEmpty])

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
      Object.entries(palette.threatLevels).map(([level, color]) => {
        const bucket = userStats.filter((stat) => stat.threatLevel === level)
        const dropOff = bucket.reduce((sum, stat) => sum + stat.abandoned, 0)
        const failed = bucket.reduce((sum, stat) => sum + stat.failed, 0)

        return {
          label: t(`fields.threat_level_${level}`),
          color,
          hint: t('fields.threat_level_breakdown', {
            accounts: bucket.length,
            dropOff,
            failed,
          }),
        }
      }),
    [t, palette.threatLevels, userStats],
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
      <div className={classes.chartCanvas}>
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={RECHARTS_INITIAL_DIMENSION}
        >
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 12, right: USER_LABEL_WIDTH, bottom: 8, left: 0 }}
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
              dataKey="username"
              width={isEmpty ? 0 : USER_LABEL_WIDTH}
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

export default React.memo(TopTargetedAccountsChart)
