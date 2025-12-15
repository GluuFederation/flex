import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useGetOauthOpenidClients } from 'JansConfigApi'
import type { RootState } from 'Redux/sagas/types/audit'
import { DASHBOARD_CACHE_CONFIG } from '../constants'

export function useDashboardClients() {
  const authToken = useSelector((state: RootState) => state.authReducer?.token?.access_token)

  const query = useGetOauthOpenidClients(undefined, {
    query: {
      enabled: !!authToken,
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
