import React, { useMemo } from 'react'
import { Card, CardBody } from 'Components'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import TooltipDesign from '@/routes/Dashboards/Chart/TooltipDesign'
import type { TooltipPayloadItem } from '@/routes/Dashboards/types'
import { useMetricsStyles } from '../MetricsPage.style'
import { METRICS_CHART_COLORS } from '../constants'
import { useErrorsAnalytics } from '../hooks'
import type { MetricsDateRange } from '../types'

const RADIAN = Math.PI / 180

import type { PieLabelRenderProps } from 'recharts'

interface PasskeyAuthChartProps {
  dateRange: MetricsDateRange | null
}

const toPercent = (value: number | null | undefined): number => {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0
  const normalised = value > 1 ? value : value * 100
  return Math.max(0, Math.min(100, Math.round(normalised)))
}

const PasskeyAuthChart: React.FC<PasskeyAuthChartProps> = ({ dateRange }) => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const themeColors = getThemeColor(state.theme)
  const isDark = state.theme === THEME_DARK
  const { classes } = useMetricsStyles({ isDark, themeColors })

  const { data: errorsData } = useErrorsAnalytics(dateRange)

  const data = useMemo(
    () => [
      {
        name: t('fields.success_rate'),
        value: toPercent(errorsData?.successRate),
        color: METRICS_CHART_COLORS.successRate,
      },
      {
        name: t('fields.error_rate'),
        value: toPercent(errorsData?.failureRate),
        color: METRICS_CHART_COLORS.errorRate,
      },
      {
        name: t('fields.drop_off_rate'),
        value: toPercent(errorsData?.dropOffRate),
        color: METRICS_CHART_COLORS.dropOffRate,
      },
    ],
    [t, errorsData],
  )

  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card?.background

  const renderLabel = (props: PieLabelRenderProps) => {
    const { cx, cy, midAngle, outerRadius, percent, index, value } = props
    const entry = data[index as number]
    if (!entry || !percent || !value) return null

    const angle = midAngle ?? 0
    const LABEL_RADIUS = (outerRadius as number) + 36
    const x = (cx as number) + LABEL_RADIUS * Math.cos(-angle * RADIAN)
    const y = (cy as number) + LABEL_RADIUS * Math.sin(-angle * RADIAN)
    const anchor = x > cx ? 'start' : 'end'
    const pct = `${(percent * 100).toFixed(0)}%`

    return (
      <text x={x} y={y} fill={entry.color} textAnchor={anchor} fontSize={13} fontWeight="700">
        <tspan x={x} dy="-8">
          {entry.name}
        </tspan>
        <tspan x={x} dy="20">
          {pct}
        </tspan>
      </text>
    )
  }

  const renderLabelLine = (props: PieLabelRenderProps) => {
    const { cx, cy, midAngle, outerRadius, index, percent, value } = props
    const entry = data[index as number]
    if (!entry || !percent || !value) return <g />

    const angle = midAngle ?? 0
    const r = outerRadius as number
    const cxN = cx as number
    const cyN = cy as number
    const x1 = cxN + (r + 4) * Math.cos(-angle * RADIAN)
    const y1 = cyN + (r + 4) * Math.sin(-angle * RADIAN)
    const x2 = cxN + (r + 22) * Math.cos(-angle * RADIAN)
    const y2 = cyN + (r + 22) * Math.sin(-angle * RADIAN)

    return (
      <line
        key={`ll-${index}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={entry.color}
        strokeWidth={1.5}
      />
    )
  }

  return (
    <Card className={`${classes.chartCard} h-100`}>
      <CardBody style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 16,
            marginBottom: 4,
          }}
        >
          <GluuText variant="div" className={classes.chartTitle} style={{ margin: 0 }}>
            {t('titles.passkey_authentication')}
          </GluuText>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              flexShrink: 0,
              paddingTop: 2,
            }}
          >
            {data.map((entry) => (
              <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: entry.color,
                    flexShrink: 0,
                    display: 'inline-block',
                  }}
                />
                <span style={{ fontSize: 12, color: entry.color, whiteSpace: 'nowrap' }}>
                  {entry.name} {entry.value}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 30, right: 110, bottom: 30, left: 110 }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius="80%"
                dataKey="value"
                startAngle={45}
                endAngle={405}
                label={renderLabel}
                labelLine={renderLabelLine}
                isAnimationActive={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
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
      </CardBody>
    </Card>
  )
}

export default PasskeyAuthChart
