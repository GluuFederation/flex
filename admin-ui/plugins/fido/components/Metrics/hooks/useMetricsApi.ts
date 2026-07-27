import { useEffect } from 'react'
import {
  useQuery,
  keepPreviousData,
  type UseQueryResult,
  type QueryKey,
} from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { updateToast } from 'Redux/features/toastSlice'
import { getQueryErrorMessage } from '@/utils/errorHandler'
import { toApiDatetime } from '@/utils/dayjsUtils'
import { AXIOS_INSTANCE } from 'Orval'
import { METRICS_CACHE_CONFIG, METRICS_ENTRIES_PAGE_SIZE } from '../constants'
import type {
  AdoptionMetricsParams,
  AdoptionMetricsResponse,
  AggregationParams,
  AggregationResponse,
  AggregationTypeParam,
  DevicesAnalyticsParams,
  DevicesAnalyticsResponse,
  ErrorsAnalyticsParams,
  ErrorsAnalyticsResponse,
  MetricsDateRange,
  MetricsEntriesParams,
  MetricsEntriesResponse,
  PerformanceAnalyticsParams,
  PerformanceAnalyticsResponse,
} from '../types'

const formatDateForApi = toApiDatetime

const getGetAdoptionMetricsQueryKey = (params: AdoptionMetricsParams) =>
  ['fido2', 'metrics', 'analytics', 'adoption', params] as const

const getGetErrorsAnalyticsQueryKey = (params: ErrorsAnalyticsParams) =>
  ['fido2', 'metrics', 'analytics', 'errors', params] as const

const getGetPerformanceAnalyticsQueryKey = (params: PerformanceAnalyticsParams) =>
  ['fido2', 'metrics', 'analytics', 'performance', params] as const

const getGetDevicesAnalyticsQueryKey = (params: DevicesAnalyticsParams) =>
  ['fido2', 'metrics', 'analytics', 'devices', params] as const

const getGetMetricsEntriesQueryKey = (params: MetricsEntriesParams) =>
  ['fido2', 'metrics', 'entries', params] as const

const getGetMetricsEntriesByOperationQueryKey = (
  operationType: string,
  params: MetricsEntriesParams,
) => ['fido2', 'metrics', 'entries', 'operation', operationType, params] as const

const getGetMetricsEntriesByUserQueryKey = (userId: string, params: MetricsEntriesParams) =>
  ['fido2', 'metrics', 'entries', 'user', userId, params] as const

const metricsApi = {
  getAdoption: async (params: AdoptionMetricsParams): Promise<AdoptionMetricsResponse> => {
    const { data } = await AXIOS_INSTANCE.get<AdoptionMetricsResponse>(
      '/fido2/metrics/analytics/adoption',
      { params },
    )
    return data ?? {}
  },
  getErrors: async (params: ErrorsAnalyticsParams): Promise<ErrorsAnalyticsResponse> => {
    const { data } = await AXIOS_INSTANCE.get<ErrorsAnalyticsResponse>(
      '/fido2/metrics/analytics/errors',
      { params },
    )
    return data ?? {}
  },
  getPerformance: async (
    params: PerformanceAnalyticsParams,
  ): Promise<PerformanceAnalyticsResponse> => {
    const { data } = await AXIOS_INSTANCE.get<PerformanceAnalyticsResponse>(
      '/fido2/metrics/analytics/performance',
      { params },
    )
    return data ?? {}
  },
  getDevices: async (params: DevicesAnalyticsParams): Promise<DevicesAnalyticsResponse> => {
    const { data } = await AXIOS_INSTANCE.get<DevicesAnalyticsResponse>(
      '/fido2/metrics/analytics/devices',
      { params },
    )
    return data ?? {}
  },
  getEntries: async (params: MetricsEntriesParams): Promise<MetricsEntriesResponse> => {
    const { data } = await AXIOS_INSTANCE.get<MetricsEntriesResponse>('/fido2/metrics/entries', {
      params,
    })
    return data ?? {}
  },
  getEntriesByOperation: async (
    operationType: string,
    params: MetricsEntriesParams,
  ): Promise<MetricsEntriesResponse> => {
    const { data } = await AXIOS_INSTANCE.get<MetricsEntriesResponse>(
      `/fido2/metrics/entries/operation/${encodeURIComponent(operationType)}`,
      { params },
    )
    return data ?? {}
  },
  getEntriesByUser: async (
    userId: string,
    params: MetricsEntriesParams,
  ): Promise<MetricsEntriesResponse> => {
    const { data } = await AXIOS_INSTANCE.get<MetricsEntriesResponse>(
      `/fido2/metrics/entries/user/${encodeURIComponent(userId)}`,
      { params },
    )
    return data ?? {}
  },
}

const shownErrorHashes = new Set<string>()

const useErrorToast = <T>(query: UseQueryResult<T>, queryKey: QueryKey) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const failureId = JSON.stringify(queryKey)
  useEffect(() => {
    if (query.isError) {
      if (shownErrorHashes.has(failureId)) return
      shownErrorHashes.add(failureId)
      const errorMsg = getQueryErrorMessage(query.error, t('messages.error_in_loading'))
      dispatch(updateToast(true, 'error', errorMsg))
    } else if (query.isSuccess) {
      shownErrorHashes.delete(failureId)
    }
  }, [failureId, query.isError, query.isSuccess, query.error, dispatch, t])
}

const EMPTY_PARAMS = { start_date: '', end_date: '' } as const

const buildDateParams = (dateRange: MetricsDateRange | null) =>
  dateRange
    ? {
        start_date: formatDateForApi(dateRange.startDate),
        end_date: formatDateForApi(dateRange.endDate),
      }
    : EMPTY_PARAMS

const isDateRangeReady = (dateRange: MetricsDateRange | null): boolean =>
  !!dateRange && !!dateRange.startDate && !!dateRange.endDate

const useAdoptionMetrics = (
  dateRange: MetricsDateRange | null,
  options?: { enabled?: boolean },
) => {
  const hasSession = useAppSelector((state) => state.authReducer?.hasSession)
  const params = buildDateParams(dateRange)
  const isEnabled = (options?.enabled ?? true) && hasSession === true && isDateRangeReady(dateRange)

  const queryKey = getGetAdoptionMetricsQueryKey(params)
  const query = useQuery({
    queryKey,
    queryFn: () => metricsApi.getAdoption(params),
    enabled: isEnabled,
    staleTime: METRICS_CACHE_CONFIG.STALE_TIME,
    gcTime: METRICS_CACHE_CONFIG.GC_TIME,
    placeholderData: keepPreviousData,
    retry: false,
  })

  useErrorToast(query, queryKey)
  return query
}

const useErrorsAnalytics = (
  dateRange: MetricsDateRange | null,
  options?: { enabled?: boolean },
) => {
  const hasSession = useAppSelector((state) => state.authReducer?.hasSession)
  const params = buildDateParams(dateRange)
  const isEnabled = (options?.enabled ?? true) && hasSession === true && isDateRangeReady(dateRange)

  const queryKey = getGetErrorsAnalyticsQueryKey(params)
  const query = useQuery({
    queryKey,
    queryFn: () => metricsApi.getErrors(params),
    enabled: isEnabled,
    staleTime: METRICS_CACHE_CONFIG.STALE_TIME,
    gcTime: METRICS_CACHE_CONFIG.GC_TIME,
    placeholderData: keepPreviousData,
    retry: false,
  })

  useErrorToast(query, queryKey)
  return query
}

const usePerformanceAnalytics = (
  dateRange: MetricsDateRange | null,
  options?: { enabled?: boolean },
) => {
  const hasSession = useAppSelector((state) => state.authReducer?.hasSession)
  const params = buildDateParams(dateRange)
  const isEnabled = (options?.enabled ?? true) && hasSession === true && isDateRangeReady(dateRange)

  const queryKey = getGetPerformanceAnalyticsQueryKey(params)
  const query = useQuery({
    queryKey,
    queryFn: () => metricsApi.getPerformance(params),
    enabled: isEnabled,
    staleTime: METRICS_CACHE_CONFIG.STALE_TIME,
    gcTime: METRICS_CACHE_CONFIG.GC_TIME,
    placeholderData: keepPreviousData,
    retry: false,
  })

  useErrorToast(query, queryKey)
  return query
}

const useAggregationMetrics = (
  aggregationType: AggregationTypeParam,
  dateRange: MetricsDateRange | null,
  options?: { enabled?: boolean },
) => {
  const hasSession = useAppSelector((state) => state.authReducer?.hasSession)
  const isEnabled = (options?.enabled ?? true) && hasSession === true && isDateRangeReady(dateRange)

  const params: AggregationParams = {
    aggregationType,
    start_date: dateRange ? formatDateForApi(dateRange.startDate) : '',
    end_date: dateRange ? formatDateForApi(dateRange.endDate) : '',
    limit: 50,
    startIndex: 0,
  }

  const queryKey = [
    'fido2',
    'metrics',
    'aggregations',
    aggregationType,
    params.start_date,
    params.end_date,
  ] as const
  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<AggregationResponse> => {
      const { data } = await AXIOS_INSTANCE.get<AggregationResponse>(
        `/fido2/metrics/aggregations/${aggregationType}`,
        {
          params: {
            limit: params.limit,
            startIndex: params.startIndex,
            start_date: params.start_date,
            end_date: params.end_date,
          },
        },
      )
      return data ?? {}
    },
    enabled: isEnabled,
    staleTime: METRICS_CACHE_CONFIG.STALE_TIME,
    gcTime: METRICS_CACHE_CONFIG.GC_TIME,
    placeholderData: keepPreviousData,
    retry: false,
  })

  useErrorToast(query, queryKey)
  return query
}

const buildEntriesParams = (
  dateRange: MetricsDateRange | null,
  options?: { limit?: number; startIndex?: number },
): MetricsEntriesParams => ({
  ...buildDateParams(dateRange),
  limit: options?.limit ?? METRICS_ENTRIES_PAGE_SIZE,
  startIndex: options?.startIndex ?? 0,
})

const useDevicesAnalytics = (
  dateRange: MetricsDateRange | null,
  options?: { enabled?: boolean },
) => {
  const hasSession = useAppSelector((state) => state.authReducer?.hasSession)
  const params = buildDateParams(dateRange)
  const isEnabled = (options?.enabled ?? true) && hasSession === true && isDateRangeReady(dateRange)

  const queryKey = getGetDevicesAnalyticsQueryKey(params)
  const query = useQuery({
    queryKey,
    queryFn: () => metricsApi.getDevices(params),
    enabled: isEnabled,
    staleTime: METRICS_CACHE_CONFIG.STALE_TIME,
    gcTime: METRICS_CACHE_CONFIG.GC_TIME,
    placeholderData: keepPreviousData,
    retry: false,
  })

  useErrorToast(query, queryKey)
  return query
}

const useMetricsEntries = (
  dateRange: MetricsDateRange | null,
  options?: { enabled?: boolean; limit?: number; startIndex?: number },
) => {
  const hasSession = useAppSelector((state) => state.authReducer?.hasSession)
  const params = buildEntriesParams(dateRange, options)
  const isEnabled = (options?.enabled ?? true) && hasSession === true && isDateRangeReady(dateRange)

  const queryKey = getGetMetricsEntriesQueryKey(params)
  const query = useQuery({
    queryKey,
    queryFn: () => metricsApi.getEntries(params),
    enabled: isEnabled,
    staleTime: METRICS_CACHE_CONFIG.STALE_TIME,
    gcTime: METRICS_CACHE_CONFIG.GC_TIME,
    placeholderData: keepPreviousData,
    retry: false,
  })

  useErrorToast(query, queryKey)
  return query
}

const useMetricsEntriesByOperation = (
  operationType: string,
  dateRange: MetricsDateRange | null,
  options?: { enabled?: boolean; limit?: number; startIndex?: number },
) => {
  const hasSession = useAppSelector((state) => state.authReducer?.hasSession)
  const params = buildEntriesParams(dateRange, options)
  const isEnabled =
    (options?.enabled ?? true) &&
    hasSession === true &&
    isDateRangeReady(dateRange) &&
    !!operationType

  const queryKey = getGetMetricsEntriesByOperationQueryKey(operationType, params)
  const query = useQuery({
    queryKey,
    queryFn: () => metricsApi.getEntriesByOperation(operationType, params),
    enabled: isEnabled,
    staleTime: METRICS_CACHE_CONFIG.STALE_TIME,
    gcTime: METRICS_CACHE_CONFIG.GC_TIME,
    placeholderData: keepPreviousData,
    retry: false,
  })

  useErrorToast(query, queryKey)
  return query
}

const useMetricsEntriesByUser = (
  userId: string,
  dateRange: MetricsDateRange | null,
  options?: { enabled?: boolean; limit?: number; startIndex?: number },
) => {
  const hasSession = useAppSelector((state) => state.authReducer?.hasSession)
  const params = buildEntriesParams(dateRange, options)
  const isEnabled =
    (options?.enabled ?? true) && hasSession === true && isDateRangeReady(dateRange) && !!userId

  const queryKey = getGetMetricsEntriesByUserQueryKey(userId, params)
  const query = useQuery({
    queryKey,
    queryFn: () => metricsApi.getEntriesByUser(userId, params),
    enabled: isEnabled,
    staleTime: METRICS_CACHE_CONFIG.STALE_TIME,
    gcTime: METRICS_CACHE_CONFIG.GC_TIME,
    placeholderData: keepPreviousData,
    retry: false,
  })

  useErrorToast(query, queryKey)
  return query
}

export {
  useAdoptionMetrics,
  useErrorsAnalytics,
  usePerformanceAnalytics,
  useAggregationMetrics,
  useDevicesAnalytics,
  useMetricsEntries,
  useMetricsEntriesByOperation,
  useMetricsEntriesByUser,
}
