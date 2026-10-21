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

  describe('across tabs', () => {
    const SYNC_KEY = 'test.lastActivity'

    const fireRemoteActivity = (key = SYNC_KEY) => {
      act(() => {
        window.dispatchEvent(new StorageEvent('storage', { key, newValue: String(Date.now()) }))
      })
    }

    const advance = (ms: number) => {
      act(() => {
        jest.advanceTimersByTime(ms)
      })
    }

    beforeEach(() => {
      window.localStorage.clear()
    })

    it('records local activity for the other tabs at most every 10 seconds', () => {
      renderHook(() => useIdleTimer({ timeout: 60_000, syncKey: SYNC_KEY }))

      fireActivity()
      const firstWrite = window.localStorage.getItem(SYNC_KEY)
      expect(firstWrite).toBe(String(Date.now()))

      advance(5000)
      fireActivity()
      expect(window.localStorage.getItem(SYNC_KEY)).toBe(firstWrite)

      advance(5000)
      fireActivity()
      expect(window.localStorage.getItem(SYNC_KEY)).toBe(String(Date.now()))
    })

    it('does not record activity without a sync key', () => {
      renderHook(() => useIdleTimer({ timeout: 60_000 }))

      fireActivity()

      expect(window.localStorage).toHaveLength(0)
    })

    it('treats activity in another tab as activity here', () => {
      const onIdle = jest.fn()
      renderHook(() => useIdleTimer({ timeout: 1000, onIdle, syncKey: SYNC_KEY }))

      advance(900)
      fireRemoteActivity()
      advance(900)
      expect(onIdle).not.toHaveBeenCalled()

      advance(100)
      expect(onIdle).toHaveBeenCalledTimes(1)
    })

    it('tells the caller when another tab is active', () => {
      const onRemoteActivity = jest.fn()
      renderHook(() => useIdleTimer({ timeout: 1000, onRemoteActivity, syncKey: SYNC_KEY }))

      fireRemoteActivity()

      expect(onRemoteActivity).toHaveBeenCalledTimes(1)
    })

    it('ignores storage changes to other keys', () => {
      const onIdle = jest.fn()
      const onRemoteActivity = jest.fn()
      renderHook(() => useIdleTimer({ timeout: 1000, onIdle, onRemoteActivity, syncKey: SYNC_KEY }))

      advance(900)
      fireRemoteActivity('another.key')
      advance(100)

      expect(onRemoteActivity).not.toHaveBeenCalled()
      expect(onIdle).toHaveBeenCalledTimes(1)
    })

    it('stays active while another tab keeps recording activity', () => {
      const onIdle = jest.fn()
      renderHook(() => useIdleTimer({ timeout: 1000, onIdle, syncKey: SYNC_KEY }))

      advance(500)
      window.localStorage.setItem(SYNC_KEY, String(Date.now()))
      advance(500)
      expect(onIdle).not.toHaveBeenCalled()

      advance(500)
      expect(onIdle).toHaveBeenCalledTimes(1)
    })
  })
})
