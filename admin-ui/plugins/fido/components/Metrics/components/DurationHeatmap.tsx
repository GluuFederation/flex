import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardBody } from 'Components'
import { Close, Fullscreen, ZoomIn, ZoomOut } from '@/components/icons'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import customColors from '@/customColors'
import { REGEX_NON_DIGIT_COMMA } from '@/utils/regex'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import useMediaQuery from '@mui/material/useMediaQuery'
import { MEDIA_QUERY_OPTIONS, MOBILE_MEDIA_QUERY, TABLET_MAX_MEDIA_QUERY } from '@/constants'
import { useMetricsStyles } from '../MetricsPage.style'
import { HEATMAP_COLOR_STOPS, METRICS_ZOOM } from '../constants'
import useChartZoom from '../hooks/useChartZoom'
import { formatChartValue, getNiceStep, interpolateHeatmapColor } from '../utils'
import type { ChartSurfaceSize, DurationHeatmapProps } from '../types'

const ColorBar: React.FC<{
  minVal: number
  maxVal: number
  height: number
  textColor: string
  className: string
  barWidth?: number
}> = ({ minVal, maxVal, height, textColor, className, barWidth = 18 }) => {
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
    <svg width={svgWidth} height={height} className={className}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="1" x2="0" y2="0">
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

const MOBILE_CELL_SIZE = { WIDTH: 24, HEIGHT: 20 } as const
const MOBILE_ROW_LABEL_WIDTH = 46
const COLOR_BAR_GAP = 8
const FIT_SAFETY_GAP = 2
const EMPTY_FRAME_SIZE: ChartSurfaceSize = { width: 0, height: 0 }

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
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY, MEDIA_QUERY_OPTIONS)
  const isCompact = useMediaQuery(TABLET_MAX_MEDIA_QUERY, MEDIA_QUERY_OPTIONS)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [frameSize, setFrameSize] = useState<ChartSurfaceSize>(EMPTY_FRAME_SIZE)
  const { zoom, zoomIn, zoomOut, resetZoom, surfaceRef } = useChartZoom(isFullscreen)

  const frameRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0]!.contentRect
      setFrameSize({ width: Math.floor(width), height: Math.floor(height) })
    })
    ro.observe(node)
    return () => ro.disconnect()
  }, [])

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

  const renderHeatmapSvg = (fullscreen: boolean, zoomLevel: number = METRICS_ZOOM.DEFAULT) => {
    const colLabelH = compact ? 20 : hasColsSub || colLabelsBottom ? 0 : 28
    const bottomColLabelH = hasColsSub ? 40 : colLabelsBottom ? 24 : 0
    const useNaturalWidth = isMobile
    const labelOutside = Boolean(xAxisLabel) && (fullscreen || isCompact)
    const xAxisH = xAxisLabel && !labelOutside ? 28 : 0
    const reservedH = colLabelH + bottomColLabelH + xAxisH
    const effectiveCompactMinHeight = compact ? (minHeight ?? 460) : undefined
    const baseCellH = compact ? 36 : 56
    const fallbackCols = emptyStateCols ?? (compact ? 24 : minHeight ? 4 : 6)
    const layoutColsLen = cols.length > 0 ? cols.length : fallbackCols
    const rowsCount = Math.max(rows.length, 1)
    const safeColsLen = Math.max(layoutColsLen, 1)
    const compactTargetHeight = minColorBarHeight ?? effectiveCompactMinHeight ?? 0
    const compactCellH = maxCellHeight
      ? Math.min(
          maxCellHeight,
          Math.max(baseCellH, Math.floor(compactTargetHeight / Math.max(rowsCount, 1))),
        )
      : baseCellH
    const isDailyLayout = !compact && !minHeight
    const colorBarW = isDailyLayout ? 36 : 44
    const colorBarLabelW = colorBarLabel ? 16 : 0
    const axisFontSize = compact ? 10 : isDailyLayout ? 6 : 12
    const rowLabelFontSize = compact ? 11 : minHeight ? 14 : verticalRowLabels ? 6 : 11
    const derivedRowLabelW = compact
      ? 64
      : minHeight
        ? 110
        : verticalRowLabels
          ? rowLabelFontSize + 24
          : 100
    const rowLabelW = useNaturalWidth ? MOBILE_ROW_LABEL_WIDTH : derivedRowLabelW
    const yAxisLabelW = yAxisLabel ? (useNaturalWidth ? 12 : 16) + (verticalRowLabels ? 12 : 4) : 0

    const fitToFrame = fullscreen && frameSize.width > 0 && frameSize.height > 0
    const frameCellW = fitToFrame
      ? Math.floor(
          (frameSize.width -
            rowLabelW -
            colorBarW -
            COLOR_BAR_GAP -
            colorBarLabelW -
            yAxisLabelW -
            FIT_SAFETY_GAP) /
            safeColsLen,
        )
      : 0
    const frameCellH = fitToFrame
      ? Math.floor((frameSize.height - colLabelH - bottomColLabelH - FIT_SAFETY_GAP) / rowsCount)
      : 0

    const derivedCellH = compact
      ? compactCellH
      : minHeight
        ? Math.min(
            maxCellHeight ?? Infinity,
            Math.max(baseCellH, Math.floor((minHeight - 80 - reservedH) / rowsCount)),
          )
        : baseCellH
    const cellH = fitToFrame ? frameCellH : useNaturalWidth ? MOBILE_CELL_SIZE.HEIGHT : derivedCellH
    const derivedCellW = compact
      ? Math.min(56, Math.max(32, Math.round(900 / safeColsLen)))
      : minHeight
        ? Math.max(110, Math.round(500 / safeColsLen))
        : Math.max(60, Math.floor(560 / safeColsLen))
    const cellW = fitToFrame
      ? Math.max(useNaturalWidth ? MOBILE_CELL_SIZE.WIDTH : 0, frameCellW)
      : useNaturalWidth
        ? MOBILE_CELL_SIZE.WIDTH
        : derivedCellW
    const cellFontSize = compact
      ? Math.min(11, Math.max(8, Math.round(cellW * 0.28)))
      : minHeight
        ? Math.min(32, Math.max(14, Math.round(cellH * 0.26)))
        : 11

    const isEmpty = rows.length === 0 || cols.length === 0
    const fallbackRows = compact ? 12 : 2
    const layoutGridHeight = fitToFrame
      ? rowsCount * cellH
      : isEmpty
        ? minHeight
          ? minHeight - 80 - reservedH
          : compact
            ? (effectiveCompactMinHeight ?? 460) - 80 - reservedH
            : fallbackRows * baseCellH
        : rowsCount * cellH
    const gridHeight = layoutGridHeight
    const colorBarHeight = layoutGridHeight
    const gridRightX = rowLabelW + layoutColsLen * cellW

    const svgWidth = gridRightX + colorBarW + COLOR_BAR_GAP + colorBarLabelW
    const svgHeight = colLabelH + Math.max(gridHeight, colorBarHeight) + bottomColLabelH + xAxisH

    const compactScrollMaxHeight = effectiveCompactMinHeight ?? 460
    const useVerticalScroll = compact && !fullscreen && svgHeight > compactScrollMaxHeight

    const axisRow = (
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: verticalRowLabels ? 12 : 4,
          ...(fullscreen ? { flexShrink: 0, width: 'max-content', minWidth: '100%' } : {}),
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
              minWidth: useNaturalWidth ? 12 : 16,
              alignSelf: 'stretch',
            }}
          >
            {yAxisLabel}
          </div>
        )}

        <div
          style={
            fullscreen
              ? { flex: 'none', overflow: 'visible' }
              : {
                  flex: 1,
                  minWidth: 0,
                  overflowX: 'auto',
                  ...(useVerticalScroll
                    ? { maxHeight: compactScrollMaxHeight, overflowY: 'auto' }
                    : {}),
                }
          }
        >
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio={
              useNaturalWidth
                ? 'xMinYMin meet'
                : useVerticalScroll
                  ? 'xMidYMin meet'
                  : 'xMidYMid meet'
            }
            style={{
              display: 'block',
              ...(fullscreen
                ? {
                    width: svgWidth * zoomLevel,
                    minWidth: svgWidth * zoomLevel,
                    height: svgHeight * zoomLevel,
                  }
                : useNaturalWidth
                  ? { width: svgWidth, minWidth: svgWidth, height: svgHeight }
                  : {
                      width: '100%',
                      ...(compact ? { maxWidth: svgWidth } : {}),
                      ...(useVerticalScroll ? { height: svgHeight } : { height: 'auto' }),
                    }),
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
              const brightness = parseInt(
                color.replace(REGEX_NON_DIGIT_COMMA, '').split(',')[0] ?? '100',
              )
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
                    {formatChartValue(value)}
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
              <div className={classes.chartColorBarBox}>
                <ColorBar
                  className={classes.chartColorBarSvg}
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

            {xAxisLabel && !labelOutside && (
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

    if (!labelOutside || fullscreen) return axisRow

    return (
      <div className={classes.heatmapAxisStack}>
        {axisRow}
        <div className={classes.heatmapXAxisLabel}>{xAxisLabel}</div>
      </div>
    )
  }

  const fullscreenModal =
    isFullscreen &&
    createPortal(
      <>
        <button
          type="button"
          className={classes.chartModalOverlay}
          onClick={closeFullscreen}
          aria-label={t('actions.close')}
        />
        <div
          className={classes.chartModalContainer}
          role="dialog"
          aria-modal="true"
          aria-labelledby="heatmap-fullscreen-title"
        >
          <div className={classes.chartModalHeader}>
            <GluuText
              variant="h2"
              className={classes.chartModalTitle}
              id="heatmap-fullscreen-title"
            >
              {title}
            </GluuText>
            <div className={classes.chartModalActions}>
              <div className={classes.chartZoomControls}>
                <button
                  type="button"
                  onClick={zoomOut}
                  disabled={zoom <= METRICS_ZOOM.MIN}
                  className={classes.chartZoomButton}
                  aria-label={t('messages.zoom_out')}
                  title={t('messages.zoom_out')}
                >
                  <ZoomOut fontSize="small" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={resetZoom}
                  className={classes.chartZoomLevel}
                  aria-label={t('messages.reset_zoom')}
                  title={t('messages.reset_zoom')}
                >
                  {Math.round(zoom * 100)}%
                </button>
                <button
                  type="button"
                  onClick={zoomIn}
                  disabled={zoom >= METRICS_ZOOM.MAX}
                  className={classes.chartZoomButton}
                  aria-label={t('messages.zoom_in')}
                  title={t('messages.zoom_in')}
                >
                  <ZoomIn fontSize="small" aria-hidden />
                </button>
              </div>
              <button
                type="button"
                onClick={closeFullscreen}
                className={classes.chartModalCloseButton}
                aria-label={t('actions.close')}
                title={t('actions.close')}
              >
                <Close fontSize="small" aria-hidden />
              </button>
            </div>
          </div>
          <div className={classes.chartModalBody} ref={surfaceRef}>
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
            <div className={classes.chartFullscreenFrame} data-chart-frame ref={frameRef}>
              {renderHeatmapSvg(true, zoom)}
            </div>
            {xAxisLabel && <div className={classes.heatmapXAxisLabel}>{xAxisLabel}</div>}
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
            className={classes.chartExpandButton}
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

export default React.memo(DurationHeatmap)
