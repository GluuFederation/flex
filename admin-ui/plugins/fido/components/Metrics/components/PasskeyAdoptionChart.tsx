import React, { useMemo, useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie } from 'recharts'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import MetricsChartCard from './MetricsChartCard'
import ChartLegend from './ChartLegend'
import TooltipDesign from '@/routes/Dashboards/Chart/TooltipDesign'
import type { TooltipPayloadItem } from '@/routes/Dashboards/types'
import { useMetricsStyles } from '../MetricsPage.style'
import {
  METRICS_CHART_COLORS,
  METRICS_CHART_HEIGHT,
  RECHARTS_INITIAL_DIMENSION,
} from '../constants'
import { useAdoptionMetrics } from '../hooks'
import { formatChartValue, toNumber } from '../utils'
import type {
  AdoptionDonutBox,
  AdoptionSurface,
  ChartSurfaceSize,
  PasskeyAdoptionChartProps,
} from '../types'
import { fontWeights, fontFamily } from '@/styles/fonts'
import useMediaQuery from '@mui/material/useMediaQuery'
import { MEDIA_QUERY_OPTIONS, MOBILE_MEDIA_QUERY, TABLET_MAX_MEDIA_QUERY } from '@/constants'

const ARROW_S = 6
const BAR_SIZE = 68
const BAR_SIZE_NARROW = 40
const DONUT_PLOT_GUTTER = 16
const WIDE_VIEWPORT_BREAKPOINT = 1500
const NARROW_VIEWPORT_BREAKPOINT = 1000
const CHART_MARGIN_DEFAULT = { top: 40, right: 220, bottom: 40, left: 220 }
const CHART_MARGIN_WIDE = { top: 40, right: 340, bottom: 40, left: 100 }
const CHART_MARGIN_NARROW = { top: 44, right: 96, bottom: 44, left: 24 }
const MOBILE_LABEL_FONT_SIZE = 12
const MOBILE_LABEL_VALUE_FONT_SIZE = 13
const Y_TICK_STEP = 2
const SIDE_LABEL_MIN_WIDTH = 150
const NARROW_CONTAINER_WIDTH = 620
const SIDE_LABEL_GUTTER = 12
const Y_MAX = 14
const EMPTY_SURFACE_SIZES: Record<AdoptionSurface, ChartSurfaceSize> = {
  card: { width: 0, height: 0 },
  fullscreen: { width: 0, height: 0 },
}
const EMPTY_DONUT_BOXES: Record<AdoptionSurface, AdoptionDonutBox | null> = {
  card: null,
  fullscreen: null,
}

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

const PasskeyAdoptionChart: React.FC<PasskeyAdoptionChartProps> = ({ dateRange }) => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const themeColors = useMemo(() => getThemeColor(state.theme), [state.theme])
  const isDark = state.theme === THEME_DARK
  const { classes } = useMetricsStyles({ isDark, themeColors })

  const { data: adoptionData } = useAdoptionMetrics(dateRange)

  const rawNewUsers = adoptionData?.newUsers ?? adoptionData?.newRegisteredUsers
  const rawTotalUsers = adoptionData?.totalUniqueUsers ?? adoptionData?.totalRegisteredUsers
  const rawRate = adoptionData?.adoptionRate ?? adoptionData?.adoptionPasskeyRate
  const apiNewUsers = toNumber(rawNewUsers)
  const apiTotalUsers = toNumber(rawTotalUsers)
  const apiRate =
    typeof rawRate === 'number' ? Math.round(rawRate > 1 ? rawRate : rawRate * 100) : 0

  const newRegisteredUsers = apiNewUsers
  const totalRegisteredUsers = apiTotalUsers
  const adoptionPasskeyRate = Math.max(0, Math.min(100, apiRate))

  const existingUsers = Math.max(0, totalRegisteredUsers - newRegisteredUsers)
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card?.background
  const textColor = themeColors.fontColor

  const totalForBar = existingUsers + newRegisteredUsers
  const hasUsers = totalForBar > 0
  const existingShare = hasUsers ? (existingUsers / totalForBar) * Y_MAX : 0
  const newShare = hasUsers ? (newRegisteredUsers / totalForBar) * Y_MAX : 0
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
      { value: adoptionPasskeyRate, fill: METRICS_CHART_COLORS.adoptionRate },
      { value: 100 - adoptionPasskeyRate, fill: themeColors.chart.donutEmptyColor },
    ],
    [adoptionPasskeyRate, themeColors],
  )

  // Measure the chart container to compute bar positions for the SVG overlay
  const [containerSizes, setContainerSizes] =
    useState<Record<AdoptionSurface, ChartSurfaceSize>>(EMPTY_SURFACE_SIZES)
  const [donutBoxes, setDonutBoxes] =
    useState<Record<AdoptionSurface, AdoptionDonutBox | null>>(EMPTY_DONUT_BOXES)

  const donutRefs = useMemo(() => {
    const create = (surface: AdoptionSurface) => (node: HTMLDivElement | null) => {
      if (!node) return
      const measure = () =>
        setDonutBoxes((previous) => ({
          ...previous,
          [surface]: { left: node.offsetLeft, right: node.offsetLeft + node.offsetWidth },
        }))
      measure()
      const ro = new ResizeObserver(measure)
      ro.observe(node)
      if (node.parentElement) ro.observe(node.parentElement)
      return () => ro.disconnect()
    }
    return { card: create('card'), fullscreen: create('fullscreen') }
  }, [])

  const containerRefs = useMemo(() => {
    const create = (surface: AdoptionSurface) => (node: HTMLDivElement | null) => {
      if (!node) return
      const ro = new ResizeObserver((entries) => {
        const { width, height } = entries[0]!.contentRect
        setContainerSizes((previous) => ({ ...previous, [surface]: { width, height } }))
      })
      ro.observe(node)
      return () => ro.disconnect()
    }
    return { card: create('card'), fullscreen: create('fullscreen') }
  }, [])

  const computeUseShiftedMargin = () => {
    if (typeof window === 'undefined') return false
    const w = window.innerWidth
    return w >= WIDE_VIEWPORT_BREAKPOINT || w < NARROW_VIEWPORT_BREAKPOINT
  }

  const [useShiftedMargin, setUseShiftedMargin] = useState(computeUseShiftedMargin)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const onResize = () => setUseShiftedMargin(computeUseShiftedMargin())
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY, MEDIA_QUERY_OPTIONS)
  const isCompact = useMediaQuery(TABLET_MAX_MEDIA_QUERY, MEDIA_QUERY_OPTIONS)

  const chartMargins = useMemo(() => {
    const build = (surface: AdoptionSurface) => {
      const containerSize = containerSizes[surface]
      const donutBox = donutBoxes[surface]
      const hasDonutBox = donutBox !== null && containerSize.width > 0
      const donutReserve = hasDonutBox
        ? Math.max(0, containerSize.width - donutBox.left) + DONUT_PLOT_GUTTER
        : CHART_MARGIN_NARROW.right
      const plotOuterGap = hasDonutBox
        ? Math.max(CHART_MARGIN_NARROW.left, containerSize.width - donutBox.right)
        : CHART_MARGIN_NARROW.left

      return isMobile
        ? { ...CHART_MARGIN_NARROW, right: donutReserve, left: plotOuterGap }
        : useShiftedMargin
          ? CHART_MARGIN_WIDE
          : CHART_MARGIN_DEFAULT
    }
    return { card: build('card'), fullscreen: build('fullscreen') }
  }, [containerSizes, donutBoxes, isMobile, useShiftedMargin])

  const yTicks = useMemo(() => {
    const ticks: number[] = []
    for (let value = 0; value <= Y_MAX; value += Y_TICK_STEP) ticks.push(value)
    return ticks
  }, [])

  const newUsersLabel = t('fields.new_users_label')

  // Compute bar geometry from known chart parameters
  const arrowOverlays = useMemo(() => {
    const build = (surface: AdoptionSurface) => {
      const containerSize = containerSizes[surface]
      const donutBox = donutBoxes[surface]
      const chartMargin = chartMargins[surface]
      const { width, height } = containerSize
      if (width === 0 || height === 0 || !hasUsers) return null

      const plotW = width - chartMargin.left - chartMargin.right
      const plotH = height - chartMargin.top - chartMargin.bottom

      // Bar is centered in the plot area
      const barCenterX = chartMargin.left + plotW / 2
      const barWidth = isMobile ? BAR_SIZE_NARROW : BAR_SIZE
      const barLeft = barCenterX - barWidth / 2
      const barRight = barCenterX + barWidth / 2

      // Y positions (recharts maps domain [0, Y_MAX] linearly onto plotH, top = Y_MAX)
      const yScale = (val: number) => chartMargin.top + plotH * (1 - val / Y_MAX)

      const totalBottom = yScale(0)
      const totalTop = yScale(existingShare + newShare)
      const newSegmentTop = yScale(newShare)

      const hasNewUsers = newShare > 0

      const sideLabelLimit =
        donutBox !== null && donutBox.left > 0 ? donutBox.left - SIDE_LABEL_GUTTER : width
      const stackNewUsersLabel =
        isCompact && sideLabelLimit - (barRight + 28) < SIDE_LABEL_MIN_WIDTH
      const stackSideLabels = isCompact && width < NARROW_CONTAINER_WIDTH

      const midBar = (totalTop + totalBottom) / 2
      const leftArrowX = barLeft - 28
      const rightArrowX = barRight + 28
      const labelY = midBar + 5
      const ARROW_GAP = 20
      const totalColor = METRICS_CHART_COLORS.errorRate
      const newColor = METRICS_CHART_COLORS.newUsers

      return (
        <svg className={classes.adoptionArrowOverlay} width={width} height={height}>
          {/* Left: total span arrow (top of bar → bottom) */}
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
            y2={totalBottom - ARROW_S}
            stroke={newColor}
            strokeWidth={2}
          />
          <Arrowhead x={leftArrowX} y={totalBottom} dir="down" color={newColor} />
          <text
            x={stackSideLabels ? barCenterX : Math.max(barLeft - 10, 118)}
            y={stackSideLabels ? totalTop - 16 : labelY}
            textAnchor={stackSideLabels ? 'middle' : 'end'}
            fontSize={isMobile ? MOBILE_LABEL_FONT_SIZE : 14}
            fontWeight={fontWeights.medium}
            fill={textColor}
            fontFamily={fontFamily}
          >
            {`Total Users: `}
            <tspan
              fontSize={isMobile ? MOBILE_LABEL_VALUE_FONT_SIZE : 16}
              fontWeight={fontWeights.bold}
            >
              {formatChartValue(totalRegisteredUsers)}
            </tspan>
          </text>

          {/* Right: new users segment arrows */}
          {hasNewUsers && (
            <>
              <line
                x1={rightArrowX}
                y1={newSegmentTop + ARROW_S}
                x2={rightArrowX}
                y2={totalBottom - ARROW_S}
                stroke={newColor}
                strokeWidth={2}
              />
              <Arrowhead x={rightArrowX} y={newSegmentTop} dir="up" color={newColor} />
              <Arrowhead x={rightArrowX} y={totalBottom} dir="down" color={newColor} />
            </>
          )}
          <text
            x={stackSideLabels || stackNewUsersLabel ? barCenterX : rightArrowX + 10}
            y={
              stackSideLabels
                ? totalBottom + 26
                : stackNewUsersLabel
                  ? totalTop - 14
                  : hasNewUsers
                    ? newSegmentTop - 8
                    : labelY
            }
            textAnchor={stackSideLabels || stackNewUsersLabel ? 'middle' : 'start'}
            fontSize={isMobile ? MOBILE_LABEL_FONT_SIZE : 14}
            fontWeight={fontWeights.semiBold}
            fill={newColor}
            fontFamily={fontFamily}
          >
            {`${newUsersLabel}: `}
            <tspan
              fontSize={isMobile ? MOBILE_LABEL_VALUE_FONT_SIZE : 18}
              fontWeight={fontWeights.bold}
            >
              {formatChartValue(newRegisteredUsers)}
            </tspan>
          </text>
        </svg>
      )
    }
    return { card: build('card'), fullscreen: build('fullscreen') }
  }, [
    containerSizes,
    chartMargins,
    existingShare,
    newShare,
    totalRegisteredUsers,
    newRegisteredUsers,
    newUsersLabel,
    textColor,
    isMobile,
    isCompact,
    hasUsers,
    donutBoxes,
    classes,
  ])

  const legendItems = [
    {
      key: 'newRegisteredUsers',
      color: METRICS_CHART_COLORS.newUsers,
      label: `${t('fields.new_registered_users')} ${newRegisteredUsers}`,
    },
    {
      key: 'totalRegisteredUsers',
      color: METRICS_CHART_COLORS.totalUsers,
      label: `${t('fields.total_registered_users')} ${totalRegisteredUsers}`,
    },
    {
      key: 'adoptionPasskeyRate',
      color: METRICS_CHART_COLORS.adoptionRate,
      label: `${t('fields.adoption_passkey_rate')} ${adoptionPasskeyRate}%`,
    },
  ]

  const legendRow = (compact: boolean) =>
    compact ? (
      <ChartLegend items={legendItems} />
    ) : (
      <div className={classes.adoptionLegend}>
        {legendItems.map((item) => (
          <div key={item.key} className={classes.adoptionLegendItem}>
            <span className={classes.adoptionLegendDot} style={{ backgroundColor: item.color }} />
            <span className={classes.adoptionLegendLabel}>{item.label}</span>
          </div>
        ))}
      </div>
    )

  const detailedLayout = (isFullscreen: boolean) => {
    const surface: AdoptionSurface = isFullscreen ? 'fullscreen' : 'card'
    const chartMargin = chartMargins[surface]

    return (
      <div className={classes.adoptionChartWrapper}>
        <div className={classes.adoptionChartRow}>
          <div className={classes.adoptionYAxisColumn}>
            <div
              className={classes.adoptionYAxisTicks}
              style={{ top: chartMargin.top, bottom: chartMargin.bottom }}
            >
              {yTicks.map((tick) => (
                <span
                  key={tick}
                  className={classes.adoptionYAxisTick}
                  style={{ top: `${(1 - tick / Y_MAX) * 100}%` }}
                >
                  {tick}
                </span>
              ))}
            </div>
          </div>

          <div className={classes.adoptionDottedBox}>
            <div ref={containerRefs[surface]} className={classes.adoptionChartCanvas}>
              <ResponsiveContainer
                width="100%"
                height="100%"
                initialDimension={RECHARTS_INITIAL_DIMENSION}
              >
                <BarChart data={barData} barSize={BAR_SIZE} margin={chartMargin}>
                  <YAxis width={0} domain={[0, Y_MAX]} hide />
                  <XAxis dataKey="name" hide />
                  <Tooltip
                    cursor={false}
                    content={({ payload: rawPayload, active }) => {
                      const payload = rawPayload as ReadonlyArray<TooltipPayloadItem> | undefined
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
                          active={active}
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
                    fill={METRICS_CHART_COLORS.newUsers}
                    stackId="a"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
              {arrowOverlays[surface]}
            </div>

            <div ref={donutRefs[surface]} className={classes.adoptionDonutOverlay}>
              <div className={classes.adoptionDonutWrapper}>
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                  initialDimension={RECHARTS_INITIAL_DIMENSION}
                >
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
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className={classes.adoptionDonutCenter}>
                  {!isMobile && (
                    <div className={classes.adoptionDonutLabel}>{t('fields.adoption_rate')}</div>
                  )}
                  <div className={classes.adoptionDonutValue}>{adoptionPasskeyRate}%</div>
                </div>
              </div>
              {isMobile && (
                <div className={classes.adoptionDonutCaption}>{t('fields.adoption_rate')}</div>
              )}
            </div>
          </div>
        </div>

        {!isFullscreen && legendRow(isCompact)}
      </div>
    )
  }

  const renderChart = (isFullscreen: boolean, zoom: number) => {
    if (!isFullscreen) return detailedLayout(false)
    return (
      <>
        <div className={classes.chartFullscreenFrame} data-chart-frame>
          <div
            className={classes.adoptionFullscreenArea}
            style={{
              height: METRICS_CHART_HEIGHT.FULLSCREEN * zoom,
              width: `${zoom * 100}%`,
              flexShrink: 0,
            }}
          >
            {detailedLayout(true)}
          </div>
        </div>
        {legendRow(isCompact)}
      </>
    )
  }

  return (
    <MetricsChartCard
      title={t('titles.passkey_adoption_rate')}
      cardClassName="h-100"
      bodyClassName={classes.chartCardBody}
      zoomable
    >
      {renderChart}
    </MetricsChartCard>
  )
}

export default React.memo(PasskeyAdoptionChart)
