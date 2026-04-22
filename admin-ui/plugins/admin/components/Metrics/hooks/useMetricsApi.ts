import { useQuery, keepPreviousData } from '@tanstack/react-query'
import type { Dayjs } from 'dayjs'
import { useAppSelector } from '@/redux/hooks'
import { AXIOS_INSTANCE } from '../../../../../api-client'
import { METRICS_CACHE_CONFIG } from '../constants'
import type {
  AdoptionMetricsParams,
  AdoptionMetricsResponse,
  MetricsDateRange,
} from '../types'

// Format Dayjs → "dd-MM-yyyy" as accepted by the Fido2 metrics endpoints
const formatDateForApi = (date: Dayjs): string => date.format('DD-MM-YYYY')

const getGetAdoptionMetricsQueryKey = (params: AdoptionMetricsParams) =>
  ['fido2', 'metrics', 'analytics', 'adoption', params] as const

export const METRICS_QUERY_KEYS = {
  adoption: getGetAdoptionMetricsQueryKey,
} as const

const metricsApi = {
  getAdoption: async (params: AdoptionMetricsParams): Promise<AdoptionMetricsResponse> => {
    const { data } = await AXIOS_INSTANCE.get<AdoptionMetricsResponse>(
      '/fido2/metrics/analytics/adoption',
      { params },
    )
    return data ?? {}
  },
}

export const useAdoptionMetrics = (
  dateRange: MetricsDateRange,
  options?: { enabled?: boolean },
) => {
  const hasSession = useAppSelector((state) => state.authReducer?.hasSession)

  const params: AdoptionMetricsParams = {
    start_date: formatDateForApi(dateRange.startDate),
    end_date: formatDateForApi(dateRange.endDate),
  }

  const isEnabled =
    (options?.enabled ?? true) &&
    hasSession === true &&
    !!dateRange.startDate &&
    !!dateRange.endDate

  return useQuery({
    queryKey: getGetAdoptionMetricsQueryKey(params),
    queryFn: () => metricsApi.getAdoption(params),
    enabled: isEnabled,
    staleTime: METRICS_CACHE_CONFIG.STALE_TIME,
    gcTime: METRICS_CACHE_CONFIG.GC_TIME,
    placeholderData: keepPreviousData,
  })
}
