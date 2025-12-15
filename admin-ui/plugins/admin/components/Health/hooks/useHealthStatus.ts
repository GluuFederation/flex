import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useGetServiceStatus, type JsonNode } from 'JansConfigApi'
import type { RootState } from 'Redux/sagas/types/audit'
import type { ServiceHealth, ServiceStatusValue, ServiceStatusResponse } from '../types'
import { HEALTH_CACHE_CONFIG, STATUS_MAP, DEFAULT_STATUS } from '../constants'

function normalizeStatus(apiStatus: string): ServiceStatusValue {
  return STATUS_MAP[apiStatus] ?? DEFAULT_STATUS
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

  const services = Object.entries(response)
    .filter(([, status]) => {
      const statusStr = String(status).toLowerCase()
      return statusStr !== 'not present'
    })
    .map(([name, status]) => ({
      name,
      status: normalizeStatus(String(status)),
      lastChecked: new Date(),
    }))

  return sortServicesByStatus(services)
}

export function useHealthStatus() {
  const authToken = useSelector((state: RootState) => state.authReducer?.token?.access_token)

  const query = useGetServiceStatus(undefined, {
    query: {
      enabled: !!authToken,
      staleTime: HEALTH_CACHE_CONFIG.STALE_TIME,
      gcTime: HEALTH_CACHE_CONFIG.GC_TIME,
      select: transformServiceStatus,
    },
  })

  const services = query.data ?? []

  const { healthyCount, totalCount } = useMemo(
    () => ({
      healthyCount: services.filter((s) => s.status === 'up').length,
      totalCount: services.length,
    }),
    [services],
  )

  return {
    services,
    healthyCount,
    totalCount,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
