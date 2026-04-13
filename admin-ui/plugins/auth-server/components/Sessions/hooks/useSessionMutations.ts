import { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { useDeleteSession, useRevokeUserSession, getGetSessionsQueryKey } from 'JansConfigApi'
import queryUtils from '@/utils/queryUtils'
import { useAppDispatch } from '@/redux/hooks'
import { updateToast } from 'Redux/features/toastSlice'
import { logAuditUserAction } from 'Utils/AuditLogger'
import { DELETION } from '../../../../../app/audit/UserActionType'
import { SESSION } from '../../../redux/audit/Resources'
import type { MutationCallbacks, AuditContext } from '../types'
import { devLogger } from '@/utils/devLogger'

const invalidateSessionQueries = async (queryClient: ReturnType<typeof useQueryClient>) => {
  await Promise.all([
    queryUtils.invalidateQueriesByKey(queryClient, getGetSessionsQueryKey()),
    queryClient.invalidateQueries({
      predicate: (query) => {
        const key = query.queryKey
        return Array.isArray(key) && typeof key[0] === 'string' && key[0].includes('/session')
      },
    }),
  ])
}

export const useDeleteSessionWithAudit = (
  auditContext: AuditContext,
  callbacks?: MutationCallbacks,
) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const mutation = useDeleteSession()
  const callbacksRef = useRef(callbacks)
  callbacksRef.current = callbacks

  const deleteSession = useCallback(
    async (sessionId: string, message?: string, username?: string) => {
      try {
        await mutation.mutateAsync({ sid: sessionId })
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : t('messages.error_in_deleting')
        dispatch(updateToast(true, 'error', errMsg))
        callbacksRef.current?.onError?.(error instanceof Error ? error : new Error(String(error)))
        throw error
      }

      try {
        await logAuditUserAction({
          userinfo: auditContext.userinfo,
          action: DELETION,
          resource: SESSION,
          message: message || 'Session deleted',
          client_id: auditContext.client_id,
          payload: { sessionId, username },
        })
      } catch (auditError) {
        devLogger.error('Audit logging failed:', auditError)
        dispatch(updateToast(true, 'warning', t('messages.audit_logging_failed')))
      }

      try {
        await invalidateSessionQueries(queryClient)
      } catch (invalidateError) {
        devLogger.error('Query invalidation failed after delete:', invalidateError)
      }

      dispatch(updateToast(true, 'success', t('messages.session_deleted_successfully')))
      callbacksRef.current?.onSuccess?.()
    },
    [mutation, dispatch, queryClient, t, auditContext],
  )

  return {
    deleteSession,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  }
}

export const useRevokeSessionWithAudit = (
  auditContext: AuditContext,
  callbacks?: MutationCallbacks,
) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const mutation = useRevokeUserSession()
  const callbacksRef = useRef(callbacks)
  callbacksRef.current = callbacks

  const revokeSession = useCallback(
    async (userDn: string, message?: string, username?: string) => {
      try {
        await mutation.mutateAsync({ userDn })
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : t('messages.error_in_revoking')
        dispatch(updateToast(true, 'error', errMsg))
        callbacksRef.current?.onError?.(error instanceof Error ? error : new Error(String(error)))
        throw error
      }

      try {
        await logAuditUserAction({
          userinfo: auditContext.userinfo,
          action: DELETION,
          resource: SESSION,
          message: message || 'Session revoked',
          client_id: auditContext.client_id,
          payload: { userDn, username },
        })
      } catch (auditError) {
        devLogger.error('Audit logging failed:', auditError)
        dispatch(updateToast(true, 'warning', t('messages.audit_logging_failed')))
      }

      try {
        await invalidateSessionQueries(queryClient)
      } catch (invalidateError) {
        devLogger.error('Query invalidation failed after revoke:', invalidateError)
      }

      dispatch(updateToast(true, 'success', t('messages.session_revoked_successfully')))
      callbacksRef.current?.onSuccess?.()
    },
    [mutation, dispatch, queryClient, t, auditContext],
  )

  return {
    revokeSession,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  }
}
