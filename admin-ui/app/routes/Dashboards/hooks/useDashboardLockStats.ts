import { useMemo } from 'react'
import { useAppSelector } from '@/redux/hooks'
import { useGetLockStat, type JsonNode } from 'JansConfigApi'
import { createDate, DATE_FORMATS, formatDate } from '@/utils/dayjsUtils'
import type { LockStatEntry } from '../types'

const EMPTY_LOCK_STATS: LockStatEntry[] = []

const transformLockStats = (data: JsonNode[] | undefined): LockStatEntry[] => {
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

export const useDashboardLockStats = (options: UseDashboardLockStatsOptions = {}) => {
  const { enabled = true } = options
  const hasSession = useAppSelector((state) => state.authReducer?.hasSession)
  const params = useMemo(() => ({ month: formatDate(createDate(), DATE_FORMATS.MONTH_KEY) }), [])

  const { data = EMPTY_LOCK_STATS, isLoading } = useGetLockStat(params, {
    query: {
      enabled: hasSession === true && enabled,
      select: transformLockStats,
      retry: false,
    },
  })

  const latestStats = useMemo(
    () => ({
      monthly_active_users: data[0]?.monthly_active_users ?? 0,
      monthly_active_clients: data[0]?.monthly_active_clients ?? 0,
    }),
    [data],
  )

  return { data, isLoading, latestStats }
}
