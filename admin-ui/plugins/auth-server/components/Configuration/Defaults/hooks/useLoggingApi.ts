import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import {
  useGetConfigLogging,
  usePutConfigLogging,
  getGetConfigLoggingQueryKey,
  type Logging,
} from 'JansConfigApi'
import { updateToast } from 'Redux/features/toastSlice'
import { logAuditUserAction } from 'Utils/AuditLogger'
import { UPDATE } from '@/audit/UserActionType'
import { API_LOGGING } from '@/audit/Resources'
import type { ChangedFields } from 'Plugins/auth-server/redux/features/types/loggingTypes'
import type { AuthState, RootState } from '@/redux/sagas/types/audit'

const LOGGING_CACHE_CONFIG = {
  STALE_TIME: 5 * 60 * 1000,
  GC_TIME: 10 * 60 * 1000,
}

export function useLoggingConfig() {
  const authToken = useSelector((state: RootState) => state.authReducer?.token?.access_token)

  return useGetConfigLogging({
    query: {
      enabled: !!authToken,
      staleTime: LOGGING_CACHE_CONFIG.STALE_TIME,
      gcTime: LOGGING_CACHE_CONFIG.GC_TIME,
    },
  })
}

interface UpdateLoggingParams {
  data: Logging
  userMessage: string
  changedFields: ChangedFields<Logging>
}

export function useUpdateLoggingConfig() {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const authState = useSelector((state: RootState) => state.authReducer)
  const baseMutation = usePutConfigLogging()

  const logAudit = useCallback(
    async (userMessage: string, changedFields: ChangedFields<Logging>): Promise<void> => {
      const token = authState?.token?.access_token ?? ''
      const userinfo = authState?.userinfo
      const clientId = authState?.config?.clientId
      const ipAddress = authState?.location?.IPv4

      try {
        await logAuditUserAction({
          token,
          userinfo,
          action: UPDATE,
          resource: API_LOGGING,
          message: userMessage,
          extra: ipAddress ? { ip_address: ipAddress } : {},
          client_id: clientId,
          payload: { modifiedFields: changedFields },
        })
      } catch (error) {
        console.error('Failed to log logging audit action:', error)
      }
    },
    [authState],
  )

  const mutateAsync = useCallback(
    async (params: UpdateLoggingParams): Promise<Logging> => {
      const { data, userMessage, changedFields } = params

      const result = await baseMutation.mutateAsync({ data })

      await queryClient.invalidateQueries({ queryKey: getGetConfigLoggingQueryKey() })

      dispatch(updateToast(true, 'success'))

      logAudit(userMessage, changedFields)

      return result
    },
    [baseMutation, queryClient, logAudit, dispatch],
  )

  return {
    ...baseMutation,
    mutateAsync,
  }
}
