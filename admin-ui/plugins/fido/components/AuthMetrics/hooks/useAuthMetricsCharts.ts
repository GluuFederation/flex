import { useMemo } from 'react'
import { METRIC_TYPES } from '../constants'
import { buildChartRows, groupBySubType, plainPoints, sumCounts, toUtcWallClockMs } from '../utils'
import { useAllMetricEntries } from './useMetricSeries'
import type { Granularity, MetricRange, NamedSeries } from '../types'

// Series keys are the recharts dataKeys, kept separate from the metric type names so a chart
// legend never has to render a raw jansMetricTyp string.
const SERIES_KEYS = {
  SUCCESS: 'success',
  FAILURE: 'failure',
  ACCESS_TOKEN: 'accessToken',
  ID_TOKEN: 'idToken',
  REFRESH_TOKEN: 'refreshToken',
  AUTHORIZATION_CODE: 'authorizationCode',
} as const

// Prefixed so an acr named after one of the fixed series keys, or after an axis field, cannot
// collide with it once the values share a row.
const ACR_KEY_PREFIX = 'acr__'

type UseAuthMetricsChartsArgs = {
  range: MetricRange
  granularity: Granularity
}

// Every chart on this page reads /metric/entries rather than /metric/aggregations: the raw rows
// arrive in five-minute buckets, finer than any aggregation period, and they are available now
// whereas the aggregation producer is not deployed.
export const useAuthMetricsCharts = ({ range, granularity }: UseAuthMetricsChartsArgs) => {
  // Listed one call per type because hooks cannot run inside a loop or callback.
  const success = useAllMetricEntries({ range, metricType: METRIC_TYPES.AUTH_SUCCESS })
  const failure = useAllMetricEntries({ range, metricType: METRIC_TYPES.AUTH_FAILURE })
  const accessToken = useAllMetricEntries({ range, metricType: METRIC_TYPES.ACCESS_TOKEN })
  const idToken = useAllMetricEntries({ range, metricType: METRIC_TYPES.ID_TOKEN })
  const refreshToken = useAllMetricEntries({ range, metricType: METRIC_TYPES.REFRESH_TOKEN })
  const authorizationCode = useAllMetricEntries({
    range,
    metricType: METRIC_TYPES.AUTHORIZATION_CODE,
  })

  // Multi-hour and multi-day buckets are measured from the start of the window, so every chart
  // has to fold against the same anchor or their x-axes would not line up.
  const anchorMs = useMemo(() => toUtcWallClockMs(range.startDate), [range.startDate])

  // Only the plain rows: the endpoint also returns a per-subtype copy of the same window, so
  // charting both together would double every total.
  const successTotals = useMemo(() => plainPoints(success.points), [success.points])
  const failureTotals = useMemo(() => plainPoints(failure.points), [failure.points])

  const authRows = useMemo(
    () =>
      buildChartRows(
        [
          { key: SERIES_KEYS.SUCCESS, points: successTotals },
          { key: SERIES_KEYS.FAILURE, points: failureTotals },
        ],
        granularity,
        anchorMs,
      ),
    [successTotals, failureTotals, granularity, anchorMs],
  )

  // The ACR breakdown the security team asked for: jansMetricSubTyp carries the acr each
  // successful authentication ran under.
  const acrSeries = useMemo<NamedSeries[]>(
    () =>
      groupBySubType(success.points).map((series) => ({
        ...series,
        key: `${ACR_KEY_PREFIX}${series.key}`,
        label: series.key,
      })),
    [success.points],
  )

  const acrRows = useMemo(
    () => buildChartRows(acrSeries, granularity, anchorMs),
    [acrSeries, granularity, anchorMs],
  )

  const tokenRows = useMemo(
    () =>
      buildChartRows(
        [
          { key: SERIES_KEYS.ACCESS_TOKEN, points: plainPoints(accessToken.points) },
          { key: SERIES_KEYS.ID_TOKEN, points: plainPoints(idToken.points) },
          { key: SERIES_KEYS.REFRESH_TOKEN, points: plainPoints(refreshToken.points) },
          { key: SERIES_KEYS.AUTHORIZATION_CODE, points: plainPoints(authorizationCode.points) },
        ],
        granularity,
        anchorMs,
      ),
    [
      anchorMs,
      accessToken.points,
      idToken.points,
      refreshToken.points,
      authorizationCode.points,
      granularity,
    ],
  )

  const totals = useMemo(() => {
    const successCount = sumCounts(successTotals)
    const failureCount = sumCounts(failureTotals)
    const attempts = successCount + failureCount

    return {
      success: successCount,
      failure: failureCount,
      attempts,
      // Guarded rather than reported as zero: no attempts means the rate is unknown, and a flat
      // 0% would read as total failure.
      successRate: attempts > 0 ? (successCount / attempts) * 100 : null,
      acrCount: acrSeries.length,
    }
  }, [successTotals, failureTotals, acrSeries])

  const queries = [success, failure, accessToken, idToken, refreshToken, authorizationCode]

  return {
    authRows,
    acrRows,
    acrSeries,
    tokenRows,
    totals,
    // Covers the refetch too, not just the first load: keepPreviousData holds the old series on
    // screen while a new range loads, so a first-load-only flag would let View look inert.
    isBusy: queries.some((query) => query.isLoading || query.isFetching),
    // Every query has to fail before the page calls itself unavailable; one idle metric type
    // erroring should not hide the five that returned data.
    isError: queries.every((query) => query.isError),
    // Surfaced rather than swallowed: a truncated walk means the totals below are incomplete.
    isTruncated: queries.some((query) => query.isTruncated),
    refetch: () => queries.forEach((query) => void query.refetch()),
  }
}

export { SERIES_KEYS, ACR_KEY_PREFIX }
