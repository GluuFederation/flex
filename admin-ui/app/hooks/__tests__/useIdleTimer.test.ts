import { act, renderHook } from '@testing-library/react'
import { useIdleTimer } from '../useIdleTimer'

const fireActivity = (eventName = 'keydown') => {
  act(() => {
    window.dispatchEvent(new Event(eventName))
  })
}

describe('useIdleTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('fires onIdle after the timeout elapses', () => {
    const onIdle = jest.fn()
    const { result } = renderHook(() => useIdleTimer({ timeout: 1000, onIdle }))

    expect(result.current.isIdle).toBe(false)
    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(onIdle).toHaveBeenCalledTimes(1)
    expect(result.current.isIdle).toBe(true)
  })

  it('resets the timer on activity so onIdle does not fire early', () => {
    const onIdle = jest.fn()
    renderHook(() => useIdleTimer({ timeout: 1000, onIdle }))

    act(() => {
      jest.advanceTimersByTime(900)
    })
    fireActivity()
    act(() => {
      jest.advanceTimersByTime(900)
    })

    expect(onIdle).not.toHaveBeenCalled()
  })

  it('fires onActive when activity follows an idle state', () => {
    const onActive = jest.fn()
    const { result } = renderHook(() => useIdleTimer({ timeout: 1000, onActive }))

    act(() => {
      jest.advanceTimersByTime(1000)
    })
    expect(result.current.isIdle).toBe(true)

    fireActivity()
    expect(onActive).toHaveBeenCalledTimes(1)
    expect(result.current.isIdle).toBe(false)
  })

  it('does not fire onIdle when disabled', () => {
    const onIdle = jest.fn()
    renderHook(() => useIdleTimer({ timeout: 1000, onIdle, disabled: true }))

    act(() => {
      jest.advanceTimersByTime(5000)
    })

    expect(onIdle).not.toHaveBeenCalled()
  })

  it('collapses rapid activity within the debounce window', () => {
    const onActive = jest.fn()
    const { result } = renderHook(() => useIdleTimer({ timeout: 1000, onActive, debounce: 250 }))

    act(() => {
      jest.advanceTimersByTime(1000)
    })
    expect(result.current.isIdle).toBe(true)

    fireActivity()
    fireActivity()
    fireActivity()

    expect(onActive).toHaveBeenCalledTimes(1)
  })
})
