import React, { useMemo } from 'react'
import { Card, CardBody } from 'Components'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { useMetricsStyles } from '../MetricsPage.style'
import { HEATMAP_COLOR_STOPS } from '../constants'

export interface HeatmapData {
  rows: readonly string[]
  cols: readonly string[]
  data: readonly (readonly number[])[]
  minVal: number
  maxVal: number
}

interface DurationHeatmapProps {
  title: string
  heatmapData: HeatmapData
  xAxisLabel?: string
  yAxisLabel?: string
  /** Rotated label shown to the right of the colour bar (e.g. "Duration (Seconds)") */
  colorBarLabel?: string
  /** compact=true → small cells with small text (hourly). compact=false → large cells with big text */
  compact?: boolean
}

// Interpolates between the HEATMAP_COLOR_STOPS colour ramp
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

// Compact colour-bar legend (vertical gradient strip)
const ColorBar: React.FC<{ minVal: number; maxVal: number; height: number; textColor: string }> = ({
  minVal, maxVal, height, textColor,
}) => {
  const stops = HEATMAP_COLOR_STOPS
  const gradientId = 'heatmap-grad'
  const steps = [3.5, 3.0, 2.5, 2.0, 1.5, 1.0]
  return (
    <svg width={40} height={height} style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          {stops.map((s, i) => (
            <stop key={i} offset={`${s.stop * 100}%`} stopColor={s.color} />
          ))}
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={10} height={height} fill={`url(#${gradientId})`} rx={2} />
      {steps.map((v) => {
        const y = ((maxVal - v) / (maxVal - minVal)) * height
        return (
          <text key={v} x={14} y={y + 4} fontSize={9} fill={textColor} dominantBaseline="middle">
            {v.toFixed(1)}
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
  colorBarLabel,
  compact = false,
}) => {
  const { state } = useTheme()
  const themeColors = getThemeColor(state.theme)
  const isDark = state.theme === THEME_DARK
  const { classes } = useMetricsStyles({ isDark, themeColors })

  const { rows, cols, data, minVal, maxVal } = heatmapData

  const cellW = compact ? 28 : Math.max(60, Math.floor(560 / cols.length))
  const cellH = compact ? 28 : 56
  const rowLabelW = compact ? 44 : 100
  const colLabelH = compact ? 20 : 28
  const colorBarW = compact ? 44 : 48
  const colorBarLabelW = colorBarLabel ? 16 : 0
  const axisFontSize = compact ? 9 : 12
  const cellFontSize = compact ? 8 : 13

  const svgWidth = rowLabelW + cols.length * cellW + colorBarW + 8 + colorBarLabelW
  const svgHeight = colLabelH + rows.length * cellH + (xAxisLabel ? 28 : 0)

  const cells = useMemo(() => {
    return rows.flatMap((_, ri) =>
      cols.map((_, ci) => {
        const value = data[ri]?.[ci] ?? minVal
        return { ri, ci, value, color: interpolateHeatmapColor(value, minVal, maxVal) }
      }),
    )
  }, [rows, cols, data, minVal, maxVal])

  const textColor = themeColors.fontColor
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'

  return (
    <Card className={`${classes.chartCard} h-100`}>
      <CardBody style={{ overflowX: 'auto' }}>
        <GluuText variant="div" className={classes.chartTitle}>{title}</GluuText>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
          {/* Y-axis label */}
          {yAxisLabel && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              writingMode: 'vertical-lr', transform: 'rotate(180deg)',
              fontSize: axisFontSize, color: textColor, opacity: 0.6,
              minWidth: 16, alignSelf: 'stretch',
            }}>
              {yAxisLabel}
            </div>
          )}

          <div style={{ flex: 1, overflowX: 'auto' }}>
            <svg
              width={svgWidth}
              height={svgHeight}
              style={{ display: 'block', minWidth: svgWidth }}
            >
              {/* Column headers */}
              {cols.map((col, ci) => (
                <text
                  key={`ch-${ci}`}
                  x={rowLabelW + ci * cellW + cellW / 2}
                  y={colLabelH - 4}
                  textAnchor="middle"
                  fontSize={axisFontSize}
                  fill={textColor}
                  opacity={0.7}
                >
                  {col}
                </text>
              ))}

              {/* Row labels */}
              {rows.map((row, ri) => (
                <text
                  key={`rl-${ri}`}
                  x={rowLabelW - 4}
                  y={colLabelH + ri * cellH + cellH / 2}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize={axisFontSize}
                  fill={textColor}
                  opacity={0.7}
                >
                  {row}
                </text>
              ))}

              {/* Cells */}
              {cells.map(({ ri, ci, value, color }) => {
                const x = rowLabelW + ci * cellW
                const y = colLabelH + ri * cellH
                // Decide text colour based on brightness
                const brightness = parseInt(color.replace(/[^\d,]/g, '').split(',')[0] ?? '100')
                const cellTextColor = brightness < 160 ? '#ffffff' : '#1a1a1a'
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

              {/* Color bar */}
              <foreignObject
                x={rowLabelW + cols.length * cellW + 8}
                y={colLabelH}
                width={colorBarW}
                height={rows.length * cellH}
              >
                <div style={{ height: '100%' }}>
                  <ColorBar
                    minVal={minVal}
                    maxVal={maxVal}
                    height={rows.length * cellH}
                    textColor={textColor}
                  />
                </div>
              </foreignObject>

              {/* Colour-bar vertical label e.g. "Duration (Seconds)" */}
              {colorBarLabel && (
                <text
                  x={rowLabelW + cols.length * cellW + colorBarW + 8 + colorBarLabelW - 4}
                  y={colLabelH + (rows.length * cellH) / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={axisFontSize + 1}
                  fill={textColor}
                  opacity={0.65}
                  transform={`rotate(-90, ${rowLabelW + cols.length * cellW + colorBarW + 8 + colorBarLabelW - 4}, ${colLabelH + (rows.length * cellH) / 2})`}
                >
                  {colorBarLabel}
                </text>
              )}

              {/* X-axis label */}
              {xAxisLabel && (
                <text
                  x={rowLabelW + (cols.length * cellW) / 2}
                  y={colLabelH + rows.length * cellH + 20}
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
