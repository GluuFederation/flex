import React from 'react'
import { Card, CardBody } from 'Components'
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
import GluuText from 'Routes/Apps/Gluu/GluuText'
import TooltipDesign from '@/routes/Dashboards/Chart/TooltipDesign'
import type { TooltipPayloadItem } from '@/routes/Dashboards/types'
import { useMetricsStyles } from '../MetricsPage.style'
import { METRICS_CHART_COLORS } from '../constants'
import { usePerformanceAnalytics } from '../hooks'
import type { MetricsDateRange } from '../types'

interface OnboardingTimeChartProps {
  dateRange: MetricsDateRange | null
}

const toNumber = (value: number | string | boolean | null | undefined): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  return 0
}

const OnboardingTimeChart: React.FC<OnboardingTimeChartProps> = ({ dateRange }) => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const themeColors = getThemeColor(state.theme)
  const isDark = state.theme === THEME_DARK
  const { classes } = useMetricsStyles({ isDark, themeColors })

  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card?.background
  const gridColor = themeColors.chart.gridColor
  const axisColor = themeColors.fontColor

  const { data: performanceData } = usePerformanceAnalytics(dateRange)

  const chartData = [
    {
      category: t('fields.authentication'),
      minDuration: toNumber(performanceData?.authenticationMinDuration),
      avgDuration: toNumber(performanceData?.authenticationAvgDuration),
      maxDuration: toNumber(performanceData?.authenticationMaxDuration),
    },
    {
      category: t('fields.registration'),
      minDuration: toNumber(performanceData?.registrationMinDuration),
      avgDuration: toNumber(performanceData?.registrationAvgDuration),
      maxDuration: toNumber(performanceData?.registrationMaxDuration),
    },
  ]

  const legendItems = [
    { color: METRICS_CHART_COLORS.minDuration, label: t('fields.min_duration') },
    { color: METRICS_CHART_COLORS.avgDuration, label: t('fields.avg_duration') },
    { color: METRICS_CHART_COLORS.maxDuration, label: t('fields.max_duration') },
  ]

  return (
    <Card className={classes.chartCard}>
      <CardBody>
        <GluuText variant="div" className={classes.chartTitle}>
          {t('titles.onboarding_time_graph')}
        </GluuText>
        <GluuText
          variant="div"
          style={{
            textAlign: 'center',
            fontSize: 13,
            marginBottom: 16,
            color: themeColors.fontColor,
          }}
        >
          {t('titles.auth_vs_registration_performance')}
        </GluuText>
        <div style={{ position: 'relative', width: '100%', height: 320 }}>
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: 80,
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              padding: '10px 14px',
              border: `1px solid ${themeColors.borderColor}`,
              borderRadius: 6,
              backgroundColor: cardBg,
            }}
          >
            {legendItems.map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 14,
                    height: 4,
                    backgroundColor: item.color,
                    borderRadius: 2,
                    display: 'inline-block',
                  }}
                />
                <span style={{ color: item.color, fontSize: 13, fontWeight: 600 }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barSize={40} barGap={4} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis
                dataKey="category"
                tick={{ fill: axisColor, fontSize: 13 }}
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
                tick={{ fill: axisColor, fontSize: 12 }}
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
              >
                <LabelList
                  dataKey="minDuration"
                  position="top"
                  style={{ fill: axisColor, fontSize: 11 }}
                />
              </Bar>
              <Bar
                dataKey="avgDuration"
                name={t('fields.avg_duration')}
                fill={METRICS_CHART_COLORS.avgDuration}
                radius={[4, 4, 0, 0]}
              >
                <LabelList
                  dataKey="avgDuration"
                  position="top"
                  style={{ fill: axisColor, fontSize: 11 }}
                />
              </Bar>
              <Bar
                dataKey="maxDuration"
                name={t('fields.max_duration')}
                fill={METRICS_CHART_COLORS.maxDuration}
                radius={[4, 4, 0, 0]}
              >
                <LabelList
                  dataKey="maxDuration"
                  position="top"
                  style={{ fill: axisColor, fontSize: 11 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  )
}

export default OnboardingTimeChart
