import { useMemo } from 'react'
import { useAppSelector } from '@/redux/hooks'
import { useGetOauthOpenidClients } from 'JansConfigApi'

export const useDashboardClients = () => {
  const hasSession = useAppSelector((state) => state.authReducer?.hasSession)

  const query = useGetOauthOpenidClients(undefined, {
    query: {
      enabled: hasSession === true,
    },
  })

  const clients = useMemo(() => query.data?.entries ?? [], [query.data?.entries])
  const totalCount = query.data?.totalEntriesCount ?? 0

  return {
    clients,
    totalCount,
    isLoading: query.isLoading,
  }
}
