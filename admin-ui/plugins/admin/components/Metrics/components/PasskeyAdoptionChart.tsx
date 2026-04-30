import React, { useMemo } from 'react'
import { Card, CardBody } from 'Components'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Customized,
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
import { useAdoptionMetrics } from '../hooks'
import type { MetricsDateRange } from '../types'
import { fontWeights, fontSizes, fontFamily } from '@/styles/fonts'

const ARROW_S = 6

const Arrowhead: React.FC<{ x: number; y: number; dir: 'up' | 'down'; color: string }> = ({
  x,
  y,
  dir,
  color,
}) => {
  const pts =
    dir === 'down'
      ? `${x - ARROW_S / 2},${y - ARROW_S} ${x + ARROW_S / 2},${y - ARROW_S} ${x},${y}`
      : `${x - ARROW_S / 2},${y + ARROW_S} ${x + ARROW_S / 2},${y + ARROW_S} ${x},${y}`
  return <polygon points={pts} fill={color} />
}

const CHART_MARGIN = { top: 40, right: 220, bottom: 40, left: 220 }
const Y_TICKS = [12, 10, 8, 6, 4, 2]
const Y_MAX = 14

interface PasskeyAdoptionChartProps {
  dateRange: MetricsDateRange | null
}

interface BarItemData {
  x: number
  y: number
  width: number
  height: number
}

interface BarArrowsProps {
  formattedGraphicalItems?: Array<{ props: { data?: BarItemData[] } }>
}

const toNumber = (value: number | string | boolean | null | undefined): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  return 0
}

const PasskeyAdoptionChart: React.FC<PasskeyAdoptionChartProps> = ({ dateRange }) => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const themeColors = getThemeColor(state.theme)
  const isDark = state.theme === THEME_DARK
  const { classes } = useMetricsStyles({ isDark, themeColors })

  const { data: adoptionData } = useAdoptionMetrics(dateRange)

  const apiNewUsers = toNumber(adoptionData?.newUsers ?? adoptionData?.newRegisteredUsers)
  const apiTotalUsers = toNumber(
    adoptionData?.totalUniqueUsers ?? adoptionData?.totalRegisteredUsers,
  )
  const rawRate = adoptionData?.adoptionRate ?? adoptionData?.adoptionPasskeyRate
  const apiRate =
    typeof rawRate === 'number' ? Math.round(rawRate > 1 ? rawRate : rawRate * 100) : 0

  const hasApiData = apiNewUsers > 0 || apiTotalUsers > 0 || apiRate > 0
  const mock = MOCK_METRICS_DATA.adoption
  const newRegisteredUsers = hasApiData ? apiNewUsers : mock.newRegisteredUsers
  const totalRegisteredUsers = hasApiData ? apiTotalUsers : mock.totalRegisteredUsers
  const adoptionPasskeyRate = Math.max(
    0,
    Math.min(100, hasApiData ? apiRate : mock.adoptionPasskeyRate),
  )

  const existingUsers = Math.max(0, totalRegisteredUsers - newRegisteredUsers)
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card?.background
  const borderColor = themeColors.borderColor
  const textColor = themeColors.fontColor

  const totalForBar = existingUsers + newRegisteredUsers
  const existingShare = totalForBar > 0 ? (existingUsers / totalForBar) * Y_MAX : 0
  const newShare =
    totalForBar > 0 ? (newRegisteredUsers / totalForBar) * Y_MAX : existingUsers > 0 ? 0 : Y_MAX
  const barData = [
    {
      name: 'Users',
      existingUsers: existingShare,
      newRegisteredUsers: newShare,
      existingUsersCount: existingUsers,
      newRegisteredUsersCount: newRegisteredUsers,
    },
  ]

  const donutData = useMemo(
    () => [
      { value: adoptionPasskeyRate, color: METRICS_CHART_COLORS.adoptionRate },
      { value: 100 - adoptionPasskeyRate, color: themeColors.chart.donutEmptyColor },
    ],
    [adoptionPasskeyRate, themeColors],
  )

  const BarArrows = (props: BarArrowsProps) => {
    const { formattedGraphicalItems } = props
    const eBar = formattedGraphicalItems?.[0]?.props?.data?.[0]
    const nBar = formattedGraphicalItems?.[1]?.props?.data?.[0]
    if (!eBar || !nBar) return null

    const barLeft = eBar.x as number
    const barRight = (eBar.x as number) + (eBar.width as number)
    const barBottom = (eBar.y as number) + (eBar.height as number)
    const totalTop = nBar.y as number
    const newTop = nBar.y as number
    const newBottom = (nBar.y as number) + (nBar.height as number)
    const midBar = (totalTop + barBottom) / 2
    const leftArrowX = barLeft - 28
    const rightArrowX = barRight + 28
    const totalColor = METRICS_CHART_COLORS.errorRate
    const newColor = METRICS_CHART_COLORS.newUsers

    const labelY = midBar + 5
    const ARROW_GAP = 20

    return (
      <g>
        <line
          x1={leftArrowX}
          y1={totalTop + ARROW_S}
          x2={leftArrowX}
          y2={labelY - ARROW_GAP}
          stroke={totalColor}
          strokeWidth={2}
        />
        <Arrowhead x={leftArrowX} y={totalTop} dir="up" color={totalColor} />
        <line
          x1={leftArrowX}
          y1={labelY + ARROW_GAP}
          x2={leftArrowX}
          y2={barBottom - ARROW_S}
          stroke={newColor}
          strokeWidth={2}
        />
        <Arrowhead x={leftArrowX} y={barBottom} dir="down" color={newColor} />
        <text
          x={barLeft - 10}
          y={labelY}
          textAnchor="end"
          fontSize={14}
          fontWeight={fontWeights.medium}
          fill={textColor}
          fontFamily={fontFamily}
        >
          {t('fields.total_users_label')}:{' '}
          <tspan fontSize={16} fontWeight={fontWeights.bold}>
            {totalRegisteredUsers}
          </tspan>
        </text>
        <line
          x1={rightArrowX}
          y1={newTop + ARROW_S}
          x2={rightArrowX}
          y2={newBottom - ARROW_S}
          stroke={newColor}
          strokeWidth={2}
        />
        <Arrowhead x={rightArrowX} y={newTop} dir="up" color={newColor} />
        <Arrowhead x={rightArrowX} y={newBottom} dir="down" color={newColor} />
      </g>
    )
  }

  return (
    <Card className={`${classes.chartCard} h-100`}>
      <CardBody style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <GluuText variant="div" className={classes.chartTitle}>
          {t('titles.passkey_adoption_rate')}
        </GluuText>

        <div className={classes.adoptionChartWrapper}>
          <div className={classes.adoptionYAxisColumn}>
            <div className={classes.adoptionYAxisTicks}>
              {Y_TICKS.map((n) => (
                <span key={n} style={{ fontSize: 11, color: textColor, lineHeight: 1 }}>
                  {n}
                </span>
              ))}
            </div>
          </div>

          <div
            className={classes.adoptionDottedBox}
            style={{ border: `1px dashed ${borderColor}` }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barSize={68} margin={CHART_MARGIN}>
                <YAxis width={0} domain={[0, Y_MAX]} hide />
                <XAxis dataKey="name" hide />
                <Tooltip
                  cursor={false}
                  content={(props: TooltipProps<number, string>) => {
                    const payload = props.payload as TooltipPayloadItem[] | undefined
                    const remappedPayload: TooltipPayloadItem[] | undefined = payload?.map(
                      (item) => {
                        const realKey =
                          item.dataKey === 'existingUsers'
                            ? 'existingUsersCount'
                            : item.dataKey === 'newRegisteredUsers'
                              ? 'newRegisteredUsersCount'
                              : null
                        if (!realKey) return item
                        const realValueRaw = (
                          item.payload as Record<string, number | undefined> | undefined
                        )?.[realKey]
                        const realValue = typeof realValueRaw === 'number' ? realValueRaw : 0
                        return {
                          ...item,
                          value: realValue,
                          payload: {
                            ...(item.payload ?? {}),
                            [item.dataKey as string]: realValue,
                          },
                        }
                      },
                    )
                    return (
                      <TooltipDesign
                        payload={remappedPayload}
                        active={props.active}
                        backgroundColor={cardBg}
                        textColor={textColor}
                        isDark={isDark}
                      />
                    )
                  }}
                />
                <Bar
                  dataKey="existingUsers"
                  name={t('fields.total_registered_users')}
                  fill={METRICS_CHART_COLORS.totalUsers}
                  stackId="a"
                  radius={[0, 0, 4, 4]}
                />
                <Bar
                  dataKey="newRegisteredUsers"
                  name={t('fields.new_registered_users')}
                  fill={METRICS_CHART_COLORS.errorRate}
                  stackId="a"
                  radius={[4, 4, 0, 0]}
                />
                <Customized component={BarArrows} />
              </BarChart>
            </ResponsiveContainer>

            <div className={classes.adoptionStatsLabels}>
              <div
                style={{
                  color: METRICS_CHART_COLORS.newUsers,
                  fontSize: fontSizes.sm,
                  fontWeight: fontWeights.semiBold,
                  fontFamily,
                }}
              >
                {t('fields.new_registered_users')} {newRegisteredUsers}
              </div>
              <div
                style={{
                  color: textColor,
                  fontSize: fontSizes.sm,
                  fontWeight: fontWeights.semiBold,
                  fontFamily,
                }}
              >
                {t('fields.total_registered_users')} {totalRegisteredUsers}
              </div>
              <div
                style={{
                  color: METRICS_CHART_COLORS.adoptionRate,
                  fontSize: fontSizes.sm,
                  fontWeight: fontWeights.semiBold,
                  fontFamily,
                }}
              >
                {t('fields.adoption_passkey_rate')} {adoptionPasskeyRate}%
              </div>
            </div>

            <div className={classes.adoptionNewUsersOverlay}>
              <span
                style={{
                  color: METRICS_CHART_COLORS.newUsers,
                  fontSize: fontSizes.base,
                  fontWeight: fontWeights.semiBold,
                  fontFamily,
                }}
              >
                {t('fields.new_users_label')}:{' '}
              </span>
              <span
                style={{
                  color: METRICS_CHART_COLORS.newUsers,
                  fontSize: fontSizes.xl,
                  fontWeight: fontWeights.bold,
                  fontFamily,
                }}
              >
                {newRegisteredUsers}
              </span>
            </div>

            <div className={classes.adoptionDonutOverlay}>
              <div className={classes.adoptionDonutWrapper}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius="65%"
                      outerRadius="90%"
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                      strokeWidth={0}
                      isAnimationActive={false}
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={`donut-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className={classes.adoptionDonutCenter}>
                  <div
                    style={{
                      color: METRICS_CHART_COLORS.adoptionRate,
                      fontWeight: fontWeights.semiBold,
                      fontSize: fontSizes.sm,
                      fontFamily,
                    }}
                  >
                    {t('fields.adoption_rate')}
                  </div>
                  <div
                    style={{
                      color: METRICS_CHART_COLORS.adoptionRate,
                      fontWeight: fontWeights.bold,
                      fontSize: fontSizes.lg,
                      fontFamily,
                    }}
                  >
                    {adoptionPasskeyRate}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default PasskeyAdoptionChart
