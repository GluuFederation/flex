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
import type { RootState } from '@/redux/sagas/types/audit'

const LOGGING_CACHE_CONFIG = {
  STALE_TIME: 5 * 60 * 1000,
  GC_TIME: 10 * 60 * 1000,
}

export function useLoggingConfig() {
  const hasSession = useSelector((state: RootState) => state.authReducer?.hasSession)

  return useGetConfigLogging({
    query: {
      enabled: hasSession === true,
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
  const userinfo = useSelector((state: RootState) => state.authReducer?.userinfo)
  const clientId = useSelector((state: RootState) => state.authReducer?.config?.clientId)
  const ipAddress = useSelector((state: RootState) => state.authReducer?.location?.IPv4)
  const baseMutation = usePutConfigLogging()

  const logAudit = useCallback(
    async (userMessage: string, changedFields: ChangedFields<Logging>): Promise<void> => {
      try {
        await logAuditUserAction({
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
    [userinfo, clientId, ipAddress],
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
