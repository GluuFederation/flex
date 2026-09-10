import React, { useCallback, useMemo, useState } from 'react'
import { PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import TooltipDesign from '@/routes/Dashboards/Chart/TooltipDesign'
import type { TooltipPayloadItem } from '@/routes/Dashboards/types'
import { useMetricsStyles } from '../MetricsPage.style'
import {
  METRICS_CHART_COLORS,
  METRICS_CHART_HEIGHT,
  METRICS_DESKTOP_CHART,
  METRICS_MOBILE_CHART,
  RADIAN,
  RECHARTS_INITIAL_DIMENSION,
} from '../constants'
import useMediaQuery from '@mui/material/useMediaQuery'
import {
  MEDIA_QUERY_OPTIONS,
  MOBILE_MEDIA_QUERY,
  STACKED_CHART_MAX_MEDIA_QUERY,
  TABLET_MAX_MEDIA_QUERY,
} from '@/constants'
import { useErrorsAnalytics } from '../hooks'
import { toPercent } from '../utils'
import MetricsChartCard from './MetricsChartCard'
import ChartLegend from './ChartLegend'
import type { PasskeyAuthChartProps } from '../types'

import type { PieLabelRenderProps } from 'recharts'

const PIE_LABEL_RESERVE_RATIO = 0.19
const PIE_LABEL_RESERVE_MIN = 64
const PIE_LABEL_RESERVE_MAX = 150
const PIE_STACKED_PADDING = 12
const PIE_COMPACT_LABEL_RESERVE_MIN = 48
const PIE_STACKED_MIN_HEIGHT = 200
const PIE_STACKED_MAX_HEIGHT = METRICS_CHART_HEIGHT.DESKTOP
const PIE_STACKED_RADIUS = '94%'

const PasskeyAuthChart: React.FC<PasskeyAuthChartProps> = ({ dateRange }) => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const themeColors = useMemo(() => getThemeColor(state.theme), [state.theme])
  const isDark = state.theme === THEME_DARK
  const { classes } = useMetricsStyles({ isDark, themeColors })

  const { data: errorsData } = useErrorsAnalytics(dateRange)

  const data = useMemo(
    () => [
      {
        name: t('fields.success_rate'),
        value: toPercent(errorsData?.successRate),
        fill: METRICS_CHART_COLORS.successRate,
      },
      {
        name: t('fields.error_rate'),
        value: toPercent(errorsData?.failureRate),
        fill: METRICS_CHART_COLORS.errorRate,
      },
      {
        name: t('fields.drop_off_rate'),
        value: toPercent(errorsData?.dropOffRate),
        fill: METRICS_CHART_COLORS.dropOffRate,
      },
    ],
    [t, errorsData],
  )

  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY, MEDIA_QUERY_OPTIONS)
  const isStacked = useMediaQuery(STACKED_CHART_MAX_MEDIA_QUERY, MEDIA_QUERY_OPTIONS)
  const isCompact = useMediaQuery(TABLET_MAX_MEDIA_QUERY, MEDIA_QUERY_OPTIONS)
  const [canvasWidth, setCanvasWidth] = useState(0)

  const canvasRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return
    const ro = new ResizeObserver((entries) => setCanvasWidth(entries[0]!.contentRect.width))
    ro.observe(node)
    return () => ro.disconnect()
  }, [])
  const chartGeometry = isMobile ? METRICS_MOBILE_CHART : METRICS_DESKTOP_CHART

  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card?.background

  const renderLabel = (props: PieLabelRenderProps) => {
    const { cx, cy, midAngle, outerRadius, percent, index, value } = props
    const entry = data[index as number]
    if (!entry || !percent || !value) return null

    const angle = midAngle ?? 0
    const LABEL_RADIUS = (outerRadius as number) + chartGeometry.PIE_LABEL_OFFSET
    const x = (cx as number) + LABEL_RADIUS * Math.cos(-angle * RADIAN)
    const y = (cy as number) + LABEL_RADIUS * Math.sin(-angle * RADIAN)
    const anchor = x > cx ? 'start' : 'end'
    const pct = `${(percent * 100).toFixed(0)}%`

    return (
      <text
        x={x}
        y={y}
        fill={entry.fill}
        textAnchor={anchor}
        fontSize={chartGeometry.PIE_LABEL_FONT_SIZE}
        fontWeight="700"
      >
        <tspan x={x} dy={-chartGeometry.PIE_LABEL_LINE_TOP}>
          {entry.name}
        </tspan>
        <tspan x={x} dy={chartGeometry.PIE_LABEL_LINE_GAP}>
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
    const x2 = cxN + (r + chartGeometry.PIE_LABEL_LINE_OFFSET) * Math.cos(-angle * RADIAN)
    const y2 = cyN + (r + chartGeometry.PIE_LABEL_LINE_OFFSET) * Math.sin(-angle * RADIAN)

    return (
      <line
        key={`ll-${index}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={entry.fill}
        strokeWidth={1.5}
      />
    )
  }

  const legendItems = data.map((entry) => ({
    key: entry.name,
    color: entry.fill,
    label: `${entry.name} ${entry.value}%`,
    labelColor: entry.fill,
  }))

  const renderChart = (isFullscreen: boolean, zoom: number) => {
    const sizeByWidth = isStacked && !isFullscreen && canvasWidth > 0
    const compactInnerHeight = METRICS_CHART_HEIGHT.COMPACT - PIE_STACKED_PADDING * 2
    const labelReserve =
      isCompact && !isFullscreen
        ? Math.max(PIE_COMPACT_LABEL_RESERVE_MIN, (canvasWidth - compactInnerHeight) / 2)
        : Math.min(
            PIE_LABEL_RESERVE_MAX,
            Math.max(PIE_LABEL_RESERVE_MIN, canvasWidth * PIE_LABEL_RESERVE_RATIO),
          )
    const stackedHeight = Math.min(
      PIE_STACKED_MAX_HEIGHT,
      Math.max(PIE_STACKED_MIN_HEIGHT, canvasWidth - labelReserve * 2 + PIE_STACKED_PADDING * 2),
    )
    const canvasHeight = isFullscreen
      ? METRICS_CHART_HEIGHT.FULLSCREEN * zoom
      : isCompact
        ? METRICS_CHART_HEIGHT.COMPACT
        : sizeByWidth
          ? stackedHeight
          : undefined

    const canvas = (
      <div
        ref={isFullscreen ? undefined : canvasRef}
        className={classes.authChartCanvas}
        style={
          canvasHeight
            ? {
                height: canvasHeight,
                width: isFullscreen ? `${zoom * 100}%` : undefined,
                flexShrink: isFullscreen ? 0 : undefined,
              }
            : undefined
        }
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={RECHARTS_INITIAL_DIMENSION}
        >
          <PieChart
            margin={
              sizeByWidth
                ? {
                    top: PIE_STACKED_PADDING,
                    right: labelReserve,
                    bottom: PIE_STACKED_PADDING,
                    left: labelReserve,
                  }
                : chartGeometry.PIE_MARGIN
            }
          >
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={sizeByWidth ? PIE_STACKED_RADIUS : chartGeometry.PIE_OUTER_RADIUS}
              dataKey="value"
              startAngle={45}
              endAngle={405}
              label={renderLabel}
              labelLine={renderLabelLine}
              isAnimationActive={false}
            />
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
    )

    return (
      <>
        <div className={classes.authChartHeader}>
          <GluuText variant="div" className={classes.chartTitle}>
            {t('titles.passkey_authentication')}
          </GluuText>
        </div>

        {isFullscreen ? (
          <div className={classes.chartFullscreenFrame} data-chart-frame>
            {canvas}
          </div>
        ) : (
          canvas
        )}

        <ChartLegend items={legendItems} />
      </>
    )
  }

  return (
    <MetricsChartCard
      title={t('titles.passkey_authentication')}
      cardClassName="h-100"
      bodyClassName={classes.chartCardBody}
      hideTitle
      zoomable
    >
      {renderChart}
    </MetricsChartCard>
  )
}

export default React.memo(PasskeyAuthChart)
