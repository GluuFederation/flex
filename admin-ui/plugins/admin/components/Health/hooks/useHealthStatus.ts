import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useGetServiceStatus, type JsonNode } from 'JansConfigApi'
import type { RootState } from 'Redux/sagas/types/audit'
import type { ServiceHealth, ServiceStatusValue, ServiceStatusResponse } from '../types'
import { HEALTH_CACHE_CONFIG, STATUS_MAP, DEFAULT_STATUS } from '../constants'

function normalizeStatus(apiStatus: string): ServiceStatusValue {
  const statusMap = STATUS_MAP as Record<string, ServiceStatusValue>
  return statusMap[apiStatus] ?? DEFAULT_STATUS
}

const STATUS_SORT_ORDER: Record<ServiceStatusValue, number> = {
  up: 0,
  degraded: 1,
  unknown: 2,
  down: 3,
}

function sortServicesByStatus(services: ServiceHealth[]): ServiceHealth[] {
  return [...services].sort((a, b) => STATUS_SORT_ORDER[a.status] - STATUS_SORT_ORDER[b.status])
}

function transformServiceStatus(data: JsonNode | undefined): ServiceHealth[] {
  if (!data || typeof data !== 'object') {
    return []
  }

  const response = data as ServiceStatusResponse

  const services = Object.entries(response).map(([name, status]) => ({
    name,
    status: normalizeStatus(String(status)),
    lastChecked: new Date(),
  }))

  return sortServicesByStatus(services)
}

// Services to exclude from Health page (show only 6 services)
const HEALTH_PAGE_EXCLUDED_SERVICES = ['jans-lock', 'jans-link'] as const

export function useHealthStatus() {
  const hasSession = useSelector((state: RootState) => state.authReducer?.hasSession)

  const query = useGetServiceStatus(undefined, {
    query: {
      enabled: hasSession === true,
      staleTime: HEALTH_CACHE_CONFIG.STALE_TIME,
      gcTime: HEALTH_CACHE_CONFIG.GC_TIME,
      select: transformServiceStatus,
    },
  })

  const allServices = query.data ?? []

  // Filter out excluded services for Health page (show only 6 services)
  const services = useMemo(
    () =>
      allServices.filter(
        (s) => !(HEALTH_PAGE_EXCLUDED_SERVICES as readonly string[]).includes(s.name),
      ),
    [allServices],
  )

  const { healthyCount, totalCount } = useMemo(
    () => ({
      healthyCount: services.filter((s) => s.status === 'up').length,
      totalCount: services.length,
    }),
    [services],
  )

  return {
    services, // Filtered services (6) for Health page
    allServices, // All services (8) for Dashboard
    healthyCount,
    totalCount,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
