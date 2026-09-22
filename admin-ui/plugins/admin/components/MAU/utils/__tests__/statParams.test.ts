import { orderMonthRange, buildStatParams } from '../statParams'
import { createDate } from '@/utils/dayjsUtils'

describe('orderMonthRange', () => {
  it('keeps a range that is already in order', () => {
    const start = createDate('2024-01-15')
    const end = createDate('2024-03-15')

    expect(orderMonthRange(start, end)).toEqual([start, end])
  })

  it('swaps a range whose start month is after its end month', () => {
    const start = createDate('2024-03-15')
    const end = createDate('2024-01-15')

    expect(orderMonthRange(start, end)).toEqual([end, start])
  })

  it('leaves a same-month range untouched', () => {
    const start = createDate('2024-03-05')
    const end = createDate('2024-03-28')

    expect(orderMonthRange(start, end)).toEqual([start, end])
  })
})

describe('buildStatParams', () => {
  it('sends start_month and end_month for a multi-month range', () => {
    expect(buildStatParams(createDate('2024-01-15'), createDate('2024-02-15'))).toEqual({
      start_month: '202401',
      end_month: '202402',
    })
  })

  it('sends a single month when both dates fall in the same month', () => {
    expect(buildStatParams(createDate('2024-03-05'), createDate('2024-03-28'))).toEqual({
      month: '202403',
    })
  })
})
