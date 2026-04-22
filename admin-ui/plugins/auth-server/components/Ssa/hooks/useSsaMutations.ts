import { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { useRevokeSsa, type RevokeSsaParams } from 'JansConfigApi'
import { useAppDispatch } from '@/redux/hooks'
import { devLogger } from '@/utils/devLogger'
import { updateToast } from 'Redux/features/toastSlice'
import type { CaughtError } from '../types/ErrorTypes'
import type { SsaAuditLogPayload } from '../types/SsaFormTypes'
import { logSsaDeletion, getErrorMessage } from '../helper'
import { SSA_QUERY_KEYS } from './useSsaApi'

export interface MutationCallbacks {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export const useRevokeSsaWithAudit = (callbacks?: MutationCallbacks) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const mutation = useRevokeSsa()
  const callbacksRef = useRef(callbacks)
  callbacksRef.current = callbacks

  const revokeSsa = useCallback(
    async (jti: string, userMessage?: string, auditPayload?: SsaAuditLogPayload) => {
      try {
        const params: RevokeSsaParams = { jti }
        await mutation.mutateAsync({ params })
      } catch (error) {
        const errMsg = getErrorMessage(error as CaughtError)
        dispatch(updateToast(true, 'error', errMsg))
        callbacksRef.current?.onError?.(error instanceof Error ? error : new Error(String(error)))
        throw error
      }

      try {
        await logSsaDeletion(jti, auditPayload || { jti }, userMessage)
      } catch (auditError) {
        devLogger.error(
          'Audit logging failed:',
          auditError instanceof Error ? auditError : String(auditError),
          { jti },
        )
        dispatch(updateToast(true, 'warning', t('messages.audit_logging_failed')))
      }

      try {
        await queryClient.invalidateQueries({ queryKey: SSA_QUERY_KEYS.all })
      } catch (invalidateError) {
        devLogger.error(
          'Query invalidation failed after delete:',
          invalidateError instanceof Error ? invalidateError : String(invalidateError),
          { jti },
        )
      }

      try {
        dispatch(updateToast(true, 'success'))
        callbacksRef.current?.onSuccess?.()
      } catch (callbackError) {
        devLogger.error(
          'Post-delete callback failed:',
          callbackError instanceof Error ? callbackError : String(callbackError),
          { jti },
        )
      }
    },
    [mutation, dispatch, queryClient, t],
  )

  return {
    revokeSsa,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  }
}
