import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { METRICS_ZOOM } from '../constants'
import type { ChartScrollAnchor, ChartZoomControls } from '../types'

const CHART_FRAME_SELECTOR = '[data-chart-frame]'

const clampZoom = (value: number): number =>
  Math.min(METRICS_ZOOM.MAX, Math.max(METRICS_ZOOM.MIN, value))

const readAnchor = (frame: HTMLElement): ChartScrollAnchor => ({
  x: frame.scrollWidth > 0 ? (frame.scrollLeft + frame.clientWidth / 2) / frame.scrollWidth : 0.5,
  y: frame.scrollHeight > 0 ? (frame.scrollTop + frame.clientHeight / 2) / frame.scrollHeight : 0.5,
})

const useChartZoom = (active: boolean): ChartZoomControls => {
  const [zoom, setZoom] = useState<number>(METRICS_ZOOM.DEFAULT)
  const surfaceRef = useRef<HTMLDivElement | null>(null)
  const anchorRef = useRef<ChartScrollAnchor | null>(null)

  const getFrame = useCallback(
    () => surfaceRef.current?.querySelector<HTMLElement>(CHART_FRAME_SELECTOR) ?? null,
    [],
  )

  const applyZoom = useCallback(
    (next: (current: number) => number) => {
      const frame = getFrame()
      anchorRef.current = frame ? readAnchor(frame) : null
      setZoom((current) => clampZoom(next(current)))
    },
    [getFrame],
  )

  const zoomIn = useCallback(() => applyZoom((current) => current + METRICS_ZOOM.STEP), [applyZoom])
  const zoomOut = useCallback(
    () => applyZoom((current) => current - METRICS_ZOOM.STEP),
    [applyZoom],
  )
  const resetZoom = useCallback(() => applyZoom(() => METRICS_ZOOM.DEFAULT), [applyZoom])

  useEffect(() => {
    if (!active) setZoom(METRICS_ZOOM.DEFAULT)
  }, [active])

  useLayoutEffect(() => {
    const frame = getFrame()
    const anchor = anchorRef.current
    anchorRef.current = null
    if (!frame || !anchor) return
    frame.scrollLeft = anchor.x * frame.scrollWidth - frame.clientWidth / 2
    frame.scrollTop = anchor.y * frame.scrollHeight - frame.clientHeight / 2
  }, [zoom, getFrame])

  useEffect(() => {
    const surface = surfaceRef.current
    if (!active || !surface) return
    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return
      event.preventDefault()
      const direction = event.deltaY < 0 ? 1 : -1
      applyZoom((current) => current + direction * METRICS_ZOOM.STEP)
    }
    surface.addEventListener('wheel', onWheel, { passive: false })
    return () => surface.removeEventListener('wheel', onWheel)
  }, [active, applyZoom])

  return { zoom, zoomIn, zoomOut, resetZoom, surfaceRef }
}

export default useChartZoom
