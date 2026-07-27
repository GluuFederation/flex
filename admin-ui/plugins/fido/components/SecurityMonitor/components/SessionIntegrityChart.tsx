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
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import TooltipDesign from '@/routes/Dashboards/Chart/TooltipDesign'
import type { TooltipPayloadItem } from '@/routes/Dashboards/types'
import { RECHARTS_INITIAL_DIMENSION } from '../../Metrics/constants'
import {
  DROP_OFF_ALERT_RATE,
  SECURITY_CHART_FILL_OPACITY,
  SECURITY_CHART_HEIGHT,
} from '../constants'
import { findDropOffPeak, getSecurityPalette } from '../utils'
import SecurityChartCard from './SecurityChartCard'
import type { DropOffChartProps } from '../types'

const PERCENT_DOMAIN: [number, number] = [0, 100]

const SessionIntegrityChart: React.FC<DropOffChartProps> = ({ series }) => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const themeColors = useMemo(() => getThemeColor(state.theme), [state.theme])
  const palette = useMemo(() => getSecurityPalette(themeColors), [themeColors])
  const isDark = state.theme === THEME_DARK

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

  const chartData = useMemo(() => [...series], [series])

  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card?.background

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
      isEmpty={series.length === 0}
      emptyLabel={t('fields.no_data')}
    >
      <div style={{ width: '100%', height: SECURITY_CHART_HEIGHT }}>
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={RECHARTS_INITIAL_DIMENSION}
        >
          <AreaChart data={chartData} margin={{ top: 12, right: 16, bottom: 8, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={themeColors.borderColor} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: themeColors.fontColor }} />
            <YAxis domain={PERCENT_DOMAIN} tick={{ fontSize: 11, fill: themeColors.fontColor }} />
            <Tooltip
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
    </SecurityChartCard>
  )
}

export default React.memo(SessionIntegrityChart)
