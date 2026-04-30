import { useEffect } from 'react'
import { useQuery, keepPreviousData, type UseQueryResult } from '@tanstack/react-query'
import type { Dayjs } from 'dayjs'
import { useTranslation } from 'react-i18next'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { updateToast } from 'Redux/features/toastSlice'
import { getQueryErrorMessage } from '@/utils/errorHandler'
import { AXIOS_INSTANCE } from '../../../../../api-client'
import { METRICS_CACHE_CONFIG } from '../constants'
import type {
  AdoptionMetricsParams,
  AdoptionMetricsResponse,
  AggregationParams,
  AggregationResponse,
  AggregationTypeParam,
  ErrorsAnalyticsParams,
  ErrorsAnalyticsResponse,
  MetricsDateRange,
  PerformanceAnalyticsParams,
  PerformanceAnalyticsResponse,
} from '../types'

const formatDateForApi = (date: Dayjs): string => {
  return date.second(0).millisecond(0).format('YYYY-MM-DDTHH:mm:ss') + 'Z'
}

const getGetAdoptionMetricsQueryKey = (params: AdoptionMetricsParams) =>
  ['fido2', 'metrics', 'analytics', 'adoption', params] as const

const getGetErrorsAnalyticsQueryKey = (params: ErrorsAnalyticsParams) =>
  ['fido2', 'metrics', 'analytics', 'errors', params] as const

const getGetPerformanceAnalyticsQueryKey = (params: PerformanceAnalyticsParams) =>
  ['fido2', 'metrics', 'analytics', 'performance', params] as const

export const METRICS_QUERY_KEYS = {
  adoption: getGetAdoptionMetricsQueryKey,
  errors: getGetErrorsAnalyticsQueryKey,
  performance: getGetPerformanceAnalyticsQueryKey,
} as const

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
}

const useErrorToast = <T>(query: UseQueryResult<T>) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (!query.isError) return
    const errorMsg = getQueryErrorMessage(query.error, t('messages.error_in_loading'))
    dispatch(updateToast(true, 'error', errorMsg))
  }, [query.isError, query.error, dispatch, t])
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

export const useAdoptionMetrics = (
  dateRange: MetricsDateRange | null,
  options?: { enabled?: boolean },
) => {
  const hasSession = useAppSelector((state) => state.authReducer?.hasSession)
  const params = buildDateParams(dateRange)
  const isEnabled = (options?.enabled ?? true) && hasSession === true && isDateRangeReady(dateRange)

  const query = useQuery({
    queryKey: getGetAdoptionMetricsQueryKey(params),
    queryFn: () => metricsApi.getAdoption(params),
    enabled: isEnabled,
    staleTime: METRICS_CACHE_CONFIG.STALE_TIME,
    gcTime: METRICS_CACHE_CONFIG.GC_TIME,
    placeholderData: keepPreviousData,
    retry: false,
  })

  useErrorToast(query)
  return query
}

export const useErrorsAnalytics = (
  dateRange: MetricsDateRange | null,
  options?: { enabled?: boolean },
) => {
  const hasSession = useAppSelector((state) => state.authReducer?.hasSession)
  const params = buildDateParams(dateRange)
  const isEnabled = (options?.enabled ?? true) && hasSession === true && isDateRangeReady(dateRange)

  const query = useQuery({
    queryKey: getGetErrorsAnalyticsQueryKey(params),
    queryFn: () => metricsApi.getErrors(params),
    enabled: isEnabled,
    staleTime: METRICS_CACHE_CONFIG.STALE_TIME,
    gcTime: METRICS_CACHE_CONFIG.GC_TIME,
    placeholderData: keepPreviousData,
    retry: false,
  })

  useErrorToast(query)
  return query
}

export const usePerformanceAnalytics = (
  dateRange: MetricsDateRange | null,
  options?: { enabled?: boolean },
) => {
  const hasSession = useAppSelector((state) => state.authReducer?.hasSession)
  const params = buildDateParams(dateRange)
  const isEnabled = (options?.enabled ?? true) && hasSession === true && isDateRangeReady(dateRange)

  const query = useQuery({
    queryKey: getGetPerformanceAnalyticsQueryKey(params),
    queryFn: () => metricsApi.getPerformance(params),
    enabled: isEnabled,
    staleTime: METRICS_CACHE_CONFIG.STALE_TIME,
    gcTime: METRICS_CACHE_CONFIG.GC_TIME,
    placeholderData: keepPreviousData,
    retry: false,
  })

  useErrorToast(query)
  return query
}

export const useAggregationMetrics = (
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

  const query = useQuery({
    queryKey: [
      'fido2',
      'metrics',
      'aggregations',
      aggregationType,
      params.start_date,
      params.end_date,
    ] as const,
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

  useErrorToast(query)
  return query
}
