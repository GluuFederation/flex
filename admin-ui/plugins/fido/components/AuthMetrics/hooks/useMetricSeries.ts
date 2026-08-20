import { useMemo } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useAppSelector } from '@/redux/hooks'
import {
  getMetricEntries,
  type GetMetricEntriesParams,
  type MetricDataEntry,
  type MetricEntryPagedResult,
} from 'JansConfigApi'
import {
  AUTH_METRICS_CACHE_CONFIG,
  POINT_LABEL_FORMAT,
  MAX_ENTRY_PAGES,
  PAGE_SIZE,
} from '../constants'
import { formatDateForApi, toMetricPoints } from '../utils'
import type { MetricPoint, MetricQueryOptions, MetricRange } from '../types'

type EntriesFetcher = (
  params: GetMetricEntriesParams,
  signal?: AbortSignal,
) => Promise<MetricEntryPagedResult>

type AllEntriesResult = {
  entries: MetricDataEntry[]
  totalCount: number
  isTruncated: boolean
}

const defaultFetcher: EntriesFetcher = (params, signal) =>
  getMetricEntries(params, undefined, signal)

const fetchAllMetricEntries = async (
  baseParams: GetMetricEntriesParams,
  { fetcher = defaultFetcher, signal }: { fetcher?: EntriesFetcher; signal?: AbortSignal } = {},
): Promise<AllEntriesResult> => {
  const collected: MetricDataEntry[] = []
  let totalCount = 0

  for (let page = 0; page < MAX_ENTRY_PAGES; page += 1) {
    const result = await fetcher(
      {
        ...baseParams,
        startIndex: page * PAGE_SIZE.SERIES,
        limit: PAGE_SIZE.SERIES,
        sortBy: 'jansStartDate',
        sortOrder: 'ascending',
      },
      signal,
    )

    const batch = result?.entries ?? []
    collected.push(...batch)
    totalCount = result?.totalEntriesCount ?? collected.length

    if (batch.length === 0 || collected.length >= totalCount) {
      return { entries: collected, totalCount, isTruncated: false }
    }
  }

  return { entries: collected, totalCount, isTruncated: collected.length < totalCount }
}

const useIsEnabled = (range: MetricRange, options?: MetricQueryOptions) => {
  const hasSession = useAppSelector((state) => state.authReducer?.hasSession)
  return (options?.enabled ?? true) && hasSession === true && !!range.startDate && !!range.endDate
}

const sharedQueryConfig = {
  staleTime: AUTH_METRICS_CACHE_CONFIG.STALE_TIME,
  gcTime: AUTH_METRICS_CACHE_CONFIG.GC_TIME,
  placeholderData: keepPreviousData,
}

const useAllMetricEntries = (
  args: {
    range: MetricRange
    metricType: string
    appType?: string
    subType?: string
  },
  options?: MetricQueryOptions,
) => {
  const { range, metricType, appType, subType } = args
  const isEnabled = useIsEnabled(range, options) && !!metricType

  const params: GetMetricEntriesParams = useMemo(
    () => ({
      metricType,
      start_date: formatDateForApi(range.startDate),
      end_date: formatDateForApi(range.endDate),
      ...(appType ? { appType } : {}),
      ...(subType ? { subType } : {}),
    }),
    [metricType, range.startDate, range.endDate, appType, subType],
  )

  const query = useQuery({
    queryKey: ['metric-entries-all', params],
    queryFn: ({ signal }) => fetchAllMetricEntries(params, { signal }),
    enabled: isEnabled,
    ...sharedQueryConfig,
  })

  const points: MetricPoint[] = useMemo(
    () => toMetricPoints(query.data?.entries, POINT_LABEL_FORMAT),
    [query.data],
  )

  return {
    ...query,
    points,
    totalCount: query.data?.totalCount ?? 0,
    isTruncated: query.data?.isTruncated ?? false,
  }
}

export { fetchAllMetricEntries, useAllMetricEntries }
export type { AllEntriesResult, EntriesFetcher }
