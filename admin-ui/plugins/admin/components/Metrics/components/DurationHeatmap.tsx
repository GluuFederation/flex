import React, { useMemo } from 'react'
import { Card, CardBody } from 'Components'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import customColors from '@/customColors'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { useMetricsStyles } from '../MetricsPage.style'
import { HEATMAP_COLOR_STOPS } from '../constants'

export interface HeatmapData {
  rows: readonly string[]
  cols: readonly string[]
  colsSub?: readonly string[]
  data: readonly (readonly number[])[]
  minVal: number
  maxVal: number
}

interface DurationHeatmapProps {
  title: string
  heatmapData: HeatmapData
  xAxisLabel?: string
  yAxisLabel?: string
  caption?: string
  colorBarLabel?: string
  compact?: boolean
  minHeight?: number
  maxCellHeight?: number
  minColorBarHeight?: number
  verticalRowLabels?: boolean
  colLabelsBottom?: boolean
  emptyStateCols?: number
}

const interpolateHeatmapColor = (value: number, min: number, max: number): string => {
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)))
  const stops = HEATMAP_COLOR_STOPS
  for (let i = 0; i < stops.length - 1; i++) {
    const s0 = stops[i]!
    const s1 = stops[i + 1]!
    if (t >= s0.stop && t <= s1.stop) {
      const localT = (t - s0.stop) / (s1.stop - s0.stop)
      return lerpColor(s0.color, s1.color, localT)
    }
  }
  return stops[stops.length - 1]!.color
}

const hexToRgb = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return [r, g, b]
}

const lerpColor = (hexA: string, hexB: string, t: number): string => {
  const [r1, g1, b1] = hexToRgb(hexA)
  const [r2, g2, b2] = hexToRgb(hexB)
  const r = Math.round(r1 + (r2 - r1) * t)
  const g = Math.round(g1 + (g2 - g1) * t)
  const b = Math.round(b1 + (b2 - b1) * t)
  return `rgb(${r},${g},${b})`
}

const getNiceStep = (min: number, max: number, targetTicks = 6): number => {
  const range = max - min
  if (range <= 0) return 1
  const rough = range / targetTicks
  const pow10 = Math.pow(10, Math.floor(Math.log10(rough)))
  const norm = rough / pow10
  let nice: number
  if (norm < 1.5) nice = 1
  else if (norm < 3) nice = 2
  else if (norm < 7) nice = 5
  else nice = 10
  return nice * pow10
}

const ColorBar: React.FC<{
  minVal: number
  maxVal: number
  height: number
  textColor: string
  barWidth?: number
}> = ({ minVal, maxVal, height, textColor, barWidth = 18 }) => {
  const stops = HEATMAP_COLOR_STOPS
  const gradientId = 'heatmap-grad'
  const step = getNiceStep(minVal, maxVal)
  const firstTick = Math.ceil(minVal / step) * step
  const steps: number[] = []
  for (let v = firstTick; v <= maxVal + 1e-9; v += step) {
    steps.push(Number(v.toFixed(10)))
  }
  const isIntegerStep = step >= 1 && Number.isInteger(step)
  const format = (v: number): string => (isIntegerStep ? Math.round(v).toString() : v.toFixed(1))
  const labelX = barWidth + 4
  const svgWidth = labelX + 18
  const verticalPadding = 8
  const barHeight = Math.max(0, height - verticalPadding * 2)
  return (
    <svg width={svgWidth} height={height} style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          {stops.map((s, i) => (
            <stop key={i} offset={`${s.stop * 100}%`} stopColor={s.color} />
          ))}
        </linearGradient>
      </defs>
      <rect
        x={0}
        y={verticalPadding}
        width={barWidth}
        height={barHeight}
        fill={`url(#${gradientId})`}
        rx={2}
      />
      {steps.map((v) => {
        const range = maxVal - minVal
        const y =
          range === 0 ? verticalPadding + barHeight / 2 : verticalPadding + ((maxVal - v) / range) * barHeight
        return (
          <text
            key={v}
            x={labelX}
            y={y + 4}
            fontSize={9}
            fill={textColor}
            dominantBaseline="middle"
          >
            {format(v)}
          </text>
        )
      })}
    </svg>
  )
}

const DurationHeatmap: React.FC<DurationHeatmapProps> = ({
  title,
  heatmapData,
  xAxisLabel,
  yAxisLabel,
  caption,
  colorBarLabel,
  compact = false,
  minHeight,
  maxCellHeight,
  minColorBarHeight,
  verticalRowLabels = false,
  colLabelsBottom = false,
  emptyStateCols,
}) => {
  const { state } = useTheme()
  const themeColors = getThemeColor(state.theme)
  const isDark = state.theme === THEME_DARK
  const { classes } = useMetricsStyles({ isDark, themeColors })

  const { rows, cols, colsSub, data, minVal, maxVal } = heatmapData
  const hasColsSub = Boolean(colsSub && colsSub.length === cols.length)

  const colLabelH = compact ? 20 : hasColsSub || colLabelsBottom ? 0 : 28
  const bottomColLabelH = hasColsSub ? 40 : colLabelsBottom ? 24 : 0
  const xAxisH = xAxisLabel ? 28 : 0
  const reservedH = colLabelH + bottomColLabelH + xAxisH
  const effectiveCompactMinHeight = compact ? (minHeight ?? 460) : undefined
  const baseCellH = compact ? 36 : 56
  const fallbackCols = emptyStateCols ?? (compact ? 24 : minHeight ? 4 : 6)
  const layoutColsLen = cols.length > 0 ? cols.length : fallbackCols
  const rowsCount = Math.max(rows.length, 1)
  const safeColsLen = Math.max(layoutColsLen, 1)
  const cellH = compact
    ? Math.min(
        maxCellHeight ?? 90,
        Math.max(
          baseCellH,
          Math.floor(((effectiveCompactMinHeight ?? 460) - 80 - reservedH) / rowsCount),
        ),
      )
    : minHeight
      ? Math.min(
          maxCellHeight ?? Infinity,
          Math.max(baseCellH, Math.floor((minHeight - 80 - reservedH) / rowsCount)),
        )
      : baseCellH
  const cellW = compact
    ? Math.min(56, Math.max(32, Math.round(900 / safeColsLen)))
    : minHeight
      ? Math.max(110, Math.round(500 / safeColsLen))
      : Math.max(60, Math.floor(560 / safeColsLen))
  const isDailyLayout = !compact && !minHeight
  const colorBarW = isDailyLayout ? 36 : 44
  const colorBarLabelW = colorBarLabel ? 16 : 0
  const axisFontSize = compact ? 10 : isDailyLayout ? 6 : 12
  const rowLabelFontSize = compact ? 11 : minHeight ? 14 : verticalRowLabels ? 6 : 11
  const rowLabelW = compact ? 64 : minHeight ? 110 : verticalRowLabels ? rowLabelFontSize + 24 : 100
  const cellFontSize = compact
    ? Math.min(11, Math.max(8, Math.round(cellW * 0.28)))
    : minHeight
      ? Math.min(32, Math.max(14, Math.round(cellH * 0.26)))
      : 11

  const isEmpty = rows.length === 0 || cols.length === 0
  const fallbackRows = compact ? 12 : 2
  const layoutGridHeight = isEmpty
    ? minHeight
      ? minHeight - 80 - reservedH
      : compact
        ? (effectiveCompactMinHeight ?? 460) - 80 - reservedH
        : fallbackRows * baseCellH
    : rowsCount * cellH
  const gridHeight = layoutGridHeight
  const colorBarHeight = minColorBarHeight
    ? Math.max(layoutGridHeight, minColorBarHeight)
    : layoutGridHeight
  const gridRightX = rowLabelW + layoutColsLen * cellW

  const svgWidth = gridRightX + colorBarW + 8 + colorBarLabelW
  const svgHeight = colLabelH + Math.max(gridHeight, colorBarHeight) + bottomColLabelH + xAxisH

  const cells = useMemo(() => {
    return rows.flatMap((_, ri) =>
      cols.map((_, ci) => {
        const value = data[ri]?.[ci] ?? minVal
        return { ri, ci, value, color: interpolateHeatmapColor(value, minVal, maxVal) }
      }),
    )
  }, [rows, cols, data, minVal, maxVal])

  const textColor = themeColors.fontColor
  const borderColor = themeColors.chart.cellBorderColor

  return (
    <Card className={`${classes.chartCard} h-100`} style={minHeight ? { minHeight } : undefined}>
      <CardBody>
        <GluuText variant="div" className={classes.chartTitle}>
          {title}
        </GluuText>
        {caption && (
          <GluuText
            variant="div"
            secondary
            style={{ textAlign: 'center', fontSize: 11, marginBottom: 12 }}
          >
            {caption}
          </GluuText>
        )}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: verticalRowLabels ? 12 : 4 }}>
          {yAxisLabel && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                writingMode: 'vertical-lr',
                transform: 'rotate(180deg)',
                fontSize: verticalRowLabels ? 11 : rowLabelFontSize,
                color: textColor,
                opacity: 0.6,
                minWidth: 16,
                alignSelf: 'stretch',
              }}
            >
              {yAxisLabel}
            </div>
          )}

          <div style={{ flex: 1, minWidth: 0, overflowX: 'auto' }}>
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="xMidYMid meet"
              style={{
                display: 'block',
                width: '100%',
                ...(compact ? { maxWidth: svgWidth } : {}),
                height: 'auto',
              }}
            >
              {!colLabelsBottom &&
                cols.map((col, ci) => {
                  const cx = rowLabelW + ci * cellW + cellW / 2
                  if (hasColsSub) {
                    return (
                      <g key={`ch-${ci}`}>
                        <text
                          x={cx}
                          y={colLabelH - 28}
                          textAnchor="middle"
                          fontSize={axisFontSize}
                          fill={textColor}
                          opacity={0.8}
                          fontWeight={600}
                        >
                          {col}
                        </text>
                        <text
                          x={cx}
                          y={colLabelH - 8}
                          textAnchor="middle"
                          fontSize={axisFontSize - 1}
                          fill={textColor}
                          opacity={0.55}
                        >
                          {colsSub![ci]}
                        </text>
                      </g>
                    )
                  }
                  return (
                    <text
                      key={`ch-${ci}`}
                      x={cx}
                      y={colLabelH - 4}
                      textAnchor="middle"
                      fontSize={axisFontSize}
                      fill={textColor}
                      opacity={0.7}
                    >
                      {col}
                    </text>
                  )
                })}

              {(hasColsSub || colLabelsBottom) &&
                cols.map((col, ci) => {
                  const cx = rowLabelW + ci * cellW + cellW / 2
                  const baseY = colLabelH + rows.length * cellH
                  if (hasColsSub) {
                    return (
                      <g key={`chb-${ci}`}>
                        <text
                          x={cx}
                          y={baseY + 20}
                          textAnchor="middle"
                          fontSize={axisFontSize}
                          fill={textColor}
                          opacity={0.8}
                          fontWeight={600}
                        >
                          {col}
                        </text>
                        <text
                          x={cx}
                          y={baseY + 40}
                          textAnchor="middle"
                          fontSize={axisFontSize - 1}
                          fill={textColor}
                          opacity={0.55}
                        >
                          {colsSub![ci]}
                        </text>
                      </g>
                    )
                  }
                  return (
                    <text
                      key={`chb-${ci}`}
                      x={cx}
                      y={baseY + 16}
                      textAnchor="middle"
                      fontSize={axisFontSize}
                      fill={textColor}
                      opacity={0.7}
                    >
                      {col}
                    </text>
                  )
                })}

              {rows.map((row, ri) => {
                const cy = colLabelH + ri * cellH + cellH / 2
                const cx = verticalRowLabels ? rowLabelW / 2 : rowLabelW - 4
                return verticalRowLabels ? (
                  <text
                    key={`rl-${ri}`}
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={rowLabelFontSize}
                    fill={textColor}
                    opacity={0.7}
                    transform={`rotate(-90, ${cx}, ${cy})`}
                  >
                    {row}
                  </text>
                ) : (
                  <text
                    key={`rl-${ri}`}
                    x={cx}
                    y={cy}
                    textAnchor="end"
                    dominantBaseline="middle"
                    fontSize={rowLabelFontSize}
                    fill={textColor}
                    opacity={0.7}
                  >
                    {row}
                  </text>
                )
              })}

              {cells.map(({ ri, ci, value, color }) => {
                const x = rowLabelW + ci * cellW
                const y = colLabelH + ri * cellH
                const brightness = parseInt(color.replace(/[^\d,]/g, '').split(',')[0] ?? '100')
                const cellTextColor = brightness < 160 ? customColors.white : customColors.nearBlack
                return (
                  <g key={`cell-${ri}-${ci}`}>
                    <rect
                      x={x + 0.5}
                      y={y + 0.5}
                      width={cellW - 1}
                      height={cellH - 1}
                      fill={color}
                      rx={compact ? 2 : 4}
                      stroke={borderColor}
                      strokeWidth={0.5}
                    />
                    <text
                      x={x + cellW / 2}
                      y={y + cellH / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={cellFontSize}
                      fill={cellTextColor}
                      fontWeight={compact ? 400 : 600}
                    >
                      {value}
                    </text>
                  </g>
                )
              })}

              <foreignObject
                x={gridRightX + 8}
                y={colLabelH}
                width={colorBarW}
                height={colorBarHeight}
              >
                <div style={{ height: '100%' }}>
                  <ColorBar
                    minVal={minVal}
                    maxVal={maxVal}
                    height={colorBarHeight}
                    textColor={textColor}
                    barWidth={isDailyLayout ? 8 : 18}
                  />
                </div>
              </foreignObject>

              {colorBarLabel && (
                <text
                  x={gridRightX + colorBarW + 8 + colorBarLabelW - 4}
                  y={colLabelH + colorBarHeight / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={compact ? axisFontSize + 1 : minHeight ? axisFontSize + 1 : 6}
                  fill={textColor}
                  opacity={0.65}
                  transform={`rotate(-90, ${gridRightX + colorBarW + 8 + colorBarLabelW - 4}, ${colLabelH + colorBarHeight / 2})`}
                >
                  {colorBarLabel}
                </text>
              )}

              {xAxisLabel && (
                <text
                  x={rowLabelW + (layoutColsLen * cellW) / 2}
                  y={
                    compact
                      ? colLabelH + colorBarHeight + bottomColLabelH + 20
                      : colLabelH + rows.length * cellH + bottomColLabelH + 20
                  }
                  textAnchor="middle"
                  fontSize={axisFontSize + 1}
                  fill={textColor}
                  opacity={0.6}
                >
                  {xAxisLabel}
                </text>
              )}
            </svg>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default DurationHeatmap
