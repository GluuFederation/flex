import React, { useMemo } from 'react'
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useTranslation } from 'react-i18next'
import { useChartTheme } from '@/hooks/useChartTheme'
import { RECHARTS_INITIAL_DIMENSION } from '../../Metrics/constants'
import { SECURITY_CHART_HEIGHT, THREAT_LEVELS } from '../constants'
import { countByThreatLevel, getSecurityPalette, takeTopIpsByFailure } from '../utils'
import SecurityChartCard from './SecurityChartCard'
import type { FailureBurstByIpProps } from '../types'

const ThreatOriginsChart: React.FC<FailureBurstByIpProps> = ({ ipStats }) => {
  const { t } = useTranslation()
  const { themeColors, gridProps, axisTick, renderTooltip } = useChartTheme()
  const palette = useMemo(() => getSecurityPalette(themeColors), [themeColors])

  const data = useMemo(
    () =>
      takeTopIpsByFailure(ipStats).map((stat) => ({
        ipAddress: stat.ipAddress,
        failures: stat.failures,
        targetedUsers: stat.targetedUsers,
        color: palette.threatLevels[stat.threatLevel],
      })),
    [ipStats, palette.threatLevels],
  )

  const criticalCount = useMemo(
    () => countByThreatLevel(ipStats, THREAT_LEVELS.CRITICAL),
    [ipStats],
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
      isEmpty={data.length === 0}
      emptyLabel={t('fields.no_data')}
    >
      <div style={{ width: '100%', height: SECURITY_CHART_HEIGHT }}>
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={RECHARTS_INITIAL_DIMENSION}
        >
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 12, right: 24, bottom: 8, left: 24 }}
          >
            <CartesianGrid {...gridProps} />
            <XAxis type="number" allowDecimals={false} tick={axisTick} />
            <YAxis type="category" dataKey="ipAddress" width={130} tick={axisTick} />
            <Tooltip content={renderTooltip} />
            <Bar dataKey="failures" name={t('fields.auth_failures')} isAnimationActive={false}>
              {data.map((item) => (
                <Cell key={item.ipAddress} fill={item.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SecurityChartCard>
  )
}

export default React.memo(ThreatOriginsChart)
