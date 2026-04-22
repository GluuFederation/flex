import React from 'react'
import { Card, CardBody } from 'Components'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import TooltipDesign from '@/routes/Dashboards/Chart/TooltipDesign'
import type { TooltipPayloadItem } from '@/routes/Dashboards/types'
import { useMetricsStyles } from '../MetricsPage.style'
import { METRICS_CHART_COLORS, MOCK_METRICS_DATA } from '../constants'

const OnboardingTimeChart: React.FC = () => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const themeColors = getThemeColor(state.theme)
  const isDark = state.theme === THEME_DARK
  const { classes } = useMetricsStyles({ isDark, themeColors })

  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card?.background
  const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
  const axisColor = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'

  const chartData = MOCK_METRICS_DATA.onboardingTime.map((entry) => ({
    ...entry,
    category: t(entry.category),
  }))

  return (
    <Card className={classes.chartCard}>
      <CardBody>
        <GluuText variant="div" className={classes.chartTitle}>
          {t('titles.onboarding_time_graph')}
        </GluuText>
        <GluuText
          variant="div"
          secondary
          style={{ textAlign: 'center', fontSize: 13, marginBottom: 16 }}
        >
          {t('titles.auth_vs_registration_performance')}
        </GluuText>
        <ResponsiveContainer width="100%" height={320}>
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
              content={(props: TooltipProps<number, string>) => (
                <TooltipDesign
                  payload={props.payload as TooltipPayloadItem[] | undefined}
                  active={props.active}
                  backgroundColor={cardBg}
                  textColor={themeColors.fontColor}
                  isDark={isDark}
                />
              )}
            />
            <Legend
              wrapperStyle={{ color: themeColors.fontColor, fontSize: 13 }}
              formatter={(value) => <span style={{ color: themeColors.fontColor }}>{value}</span>}
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
      </CardBody>
    </Card>
  )
}

export default OnboardingTimeChart
