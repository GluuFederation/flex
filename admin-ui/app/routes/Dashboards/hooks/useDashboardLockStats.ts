import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useGetLockStat, type JsonNode } from 'JansConfigApi'
import type { RootState } from 'Redux/sagas/types/audit'
import { DASHBOARD_CACHE_CONFIG } from '../constants'
import type { LockStatEntry } from '../types'

function transformLockStats(data: JsonNode[] | undefined): LockStatEntry[] {
  if (!data || !Array.isArray(data)) {
    return []
  }

  return data.map((item) => ({
    monthly_active_users: (item as LockStatEntry).monthly_active_users,
    monthly_active_clients: (item as LockStatEntry).monthly_active_clients,
    month: (item as LockStatEntry).month,
  }))
}

interface UseDashboardLockStatsOptions {
  enabled?: boolean
}

export function useDashboardLockStats(options: UseDashboardLockStatsOptions = {}) {
  const { enabled = true } = options
  const authToken = useSelector((state: RootState) => state.authReducer?.token?.access_token)

  const query = useGetLockStat(undefined, {
    query: {
      enabled: !!authToken && enabled,
      staleTime: DASHBOARD_CACHE_CONFIG.STALE_TIME,
      gcTime: DASHBOARD_CACHE_CONFIG.GC_TIME,
      select: transformLockStats,
      retry: false,
    },
  })

  const latestStats = useMemo(() => {
    const data = query.data
    if (!data || data.length === 0) {
      return {
        monthly_active_users: 0,
        monthly_active_clients: 0,
      }
    }

    if (data.length === 1) {
      return {
        monthly_active_users: data[0].monthly_active_users ?? 0,
        monthly_active_clients: data[0].monthly_active_clients ?? 0,
      }
    }

    return {
      monthly_active_users: data.reduce((sum, entry) => sum + (entry.monthly_active_users ?? 0), 0),
      monthly_active_clients: data.reduce(
        (sum, entry) => sum + (entry.monthly_active_clients ?? 0),
        0,
      ),
    }
  }, [query.data])

  return {
    ...query,
    data: query.data ?? [],
    latestStats,
  }
}
