import React, { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import TooltipDesign from '@/routes/Dashboards/Chart/TooltipDesign'
import type { TooltipPayloadItem } from '@/routes/Dashboards/types'
import { RECHARTS_INITIAL_DIMENSION } from '../../Metrics/constants'
import { SECURITY_CHART_HEIGHT } from '../constants'
import SecurityChartCard from './SecurityChartCard'
import type { ErrorCategoryChartProps } from '../types'

const ErrorIntelligenceChart: React.FC<ErrorCategoryChartProps> = ({ slices }) => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const themeColors = useMemo(() => getThemeColor(state.theme), [state.theme])
  const isDark = state.theme === THEME_DARK

  const legend = useMemo(
    () =>
      slices.map((slice) => ({
        label: `${slice.category} ${slice.share}%`,
        color: slice.color,
      })),
    [slices],
  )

  const chartData = useMemo(() => [...slices], [slices])
  const leadSlice = slices[0]

  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card?.background

  return (
    <SecurityChartCard
      title={t('titles.error_intelligence')}
      subtitle={t('fields.error_intelligence_subtitle')}
      statusLabel={
        leadSlice
          ? t('fields.error_lead_share', { category: leadSlice.category, share: leadSlice.share })
          : undefined
      }
      legend={legend}
      isEmpty={slices.length === 0}
      emptyLabel={t('fields.no_data')}
    >
      <div style={{ width: '100%', height: SECURITY_CHART_HEIGHT }}>
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={RECHARTS_INITIAL_DIMENSION}
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="80%"
              isAnimationActive={false}
            >
              {chartData.map((slice) => (
                <Cell key={slice.category} fill={slice.color} />
              ))}
            </Pie>
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
          </PieChart>
        </ResponsiveContainer>
      </div>
    </SecurityChartCard>
  )
}

export default React.memo(ErrorIntelligenceChart)
