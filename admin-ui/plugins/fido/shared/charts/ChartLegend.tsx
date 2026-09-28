import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { useChartShellStyles } from './chartShell.style'
import type { ChartLegendProps } from './types'

const ChartLegend: React.FC<ChartLegendProps> = ({
  items,
  marker = 'dot',
  topGutter = false,
  renderHint,
}) => {
  const { state } = useTheme()
  const themeColors = useMemo(() => getThemeColor(state.theme), [state.theme])
  const isDark = state.theme === THEME_DARK
  const { classes, cx } = useChartShellStyles({ isDark, themeColors })
  const [isWrapped, setIsWrapped] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const probeRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const probe = probeRef.current
    if (!container || !probe) return
    const measure = () => setIsWrapped(probe.scrollWidth > container.clientWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    observer.observe(probe)
    return () => observer.disconnect()
  }, [items])

  const markerClass = marker === 'dash' ? classes.chartLegendDash : classes.chartLegendDot

  const renderItems = (withHints: boolean) =>
    items.map((item) => {
      const content = (
        <div className={classes.chartLegendItem}>
          <span className={markerClass} style={{ backgroundColor: item.color }} />
          <span
            className={classes.chartLegendLabel}
            style={item.labelColor ? { color: item.labelColor } : undefined}
          >
            {item.label}
          </span>
        </div>
      )

      return (
        <React.Fragment key={item.key}>
          {withHints && renderHint && item.hint ? renderHint(item.hint, content) : content}
        </React.Fragment>
      )
    })

  return (
    <div className={cx(classes.chartLegendWrapper, topGutter && classes.chartLegendWrapperGutter)}>
      <div
        ref={containerRef}
        data-testid="chart-legend"
        className={`${classes.chartLegend} ${isWrapped ? classes.chartLegendGrid : ''}`}
      >
        {renderItems(true)}
      </div>
      <div
        ref={probeRef}
        className={classes.chartLegendProbe}
        aria-hidden
        data-testid="chart-legend-probe"
      >
        {renderItems(false)}
      </div>
    </div>
  )
}

export default React.memo(ChartLegend)
