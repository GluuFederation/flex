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
import { AGGREGATION_SERIES_COLORS } from '../constants'

export interface ActivityDataPoint {
  label: string
  regSuccess: number
  regAttempts: number
  authAttempts: number
  authSuccess: number
}

interface ActivityBarChartProps {
  title: string
  data: readonly ActivityDataPoint[]
  height?: number
}

const ActivityBarChart: React.FC<ActivityBarChartProps> = ({ title, data, height = 360 }) => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const themeColors = getThemeColor(state.theme)
  const isDark = state.theme === THEME_DARK
  const { classes } = useMetricsStyles({ isDark, themeColors })

  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card?.background
  const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'
  const axisColor = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'

  const chartData = data.map((d) => ({ ...d }))

  return (
    <Card className={classes.chartCard}>
      <CardBody>
        <GluuText variant="div" className={classes.chartTitle}>
          {title}
        </GluuText>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={chartData} barSize={28} barCategoryGap="25%" barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: axisColor, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <YAxis tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
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
              wrapperStyle={{ color: themeColors.fontColor, fontSize: 12 }}
              formatter={(v) => <span style={{ color: themeColors.fontColor }}>{v}</span>}
              iconType="circle"
              iconSize={8}
            />
            <Bar
              dataKey="regSuccess"
              name={t('fields.agg_reg_success')}
              fill={AGGREGATION_SERIES_COLORS.regSuccess}
              radius={[3, 3, 0, 0]}
            >
              <LabelList
                dataKey="regSuccess"
                position="top"
                style={{ fill: axisColor, fontSize: 10 }}
                formatter={(v: number) => (v > 0 ? v : '')}
              />
            </Bar>
            <Bar
              dataKey="regAttempts"
              name={t('fields.agg_reg_attempts')}
              fill={AGGREGATION_SERIES_COLORS.regAttempts}
              radius={[3, 3, 0, 0]}
            >
              <LabelList
                dataKey="regAttempts"
                position="top"
                style={{ fill: axisColor, fontSize: 10 }}
                formatter={(v: number) => (v > 0 ? v : '')}
              />
            </Bar>
            <Bar
              dataKey="authAttempts"
              name={t('fields.agg_auth_attempts')}
              fill={AGGREGATION_SERIES_COLORS.authAttempts}
              radius={[3, 3, 0, 0]}
            >
              <LabelList
                dataKey="authAttempts"
                position="top"
                style={{ fill: axisColor, fontSize: 10 }}
                formatter={(v: number) => (v > 0 ? v : '')}
              />
            </Bar>
            <Bar
              dataKey="authSuccess"
              name={t('fields.agg_auth_success')}
              fill={AGGREGATION_SERIES_COLORS.authSuccess}
              radius={[3, 3, 0, 0]}
            >
              <LabelList
                dataKey="authSuccess"
                position="top"
                style={{ fill: axisColor, fontSize: 10 }}
                formatter={(v: number) => (v > 0 ? v : '')}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  )
}

export default ActivityBarChart
