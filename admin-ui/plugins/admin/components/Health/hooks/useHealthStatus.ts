import { useMemo } from 'react'
import { useGetServiceStatus, type JsonNode } from 'JansConfigApi'
import { useAppSelector } from '@/redux/hooks'
import type { ServiceHealth, ServiceStatusValue, ServiceStatusResponse } from '../types'
import {
  HEALTH_CACHE_CONFIG,
  HEALTH_PAGE_EXCLUDED_SERVICES,
  STATUS_MAP,
  DEFAULT_STATUS,
} from '../constants'

const normalizeStatus = (apiStatus: string): ServiceStatusValue => {
  const statusMap = STATUS_MAP as Record<string, ServiceStatusValue>
  const normalized = apiStatus.trim().toLowerCase()
  return statusMap[normalized] ?? DEFAULT_STATUS
}

const STATUS_SORT_ORDER: Record<ServiceStatusValue, number> = {
  up: 0,
  degraded: 1,
  unknown: 2,
  down: 3,
}

const sortServicesByStatus = (services: ServiceHealth[]): ServiceHealth[] => {
  return [...services].sort((a, b) => STATUS_SORT_ORDER[a.status] - STATUS_SORT_ORDER[b.status])
}

const transformServiceStatus = (data: JsonNode | undefined): ServiceHealth[] => {
  if (!data || typeof data !== 'object') {
    return []
  }

  const response = data as ServiceStatusResponse
  const checkedAt = new Date()

  const services = Object.entries(response).map(([name, status]) => ({
    name,
    status: normalizeStatus(String(status)),
    lastChecked: checkedAt,
  }))

  return sortServicesByStatus(services)
}

export const useHealthStatus = () => {
  const hasSession = useAppSelector((state) => state.authReducer?.hasSession)

  const query = useGetServiceStatus(undefined, {
    query: {
      enabled: hasSession === true,
      staleTime: HEALTH_CACHE_CONFIG.STALE_TIME,
      gcTime: HEALTH_CACHE_CONFIG.GC_TIME,
      select: transformServiceStatus,
    },
  })

  const allServices = query.data ?? []

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
    services,
    allServices,
    healthyCount,
    totalCount,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
