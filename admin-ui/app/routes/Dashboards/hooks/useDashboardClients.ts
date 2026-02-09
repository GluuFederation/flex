import { useMemo } from 'react'
import { useAppSelector } from '@/redux/hooks'
import { useGetOauthOpenidClients } from 'JansConfigApi'
import { DASHBOARD_CACHE_CONFIG } from '../constants'

export const useDashboardClients = () => {
  const hasSession = useAppSelector((state) => state.authReducer?.hasSession)

  const query = useGetOauthOpenidClients(undefined, {
    query: {
      enabled: hasSession === true,
      staleTime: DASHBOARD_CACHE_CONFIG.STALE_TIME,
      gcTime: DASHBOARD_CACHE_CONFIG.GC_TIME,
    },
  })

  const clients = useMemo(() => query.data?.entries ?? [], [query.data?.entries])
  const totalCount = query.data?.totalEntriesCount ?? 0

  return {
    ...query,
    clients,
    totalCount,
  }
}
