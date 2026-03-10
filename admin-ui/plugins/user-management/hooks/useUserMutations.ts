import { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { useDeleteUser, getGetUserQueryKey } from 'JansConfigApi'
import queryUtils from '@/utils/queryUtils'
import { useAppDispatch } from '@/redux/hooks'
import { updateToast } from 'Redux/features/toastSlice'
import type { CaughtError } from '../types/ErrorTypes'
import { logUserDeletion, getErrorMessage } from '../helper/userAuditHelpers'
import { triggerUserWebhook } from '../helper/userWebhookHelpers'
import type { CustomUser } from '../types'

export interface MutationCallbacks {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export const useDeleteUserWithAudit = (callbacks?: MutationCallbacks) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const mutation = useDeleteUser()
  const callbacksRef = useRef(callbacks)
  callbacksRef.current = callbacks

  const deleteUser = useCallback(
    async (inum: string, userMessage?: string, userData?: CustomUser) => {
      try {
        await mutation.mutateAsync({ inum })
      } catch (error) {
        const errMsg = getErrorMessage(error as CaughtError)
        dispatch(updateToast(true, 'error', errMsg))
        callbacksRef.current?.onError?.(error instanceof Error ? error : new Error(String(error)))
        throw error
      }

      try {
        await logUserDeletion(inum, userData)
      } catch (auditError) {
        console.error('Audit logging failed:', auditError, { inum })
        dispatch(updateToast(true, 'warning', t('messages.audit_logging_failed')))
      }

      if (userData) {
        try {
          triggerUserWebhook(userData)
        } catch (webhookError) {
          console.error('Webhook trigger failed:', webhookError, { inum })
          dispatch(updateToast(true, 'warning', t('messages.audit_logging_failed')))
        }
      }

      try {
        await queryUtils.invalidateQueriesByKey(queryClient, getGetUserQueryKey())
      } catch (invalidateError) {
        console.error('Query invalidation failed after delete:', invalidateError, { inum })
        dispatch(updateToast(true, 'warning', t('messages.audit_logging_failed')))
      }

      try {
        dispatch(updateToast(true, 'success', t('messages.user_deleted_successfully')))
        callbacksRef.current?.onSuccess?.()
      } catch (callbackError) {
        console.error('Post-delete callback failed:', callbackError, { inum })
        dispatch(updateToast(true, 'warning', t('messages.audit_logging_failed')))
      }
    },
    [mutation, dispatch, queryClient, t],
  )

  return {
    deleteUser,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  }
}
