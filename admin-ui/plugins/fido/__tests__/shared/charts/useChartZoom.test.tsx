import React from 'react'
import { act, render, renderHook } from '@testing-library/react'
import useChartZoom from 'Plugins/fido/shared/charts/useChartZoom'
import { CHART_ZOOM } from 'Plugins/fido/shared/charts'

describe('useChartZoom', () => {
  it('starts at the default zoom', () => {
    const { result } = renderHook(() => useChartZoom(true))

    expect(result.current.zoom).toBe(CHART_ZOOM.DEFAULT)
  })

  it('steps in and out by one increment', () => {
    const { result } = renderHook(() => useChartZoom(true))

    act(() => result.current.zoomIn())
    expect(result.current.zoom).toBe(CHART_ZOOM.DEFAULT + CHART_ZOOM.STEP)

    act(() => result.current.zoomOut())
    expect(result.current.zoom).toBe(CHART_ZOOM.DEFAULT)
  })

  it('never goes past the bounds, however often it is pushed', () => {
    const { result } = renderHook(() => useChartZoom(true))

    for (let i = 0; i < 20; i++) act(() => result.current.zoomIn())
    expect(result.current.zoom).toBe(CHART_ZOOM.MAX)

    for (let i = 0; i < 20; i++) act(() => result.current.zoomOut())
    expect(result.current.zoom).toBe(CHART_ZOOM.MIN)
  })

  it('returns to the default when reset', () => {
    const { result } = renderHook(() => useChartZoom(true))

    act(() => result.current.zoomIn())
    act(() => result.current.zoomIn())
    expect(result.current.zoom).not.toBe(CHART_ZOOM.DEFAULT)

    act(() => result.current.resetZoom())
    expect(result.current.zoom).toBe(CHART_ZOOM.DEFAULT)
  })

  it('drops back to the default when the surface goes inactive', () => {
    // Closing the fullscreen modal must not leave the next open at the old zoom.
    const { result, rerender } = renderHook(({ active }) => useChartZoom(active), {
      initialProps: { active: true },
    })

    act(() => result.current.zoomIn())
    expect(result.current.zoom).toBe(CHART_ZOOM.DEFAULT + CHART_ZOOM.STEP)

    rerender({ active: false })
    expect(result.current.zoom).toBe(CHART_ZOOM.DEFAULT)
  })
})

// The wheel handler and the scroll anchor both need a real surface with a frame inside it, so
// these drive the hook through a component rather than renderHook.
const sizeFrame = (frame: HTMLElement) => {
  for (const [prop, value] of [
    ['scrollWidth', 1000],
    ['scrollHeight', 800],
    ['clientWidth', 500],
    ['clientHeight', 400],
  ] as const) {
    Object.defineProperty(frame, prop, { value, configurable: true })
  }
}

type HarnessProps = { active: boolean; onZoom: (zoom: number) => void }

const Harness: React.FC<HarnessProps> = ({ active, onZoom }) => {
  const { zoom, surfaceRef } = useChartZoom(active)
  onZoom(zoom)
  return (
    <div ref={surfaceRef} data-testid="surface">
      <div data-chart-frame data-testid="frame" />
    </div>
  )
}

describe('useChartZoom on a real surface', () => {
  const setup = (active = true) => {
    let zoom: number = CHART_ZOOM.DEFAULT
    const view = render(<Harness active={active} onZoom={(z) => (zoom = z)} />)
    const frame = view.getByTestId('frame')
    sizeFrame(frame)
    return { surface: view.getByTestId('surface'), frame, zoomNow: () => zoom }
  }

  const wheel = (target: HTMLElement, init: WheelEventInit) =>
    act(() => {
      target.dispatchEvent(new WheelEvent('wheel', { bubbles: true, cancelable: true, ...init }))
    })

  it('zooms on ctrl+wheel, which is the pinch gesture on a trackpad', () => {
    const { surface, zoomNow } = setup()

    wheel(surface, { deltaY: -100, ctrlKey: true })
    expect(zoomNow()).toBe(CHART_ZOOM.DEFAULT + CHART_ZOOM.STEP)

    wheel(surface, { deltaY: 100, ctrlKey: true })
    expect(zoomNow()).toBe(CHART_ZOOM.DEFAULT)
  })

  it('leaves a plain wheel alone so the page can still scroll', () => {
    const { surface, zoomNow } = setup()

    wheel(surface, { deltaY: -100 })
    expect(zoomNow()).toBe(CHART_ZOOM.DEFAULT)
  })

  it('ignores the wheel entirely while inactive', () => {
    const { surface, zoomNow } = setup(false)

    wheel(surface, { deltaY: -100, ctrlKey: true })
    expect(zoomNow()).toBe(CHART_ZOOM.DEFAULT)
  })

  it('keeps the same point centred across a zoom change', () => {
    const { surface, frame } = setup()
    frame.scrollLeft = 250
    frame.scrollTop = 200

    // Centre sits at (250 + 500/2) / 1000 = 0.5 across, (200 + 400/2) / 800 = 0.5 down.
    wheel(surface, { deltaY: -100, ctrlKey: true })

    expect(frame.scrollLeft).toBe(0.5 * 1000 - 500 / 2)
    expect(frame.scrollTop).toBe(0.5 * 800 - 400 / 2)
  })
})
