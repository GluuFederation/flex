import { renderHook } from '@testing-library/react'
import { useChunkedCount } from '../useChunkedCount'

const countsSeen = (
  total: number,
  chunkSize: number,
  options?: Parameters<typeof useChunkedCount>[2],
): number[] => {
  const seen: number[] = []
  renderHook(() => {
    const count = useChunkedCount(total, chunkSize, options)
    seen.push(count)
    return count
  })
  return seen
}

describe('useChunkedCount', () => {
  it('grows by one chunk per render until it reaches the total', () => {
    expect(countsSeen(45, 20)).toEqual([0, 20, 40, 45])
  })

  it('starts from the initial count', () => {
    expect(countsSeen(45, 20, { initialCount: 20 })).toEqual([20, 40, 45])
  })

  it('shows a short list at once when it fits in the initial count', () => {
    expect(countsSeen(5, 20, { initialCount: 20 })).toEqual([5])
  })

  it('holds the count while disabled', () => {
    expect(countsSeen(45, 20, { enabled: false })).toEqual([0])
  })
})
