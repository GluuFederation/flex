import type { GetMetricEntriesParams, MetricDataEntry, MetricEntryPagedResult } from 'JansConfigApi'
import { fetchAllMetricEntries } from 'Plugins/fido/components/AuthMetrics/hooks/useMetricSeries'
import { MAX_ENTRY_PAGES, PAGE_SIZE } from 'Plugins/fido/components/AuthMetrics/constants'

const BASE_PARAMS: GetMetricEntriesParams = {
  metricType: 'user_authentication_success',
  start_date: '2026-08-12T00:00:00.000Z',
  end_date: '2026-08-19T00:00:00.000Z',
}

const row = (index: number): MetricDataEntry => ({
  id: `row-${index}`,
  startDate: '2026-08-19T06:00:00',
  data: { count: 1 },
})

// Serves `total` rows PAGE_SIZE.SERIES at a time, recording the params of every call so the walk
// itself can be asserted rather than only its result.
const pagedFetcher = (total: number) => {
  const calls: GetMetricEntriesParams[] = []

  const fetcher = (params: GetMetricEntriesParams): Promise<MetricEntryPagedResult> => {
    calls.push(params)
    const start = params.startIndex ?? 0
    const limit = params.limit ?? PAGE_SIZE.SERIES
    const entries = Array.from(
      { length: Math.max(0, Math.min(limit, total - start)) },
      (_, offset) => row(start + offset),
    )
    return Promise.resolve({
      start,
      totalEntriesCount: total,
      entriesCount: entries.length,
      entries,
    })
  }

  return { fetcher, calls }
}

describe('fetchAllMetricEntries', () => {
  it('returns a single page whole when it already covers the total', async () => {
    const { fetcher, calls } = pagedFetcher(12)

    const result = await fetchAllMetricEntries(BASE_PARAMS, { fetcher })

    expect(result.entries).toHaveLength(12)
    expect(result.isTruncated).toBe(false)
    expect(calls).toHaveLength(1)
  })

  // The bug this replaced: a seven-day window holds roughly 2,000 five-minute rows against a
  // 500-row page, so one request charted a fraction of the range and every KPI total undercounted.
  it('walks every page so a multi-page window is counted in full', async () => {
    const total = PAGE_SIZE.SERIES * 3 + 17
    const { fetcher, calls } = pagedFetcher(total)

    const result = await fetchAllMetricEntries(BASE_PARAMS, { fetcher })

    expect(result.entries).toHaveLength(total)
    expect(result.totalCount).toBe(total)
    expect(result.isTruncated).toBe(false)
    expect(calls).toHaveLength(4)
    expect(calls.map((call) => call.startIndex)).toEqual([
      0,
      PAGE_SIZE.SERIES,
      PAGE_SIZE.SERIES * 2,
      PAGE_SIZE.SERIES * 3,
    ])
  })

  // Ascending order keeps paging stable: rows written mid-walk append instead of shifting
  // everything already read, which a descending sort would do.
  it('pages in ascending start-date order', async () => {
    const { fetcher, calls } = pagedFetcher(5)

    await fetchAllMetricEntries(BASE_PARAMS, { fetcher })

    expect(calls[0]).toMatchObject({ sortBy: 'jansStartDate', sortOrder: 'ascending' })
  })

  it('reports truncation instead of silently returning a short series', async () => {
    const total = PAGE_SIZE.SERIES * (MAX_ENTRY_PAGES + 5)
    const { fetcher, calls } = pagedFetcher(total)

    const result = await fetchAllMetricEntries(BASE_PARAMS, { fetcher })

    expect(calls).toHaveLength(MAX_ENTRY_PAGES)
    expect(result.isTruncated).toBe(true)
    expect(result.totalCount).toBe(total)
  })

  // A server that over-reports its total would otherwise keep the walk running to the ceiling.
  it('stops on an empty page even when the reported total is larger', async () => {
    const calls: GetMetricEntriesParams[] = []
    const fetcher = (params: GetMetricEntriesParams): Promise<MetricEntryPagedResult> => {
      calls.push(params)
      const entries = (params.startIndex ?? 0) === 0 ? [row(0)] : []
      return Promise.resolve({
        start: params.startIndex ?? 0,
        totalEntriesCount: 9999,
        entriesCount: entries.length,
        entries,
      })
    }

    const result = await fetchAllMetricEntries(BASE_PARAMS, { fetcher })

    expect(calls).toHaveLength(2)
    expect(result.entries).toHaveLength(1)
    expect(result.isTruncated).toBe(false)
  })

  it('treats a response with no entries array as the end of the walk', async () => {
    const fetcher = () => Promise.resolve({} as MetricEntryPagedResult)

    const result = await fetchAllMetricEntries(BASE_PARAMS, { fetcher })

    expect(result.entries).toEqual([])
    expect(result.isTruncated).toBe(false)
  })
})
