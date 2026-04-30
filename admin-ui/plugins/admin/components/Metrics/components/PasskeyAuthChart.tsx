import React, { useMemo } from 'react'
import { Card, CardBody } from 'Components'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
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
import { useErrorsAnalytics } from '../hooks'
import type { MetricsDateRange } from '../types'

const RADIAN = Math.PI / 180

interface LabelProps {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
  index: number
  value?: number
}

interface PasskeyAuthChartProps {
  dateRange: MetricsDateRange | null
}

const toPercent = (value: number | undefined): number => {
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

  const hasApiData =
    !!errorsData &&
    [errorsData.successRate, errorsData.failureRate, errorsData.dropOffRate].some(
      (v) => typeof v === 'number' && v > 0,
    )

  const data = useMemo(() => {
    if (!hasApiData) {
      return MOCK_METRICS_DATA.passkeyAuth.map((entry) => ({
        name: t(entry.name),
        value: entry.value,
        color: entry.color,
      }))
    }
    return [
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
    ]
  }, [t, errorsData, hasApiData])

  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card?.background

  const renderLabel = (props: LabelProps) => {
    const { cx, cy, midAngle, outerRadius, percent, index, value } = props
    const entry = data[index]
    if (!entry || percent === 0 || !value) return null

    const LABEL_RADIUS = outerRadius + 36
    const x = cx + LABEL_RADIUS * Math.cos(-midAngle * RADIAN)
    const y = cy + LABEL_RADIUS * Math.sin(-midAngle * RADIAN)
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

  const renderLabelLine = (props: LabelProps) => {
    const { cx, cy, midAngle, outerRadius, index, percent, value } = props
    const entry = data[index]
    if (!entry || percent === 0 || !value) return null

    const x1 = cx + (outerRadius + 4) * Math.cos(-midAngle * RADIAN)
    const y1 = cy + (outerRadius + 4) * Math.sin(-midAngle * RADIAN)
    const x2 = cx + (outerRadius + 22) * Math.cos(-midAngle * RADIAN)
    const y2 = cy + (outerRadius + 22) * Math.sin(-midAngle * RADIAN)

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
                labelLine={renderLabelLine as (props: LabelProps) => React.ReactElement<SVGElement>}
                isAnimationActive={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
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
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  )
}

export default PasskeyAuthChart
