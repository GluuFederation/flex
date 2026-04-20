import { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { useDeleteUser, getGetUserQueryKey } from 'JansConfigApi'
import queryUtils from '@/utils/queryUtils'
import { useAppDispatch } from '@/redux/hooks'
import { updateToast } from 'Redux/features/toastSlice'
import type { CaughtError } from '../types'
import { logUserDeletion, getErrorMessage, triggerUserWebhook } from '../helper'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import type { CustomUser } from '../types'
import { devLogger } from '@/utils/devLogger'

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
    async (inum: string, _userMessage?: string, userData?: CustomUser) => {
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
        devLogger.error('Audit logging failed:', auditError, { inum })
        dispatch(updateToast(true, 'warning', t('messages.audit_logging_failed')))
      }

      if (userData) {
        try {
          triggerUserWebhook(userData, adminUiFeatures.users_delete)
        } catch (webhookError) {
          devLogger.error('Webhook trigger failed:', webhookError, { inum })
          dispatch(updateToast(true, 'warning', t('messages.webhook_trigger_failed')))
        }
      }

      try {
        await queryUtils.invalidateQueriesByKey(queryClient, getGetUserQueryKey())
      } catch (invalidateError) {
        devLogger.error('Query invalidation failed after delete:', invalidateError, { inum })
        dispatch(updateToast(true, 'warning', t('messages.query_invalidation_failed')))
      }

      try {
        dispatch(updateToast(true, 'success', t('messages.user_deleted_successfully')))
        callbacksRef.current?.onSuccess?.()
      } catch (callbackError) {
        devLogger.error('Post-delete callback failed:', callbackError, { inum })
        dispatch(updateToast(true, 'warning', t('messages.post_delete_callback_failed')))
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
