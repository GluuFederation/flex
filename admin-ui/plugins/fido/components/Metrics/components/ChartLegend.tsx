import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { useMetricsStyles } from '../MetricsPage.style'
import type { ChartLegendProps } from '../types'

const ChartLegend: React.FC<ChartLegendProps> = ({ items, marker = 'dot', topGutter = false }) => {
  const { state } = useTheme()
  const themeColors = useMemo(() => getThemeColor(state.theme), [state.theme])
  const isDark = state.theme === THEME_DARK
  const { classes, cx } = useMetricsStyles({ isDark, themeColors })
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

  const renderItems = () =>
    items.map((item) => (
      <div key={item.key} className={classes.chartLegendItem}>
        <span className={markerClass} style={{ backgroundColor: item.color }} />
        <span
          className={classes.chartLegendLabel}
          style={item.labelColor ? { color: item.labelColor } : undefined}
        >
          {item.label}
        </span>
      </div>
    ))

  return (
    <div className={cx(classes.chartLegendWrapper, topGutter && classes.chartLegendWrapperGutter)}>
      <div
        ref={containerRef}
        data-testid="chart-legend"
        className={`${classes.chartLegend} ${isWrapped ? classes.chartLegendGrid : ''}`}
      >
        {renderItems()}
      </div>
      <div
        ref={probeRef}
        className={classes.chartLegendProbe}
        aria-hidden
        data-testid="chart-legend-probe"
      >
        {renderItems()}
      </div>
    </div>
  )
}

export default React.memo(ChartLegend)
