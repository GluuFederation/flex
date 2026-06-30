import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '@/utils/hooks/useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))
    expect(result.current).toBe('initial')
  })

  it('does not update before the delay elapses', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'a' },
    })

    rerender({ value: 'b' })
    act(() => {
      jest.advanceTimersByTime(499)
    })
    expect(result.current).toBe('a')
  })

  it('updates to the latest value once the delay elapses', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'a' },
    })

    rerender({ value: 'b' })
    act(() => {
      jest.advanceTimersByTime(500)
    })
    expect(result.current).toBe('b')
  })

  it('resets the timer when the value changes again before the delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'a' },
    })

    rerender({ value: 'b' })
    act(() => {
      jest.advanceTimersByTime(300)
    })
    // Change again before the first debounce fires — timer restarts.
    rerender({ value: 'c' })
    act(() => {
      jest.advanceTimersByTime(300)
    })
    expect(result.current).toBe('a')

    act(() => {
      jest.advanceTimersByTime(200)
    })
    expect(result.current).toBe('c')
  })

  it('works with non-string values', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 200), {
      initialProps: { value: 1 },
    })

    rerender({ value: 2 })
    act(() => {
      jest.advanceTimersByTime(200)
    })
    expect(result.current).toBe(2)
  })
})
