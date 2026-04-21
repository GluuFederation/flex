import { useCallback } from 'react'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { updateToast } from 'Redux/features/toastSlice'
import {
  useGetConfigLogging,
  usePutConfigLogging,
  getGetConfigLoggingQueryKey,
  type Logging,
} from 'JansConfigApi'
import { logAuditUserAction } from 'Utils/AuditLogger'
import { devLogger } from '@/utils/devLogger'
import { UPDATE } from '@/audit/UserActionType'
import { API_LOGGING } from '@/audit/Resources'
import type { ChangedFields, UpdateLoggingParams } from '../types'

const LOGGING_CACHE_CONFIG = {
  STALE_TIME: 5 * 60 * 1000,
  GC_TIME: 10 * 60 * 1000,
}

export const useLoggingConfig = () => {
  const hasSession = useAppSelector((state) => state.authReducer?.hasSession)

  return useGetConfigLogging({
    query: {
      enabled: hasSession === true,
      staleTime: LOGGING_CACHE_CONFIG.STALE_TIME,
      gcTime: LOGGING_CACHE_CONFIG.GC_TIME,
    },
  })
}

export const useUpdateLoggingConfig = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const userinfo = useAppSelector((state) => state.authReducer?.userinfo)
  const clientId = useAppSelector((state) => state.authReducer?.config?.clientId)
  const ipAddress = useAppSelector((state) => state.authReducer?.location?.IPv4)
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
        devLogger.error(
          'Failed to log logging audit action:',
          error instanceof Error ? error : String(error),
        )
      }
    },
    [userinfo, clientId, ipAddress],
  )

  const mutateAsync = useCallback(
    async (params: UpdateLoggingParams): Promise<Logging> => {
      const { data, userMessage, changedFields } = params

      const result = await baseMutation.mutateAsync({ data })

      queryClient.setQueryData(getGetConfigLoggingQueryKey(), result)

      dispatch(updateToast(true, 'success', t('messages.success_in_saving')))

      logAudit(userMessage, changedFields)

      return result
    },
    [baseMutation, queryClient, dispatch, logAudit, t],
  )

  return {
    ...baseMutation,
    mutateAsync,
  }
}
