import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardBody } from 'Components'
import { Close, Fullscreen } from '@/components/icons'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import customColors from '@/customColors'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { useMetricsStyles } from '../MetricsPage.style'
import { HEATMAP_COLOR_STOPS } from '../constants'
import type { HeatmapData } from '../types'

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
  showExpand?: boolean
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
          range === 0
            ? verticalPadding + barHeight / 2
            : verticalPadding + ((maxVal - v) / range) * barHeight
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
  showExpand = true,
}) => {
  const { state } = useTheme()
  const themeColors = getThemeColor(state.theme)
  const isDark = state.theme === THEME_DARK
  const { classes } = useMetricsStyles({ isDark, themeColors })
  const { t } = useTranslation()
  const [isFullscreen, setIsFullscreen] = useState(false)

  const openFullscreen = useCallback(() => setIsFullscreen(true), [])
  const closeFullscreen = useCallback(() => setIsFullscreen(false), [])

  useEffect(() => {
    if (!isFullscreen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setIsFullscreen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [isFullscreen])

  const { rows, cols, colsSub, data, minVal, maxVal } = heatmapData
  const hasColsSub = Boolean(colsSub && colsSub.length === cols.length)

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

  const renderHeatmapSvg = (fullscreen: boolean) => {
    const colLabelH = fullscreen
      ? hasColsSub || colLabelsBottom
        ? 0
        : 36
      : compact
        ? 20
        : hasColsSub || colLabelsBottom
          ? 0
          : 28
    const bottomColLabelH = fullscreen
      ? hasColsSub
        ? 56
        : colLabelsBottom
          ? 32
          : 0
      : hasColsSub
        ? 40
        : colLabelsBottom
          ? 24
          : 0
    const xAxisH = xAxisLabel ? (fullscreen ? 36 : 28) : 0
    const reservedH = colLabelH + bottomColLabelH + xAxisH
    const effectiveCompactMinHeight = compact ? (minHeight ?? 460) : undefined
    const baseCellH = fullscreen ? 80 : compact ? 36 : 56
    const fallbackCols = emptyStateCols ?? (compact ? 24 : minHeight ? 4 : 6)
    const layoutColsLen = cols.length > 0 ? cols.length : fallbackCols
    const rowsCount = Math.max(rows.length, 1)
    const safeColsLen = Math.max(layoutColsLen, 1)
    const cellH = fullscreen
      ? Math.max(baseCellH, Math.min(160, Math.floor(700 / rowsCount)))
      : compact
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
    const cellW = fullscreen
      ? Math.max(60, Math.min(160, Math.round(1200 / safeColsLen)))
      : compact
        ? Math.min(56, Math.max(32, Math.round(900 / safeColsLen)))
        : minHeight
          ? Math.max(110, Math.round(500 / safeColsLen))
          : Math.max(60, Math.floor(560 / safeColsLen))
    const isDailyLayout = !compact && !minHeight
    const colorBarW = fullscreen ? 60 : isDailyLayout ? 36 : 44
    const colorBarLabelW = colorBarLabel ? (fullscreen ? 24 : 16) : 0
    const axisFontSize = fullscreen ? 14 : compact ? 10 : isDailyLayout ? 6 : 12
    const rowLabelFontSize = fullscreen
      ? verticalRowLabels
        ? 12
        : 14
      : compact
        ? 11
        : minHeight
          ? 14
          : verticalRowLabels
            ? 6
            : 11
    const rowLabelW = fullscreen
      ? verticalRowLabels
        ? rowLabelFontSize + 32
        : 140
      : compact
        ? 64
        : minHeight
          ? 110
          : verticalRowLabels
            ? rowLabelFontSize + 24
            : 100
    const cellFontSize = fullscreen
      ? Math.min(28, Math.max(12, Math.round(cellH * 0.28)))
      : compact
        ? Math.min(11, Math.max(8, Math.round(cellW * 0.28)))
        : minHeight
          ? Math.min(32, Math.max(14, Math.round(cellH * 0.26)))
          : 11

    const isEmpty = rows.length === 0 || cols.length === 0
    const fallbackRows = compact ? 12 : 2
    const layoutGridHeight = isEmpty
      ? fullscreen
        ? Math.max(rowsCount, fallbackRows) * baseCellH
        : minHeight
          ? minHeight - 80 - reservedH
          : compact
            ? (effectiveCompactMinHeight ?? 460) - 80 - reservedH
            : fallbackRows * baseCellH
      : rowsCount * cellH
    const gridHeight = layoutGridHeight
    const colorBarHeight =
      !fullscreen && minColorBarHeight
        ? Math.max(layoutGridHeight, minColorBarHeight)
        : layoutGridHeight
    const gridRightX = rowLabelW + layoutColsLen * cellW

    const svgWidth = gridRightX + colorBarW + 8 + colorBarLabelW
    const svgHeight = colLabelH + Math.max(gridHeight, colorBarHeight) + bottomColLabelH + xAxisH

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: verticalRowLabels ? 12 : 4,
          ...(fullscreen ? { flex: 1, minHeight: 0, height: '100%' } : {}),
        }}
      >
        {yAxisLabel && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              writingMode: 'vertical-lr',
              transform: 'rotate(180deg)',
              fontSize: fullscreen ? 14 : verticalRowLabels ? 11 : rowLabelFontSize,
              color: textColor,
              minWidth: 16,
              alignSelf: 'stretch',
            }}
          >
            {yAxisLabel}
          </div>
        )}

        <div
          style={{
            flex: 1,
            minWidth: 0,
            overflowX: 'auto',
            ...(fullscreen ? { height: '100%', display: 'flex', alignItems: 'center' } : {}),
          }}
        >
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="xMidYMid meet"
            style={{
              display: 'block',
              width: '100%',
              ...(compact && !fullscreen ? { maxWidth: svgWidth } : {}),
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
              >
                {xAxisLabel}
              </text>
            )}
          </svg>
        </div>
      </div>
    )
  }

  const fullscreenModal =
    isFullscreen &&
    createPortal(
      <>
        <button
          type="button"
          className={classes.heatmapModalOverlay}
          onClick={closeFullscreen}
          aria-label={t('actions.close')}
        />
        <div
          className={classes.heatmapModalContainer}
          role="dialog"
          aria-modal="true"
          aria-labelledby="heatmap-fullscreen-title"
        >
          <div className={classes.heatmapModalHeader}>
            <GluuText
              variant="h2"
              className={classes.heatmapModalTitle}
              id="heatmap-fullscreen-title"
            >
              {title}
            </GluuText>
            <button
              type="button"
              onClick={closeFullscreen}
              className={classes.heatmapModalCloseButton}
              aria-label={t('actions.close')}
              title={t('actions.close')}
            >
              <Close fontSize="small" aria-hidden />
            </button>
          </div>
          <div className={classes.heatmapModalBody}>
            {caption && (
              <GluuText
                variant="div"
                style={{
                  textAlign: 'center',
                  fontSize: 13,
                  marginBottom: 16,
                  color: themeColors.fontColor,
                }}
              >
                {caption}
              </GluuText>
            )}
            {renderHeatmapSvg(true)}
          </div>
        </div>
      </>,
      document.body,
    )

  return (
    <>
      <Card className={`${classes.chartCard} h-100`} style={minHeight ? { minHeight } : undefined}>
        {showExpand && (
          <button
            type="button"
            className={classes.heatmapExpandButton}
            onClick={openFullscreen}
            aria-label={t('messages.expand')}
            title={t('messages.expand')}
          >
            <Fullscreen fontSize="small" aria-hidden />
          </button>
        )}
        <CardBody>
          <GluuText variant="div" className={classes.chartTitle}>
            {title}
          </GluuText>
          {caption && (
            <GluuText
              variant="div"
              style={{
                textAlign: 'center',
                fontSize: 11,
                marginBottom: 12,
                color: themeColors.fontColor,
              }}
            >
              {caption}
            </GluuText>
          )}
          {renderHeatmapSvg(false)}
        </CardBody>
      </Card>
      {fullscreenModal}
    </>
  )
}

export default DurationHeatmap
