import React, { useMemo } from 'react'
import { Card, CardBody } from 'Components'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
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
import {
  ACTIVITY_LINE_AXIS_PADDING,
  ACTIVITY_LINE_DOT_RADIUS,
  ACTIVITY_LINE_MAX_DOTS,
  ACTIVITY_LINE_STROKE_WIDTH,
  ACTIVITY_LINE_TICK_GAP,
  ACTIVITY_TREND_SERIES_COLORS,
  RECHARTS_INITIAL_DIMENSION,
} from '../constants'
import type { ActivityChartProps, ActivityDataPoint } from '../types'

type TickProps = {
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

// Same series as ActivityBarChart, drawn as trend lines: the bars answer "how much in this
// bucket", the lines answer "which way is it heading across buckets".
const ActivityLineChart: React.FC<ActivityChartProps> = ({ title, data, height = 360 }) => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const themeColors = useMemo(() => getThemeColor(state.theme), [state.theme])
  const isDark = state.theme === THEME_DARK
  const { classes } = useMetricsStyles({ isDark, themeColors })

  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card?.background
  const gridColor = themeColors.chart.gridColor
  const axisColor = themeColors.fontColor

  const hasMultiLineLabel = useMemo(() => data.some((d) => d.label.includes('\n')), [data])

  const showDots = data.length <= ACTIVITY_LINE_MAX_DOTS

  const series = useMemo(
    () =>
      [
        { key: 'authAttempts', name: t('fields.agg_auth_attempts') },
        { key: 'authSuccess', name: t('fields.agg_auth_success') },
        { key: 'authFailed', name: t('fields.agg_auth_failed') },
      ] as const,
    [t],
  )

  return (
    <Card className={classes.chartCard}>
      <CardBody>
        <GluuText variant="div" className={classes.chartTitle}>
          {title}
        </GluuText>
        <ResponsiveContainer
          width="100%"
          height={height}
          initialDimension={RECHARTS_INITIAL_DIMENSION}
        >
          <LineChart data={data as ActivityDataPoint[]} margin={{ top: 20, right: 32, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              // Tight like a time series, but with just enough gutter that the first and last
              // tick labels stay inside the card instead of being clipped by its edge.
              padding={ACTIVITY_LINE_AXIS_PADDING}
              interval="preserveStartEnd"
              minTickGap={ACTIVITY_LINE_TICK_GAP}
              height={hasMultiLineLabel ? 50 : 30}
              tick={(props: TickProps) => <MultiLineTick {...props} fill={axisColor} />}
            />
            <YAxis
              tick={{ fill: axisColor, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={45}
              allowDecimals={false}
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
            {series.map((line) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                name={line.name}
                stroke={ACTIVITY_TREND_SERIES_COLORS[line.key]}
                strokeWidth={ACTIVITY_LINE_STROKE_WIDTH}
                dot={
                  showDots
                    ? {
                        r: ACTIVITY_LINE_DOT_RADIUS,
                        fill: ACTIVITY_TREND_SERIES_COLORS[line.key],
                        strokeWidth: 0,
                      }
                    : false
                }
                activeDot={{ r: ACTIVITY_LINE_DOT_RADIUS + 2 }}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  )
}

export default React.memo(ActivityLineChart)
