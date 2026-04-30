import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { updateToast } from 'Redux/features/toastSlice'
import { getQueryErrorMessage } from '@/utils/errorHandler'
import { AXIOS_INSTANCE } from '../../../../../api-client'
import { HEALTH_CACHE_CONFIG } from '../constants'
import type { ServiceHealth } from '../types'

const FIDO2_HEALTH_QUERY_KEY = ['fido2', 'metrics', 'health'] as const

interface Fido2HealthResponse {
  status?: string
  [key: string]: string | number | boolean | null | undefined
}

const fetchFido2Health = async (signal?: AbortSignal): Promise<Fido2HealthResponse> => {
  const { data } = await AXIOS_INSTANCE.get<Fido2HealthResponse>('/fido2/metrics/health', {
    signal,
  })
  return data ?? {}
}

const transformFido2Health = (_data: Fido2HealthResponse): ServiceHealth => ({
  name: 'fido2-metrics',
  status: 'up',
  lastChecked: new Date(),
})

export const useFido2HealthStatus = (options?: { enabled?: boolean }) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const hasSession = useAppSelector((state) => state.authReducer?.hasSession)
  const isEnabled = (options?.enabled ?? true) && hasSession === true

  const query = useQuery({
    queryKey: FIDO2_HEALTH_QUERY_KEY,
    queryFn: ({ signal }) => fetchFido2Health(signal),
    enabled: isEnabled,
    staleTime: HEALTH_CACHE_CONFIG.STALE_TIME,
    gcTime: HEALTH_CACHE_CONFIG.GC_TIME,
    retry: false,
    select: transformFido2Health,
  })

  useEffect(() => {
    if (!query.isError) return
    const errorMsg = getQueryErrorMessage(query.error, t('messages.error_in_loading'))
    dispatch(updateToast(true, 'error', errorMsg))
  }, [query.isError, query.error, dispatch, t])

  return query
}
