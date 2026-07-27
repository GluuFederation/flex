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
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import TooltipDesign from '@/routes/Dashboards/Chart/TooltipDesign'
import type { TooltipPayloadItem } from '@/routes/Dashboards/types'
import { RECHARTS_INITIAL_DIMENSION } from '../../Metrics/constants'
import { SECURITY_CHART_HEIGHT, THREAT_LEVELS } from '../constants'
import { countByThreatLevel, getSecurityPalette, takeTopIpsByFailure } from '../utils'
import SecurityChartCard from './SecurityChartCard'
import type { FailureBurstByIpProps } from '../types'

const ThreatOriginsChart: React.FC<FailureBurstByIpProps> = ({ ipStats }) => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const themeColors = useMemo(() => getThemeColor(state.theme), [state.theme])
  const palette = useMemo(() => getSecurityPalette(themeColors), [themeColors])
  const isDark = state.theme === THEME_DARK

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

  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card?.background

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
            <CartesianGrid strokeDasharray="3 3" stroke={themeColors.borderColor} />
            <XAxis
              type="number"
              allowDecimals={false}
              tick={{ fontSize: 11, fill: themeColors.fontColor }}
            />
            <YAxis
              type="category"
              dataKey="ipAddress"
              width={130}
              tick={{ fontSize: 11, fill: themeColors.fontColor }}
            />
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
