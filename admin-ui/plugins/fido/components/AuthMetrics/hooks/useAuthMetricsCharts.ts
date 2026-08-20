import { useMemo } from 'react'
import { METRIC_TYPES } from '../constants'
import { buildChartRows, groupBySubType, plainPoints, sumCounts, toUtcWallClockMs } from '../utils'
import { useAllMetricEntries } from './useMetricSeries'
import type { Granularity, MetricRange, NamedSeries } from '../types'

const SERIES_KEYS = {
  SUCCESS: 'success',
  FAILURE: 'failure',
  ACCESS_TOKEN: 'accessToken',
  ID_TOKEN: 'idToken',
  REFRESH_TOKEN: 'refreshToken',
  AUTHORIZATION_CODE: 'authorizationCode',
} as const

const ACR_KEY_PREFIX = 'acr__'

type UseAuthMetricsChartsArgs = {
  range: MetricRange
  granularity: Granularity
}

export const useAuthMetricsCharts = ({ range, granularity }: UseAuthMetricsChartsArgs) => {
  const success = useAllMetricEntries({ range, metricType: METRIC_TYPES.AUTH_SUCCESS })
  const failure = useAllMetricEntries({ range, metricType: METRIC_TYPES.AUTH_FAILURE })
  const accessToken = useAllMetricEntries({ range, metricType: METRIC_TYPES.ACCESS_TOKEN })
  const idToken = useAllMetricEntries({ range, metricType: METRIC_TYPES.ID_TOKEN })
  const refreshToken = useAllMetricEntries({ range, metricType: METRIC_TYPES.REFRESH_TOKEN })
  const authorizationCode = useAllMetricEntries({
    range,
    metricType: METRIC_TYPES.AUTHORIZATION_CODE,
  })

  const anchorMs = useMemo(() => toUtcWallClockMs(range.startDate), [range.startDate])

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
    isBusy: queries.some((query) => query.isLoading || query.isFetching),
    isError: queries.every((query) => query.isError),
    isPartial: queries.some((query) => query.isError) && !queries.every((query) => query.isError),
    isTruncated: queries.some((query) => query.isTruncated),
    refetch: () => queries.forEach((query) => void query.refetch()),
  }
}

export { SERIES_KEYS, ACR_KEY_PREFIX }
