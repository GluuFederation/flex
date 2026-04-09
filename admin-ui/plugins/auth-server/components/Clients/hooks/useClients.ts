import { useMemo } from 'react'
import { useAppSelector } from '@/redux/hooks'
import { useGetOauthOpenidClients } from 'JansConfigApi'
import type { UseClientsParams } from '../types'

export const useClients = <T = Record<string, string>>(params?: UseClientsParams) => {
  const hasSession = useAppSelector((state) => state.authReducer?.hasSession)

  const queryParams = useMemo(
    () => (params ? { ...params, pattern: params.pattern || undefined } : undefined),
    [params],
  )

  const query = useGetOauthOpenidClients(queryParams, {
    query: {
      enabled: hasSession === true && params !== undefined,
    },
  })

  const clients = useMemo(() => (query.data?.entries ?? []) as T[], [query.data?.entries])
  const totalCount = query.data?.totalEntriesCount ?? 0

  return {
    clients,
    totalCount,
    isLoading: query.isLoading,
    refetch: query.refetch,
  }
}
