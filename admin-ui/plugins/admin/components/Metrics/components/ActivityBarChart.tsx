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
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import TooltipDesign from '@/routes/Dashboards/Chart/TooltipDesign'
import type { TooltipPayloadItem } from '@/routes/Dashboards/types'
import { useMetricsStyles } from '../MetricsPage.style'
import { AGGREGATION_SERIES_COLORS } from '../constants'
import type { ActivityDataPoint } from '../types'

interface ActivityBarChartProps {
  title: string
  data: readonly ActivityDataPoint[]
  height?: number
  barSize?: number
  barCategoryGap?: string | number
}

interface TickProps {
  x?: number | string
  y?: number | string
  payload?: { value: string }
}

const MultiLineTick = ({
  x = 0,
  y = 0,
  payload,
  fill,
}: TickProps & { fill: string }): ReactNode => {
  const lines = (payload?.value ?? '').split('\n')
  return (
    <g transform={`translate(${x},${y})`}>
      {lines.map((line, i) => (
        <text
          key={i}
          x={0}
          y={0}
          dy={i === 0 ? 12 : 12 + i * 14}
          textAnchor="middle"
          fill={fill}
          fontSize={12}
        >
          {line}
        </text>
      ))}
    </g>
  )
}

const ActivityBarChart: React.FC<ActivityBarChartProps> = ({
  title,
  data,
  height = 360,
  barSize = 28,
  barCategoryGap = '25%',
}) => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const themeColors = getThemeColor(state.theme)
  const isDark = state.theme === THEME_DARK
  const { classes } = useMetricsStyles({ isDark, themeColors })

  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card?.background
  const gridColor = themeColors.chart.gridColor
  const axisColor = themeColors.chart.axisColor

  const chartData = data.map((d) => ({ ...d }))

  const hasMultiLineLabel = data.some((d) => d.label.includes('\n'))

  return (
    <Card className={classes.chartCard}>
      <CardBody>
        <GluuText variant="div" className={classes.chartTitle}>
          {title}
        </GluuText>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={chartData}
            barSize={barSize}
            barCategoryGap={barCategoryGap}
            barGap={2}
            margin={{ top: 20, left: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              interval={0}
              height={hasMultiLineLabel ? 50 : 30}
              tick={(props: TickProps) => <MultiLineTick {...props} fill={axisColor} />}
            />
            <YAxis
              tick={{ fill: axisColor, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={45}
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
                formatter={(v: string | number | boolean | null | undefined) =>
                  Number(v) > 0 ? String(v) : ''
                }
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
                formatter={(v: string | number | boolean | null | undefined) =>
                  Number(v) > 0 ? String(v) : ''
                }
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
                formatter={(v: string | number | boolean | null | undefined) =>
                  Number(v) > 0 ? String(v) : ''
                }
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
                formatter={(v: string | number | boolean | null | undefined) =>
                  Number(v) > 0 ? String(v) : ''
                }
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  )
}

export default ActivityBarChart
