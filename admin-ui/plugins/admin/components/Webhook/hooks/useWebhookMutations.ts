import { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '@/redux/hooks'
import { useQueryClient } from '@tanstack/react-query'
import {
  usePostWebhook,
  usePutWebhook,
  useDeleteWebhookByInum,
  getGetAllWebhooksQueryKey,
  getGetFeaturesByWebhookIdQueryKey,
} from 'JansConfigApi'
import queryUtils from '@/utils/queryUtils'
import { devLogger } from '@/utils/devLogger'
import { updateToast } from 'Redux/features/toastSlice'
import { useWebhookAudit } from './useWebhookAudit'
import { CREATE, UPDATE, DELETION } from '@/audit'
import type {
  MutationCallbacks,
  WebhookApiError,
  WebhookEntry,
  WebhookMutationError,
} from '../types'

const extractWebhookErrorMessage = (error: WebhookMutationError, fallback: string): string =>
  (error as WebhookApiError)?.response?.data?.responseMessage ||
  (error as Error)?.message ||
  fallback

const invalidateWebhooksByFeatureQueries = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({
    predicate: (query) => String(query.queryKey?.[0] ?? '').includes('/admin-ui/webhook/'),
  })
}

export const useCreateWebhookWithAudit = (callbacks?: MutationCallbacks) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { logAction } = useWebhookAudit()
  const mutation = usePostWebhook()
  const callbacksRef = useRef(callbacks)
  callbacksRef.current = callbacks

  const createWebhook = useCallback(
    async (data: WebhookEntry, userMessage?: string) => {
      try {
        const result = await mutation.mutateAsync({ data })
        logAction(CREATE, 'webhook', {
          action_message: userMessage,
          action_data: data,
        }).catch((auditError) => {
          devLogger.error('Audit logging failed:', auditError)
        })
        dispatch(updateToast(true, 'success', t('messages.webhook_created_successfully')))
        queryUtils.invalidateQueriesByKey(queryClient, getGetAllWebhooksQueryKey())
        invalidateWebhooksByFeatureQueries(queryClient)
        callbacksRef.current?.onSuccess?.()
        return result
      } catch (error) {
        const err = error as WebhookMutationError
        dispatch(
          updateToast(
            true,
            'error',
            extractWebhookErrorMessage(err, t('messages.failed_to_create_webhook')),
          ),
        )
        callbacksRef.current?.onError?.(err instanceof Error ? err : new Error(String(err)))
        throw error
      }
    },
    [mutation, logAction, dispatch, queryClient, t],
  )

  return {
    createWebhook,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  }
}

export const useUpdateWebhookWithAudit = (callbacks?: MutationCallbacks) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { logAction } = useWebhookAudit()
  const mutation = usePutWebhook()
  const callbacksRef = useRef(callbacks)
  callbacksRef.current = callbacks

  const updateWebhook = useCallback(
    async (data: WebhookEntry, userMessage?: string) => {
      try {
        const result = await mutation.mutateAsync({ data })
        logAction(UPDATE, 'webhook', {
          action_message: userMessage,
          action_data: data,
        }).catch((auditError) => {
          devLogger.error('Audit logging failed:', auditError)
        })
        dispatch(updateToast(true, 'success', t('messages.webhook_updated_successfully')))
        queryUtils.invalidateQueriesByKey(queryClient, getGetAllWebhooksQueryKey())
        invalidateWebhooksByFeatureQueries(queryClient)
        if (data.inum) {
          queryUtils.invalidateQueriesByKey(
            queryClient,
            getGetFeaturesByWebhookIdQueryKey(data.inum),
          )
        }
        callbacksRef.current?.onSuccess?.()
        return result
      } catch (error) {
        const err = error as WebhookMutationError
        dispatch(
          updateToast(
            true,
            'error',
            extractWebhookErrorMessage(err, t('messages.failed_to_update_webhook')),
          ),
        )
        callbacksRef.current?.onError?.(err instanceof Error ? err : new Error(String(err)))
        throw error
      }
    },
    [mutation, logAction, dispatch, queryClient, t],
  )

  return {
    updateWebhook,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  }
}

export const useDeleteWebhookWithAudit = (callbacks?: MutationCallbacks) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { logAction } = useWebhookAudit()
  const mutation = useDeleteWebhookByInum()
  const callbacksRef = useRef(callbacks)
  callbacksRef.current = callbacks

  const deleteWebhook = useCallback(
    async (inum: string, userMessage?: string) => {
      try {
        const result = await mutation.mutateAsync({ webhookId: inum })
        logAction(DELETION, 'webhook', {
          action_message: userMessage,
          action_data: { inum },
        }).catch((auditError) => {
          devLogger.error('Audit logging failed:', auditError)
        })
        dispatch(updateToast(true, 'success', t('messages.webhook_deleted_successfully')))
        queryUtils.invalidateQueriesByKey(queryClient, getGetAllWebhooksQueryKey())
        invalidateWebhooksByFeatureQueries(queryClient)
        callbacksRef.current?.onSuccess?.()
        return result
      } catch (error) {
        const err = error as WebhookMutationError
        dispatch(
          updateToast(
            true,
            'error',
            extractWebhookErrorMessage(err, t('messages.failed_to_delete_webhook')),
          ),
        )
        callbacksRef.current?.onError?.(err instanceof Error ? err : new Error(String(err)))
        throw error
      }
    },
    [mutation, logAction, dispatch, queryClient, t],
  )

  return {
    deleteWebhook,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  }
}
