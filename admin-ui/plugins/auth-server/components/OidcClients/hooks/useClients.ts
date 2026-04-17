import { useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { useGetOauthOpenidClients } from 'JansConfigApi'
import { updateToast } from 'Redux/features/toastSlice'
import { getQueryErrorMessage } from '@/utils/errorHandler'
import type { UseClientsParams, ClientRow } from '../types'

export const useClients = <T = ClientRow>(params?: UseClientsParams) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const hasSession = useAppSelector((state) => state.authReducer?.hasSession)

  const queryParams = useMemo(
    () => (params ? { ...params, pattern: params.pattern || undefined } : undefined),
    [params?.limit, params?.pattern, params?.startIndex],
  )

  const query = useGetOauthOpenidClients(queryParams, {
    query: {
      enabled: hasSession === true && queryParams !== undefined,
    },
  })

  useEffect(() => {
    if (!query.isError) return
    const errorMsg = getQueryErrorMessage(query.error, t('messages.error_in_loading'))
    dispatch(updateToast(true, 'error', errorMsg))
  }, [query.isError, query.error, dispatch, t])

  const clients = useMemo(() => (query.data?.entries ?? []) as T[], [query.data?.entries])
  const totalCount = query.data?.totalEntriesCount ?? 0

  return {
    clients,
    totalCount,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
  }
}
