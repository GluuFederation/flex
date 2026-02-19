import { useCallback, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import {
  usePostWebhook,
  usePutWebhook,
  useDeleteWebhookByInum,
  getGetAllWebhooksQueryKey,
} from 'JansConfigApi'
import queryUtils from '@/utils/queryUtils'
import { isDevelopment } from '@/utils/env'
import { updateToast } from 'Redux/features/toastSlice'
import { useWebhookAudit, CREATE, UPDATE, DELETION } from './useWebhookAudit'
import type { WebhookEntry, MutationCallbacks } from '../types'

interface ApiError {
  response?: { data?: { responseMessage?: string } }
}

type MutationError = Error | ApiError

const extractErrorMessage = (error: MutationError, fallback: string): string =>
  (error as ApiError)?.response?.data?.responseMessage || (error as Error)?.message || fallback

export const useCreateWebhookWithAudit = (callbacks?: MutationCallbacks) => {
  const dispatch = useDispatch()
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
          if (isDevelopment) console.error('Audit logging failed:', auditError)
        })
        dispatch(updateToast(true, 'success', 'Webhook created successfully'))
        queryUtils.invalidateQueriesByKey(queryClient, getGetAllWebhooksQueryKey())
        callbacksRef.current?.onSuccess?.()
        return result
      } catch (error) {
        const err = error as MutationError
        dispatch(updateToast(true, 'error', extractErrorMessage(err, 'Failed to create webhook')))
        callbacksRef.current?.onError?.(err instanceof Error ? err : new Error(String(err)))
        throw error
      }
    },
    [mutation, logAction, dispatch, queryClient],
  )

  return {
    createWebhook,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  }
}

export const useUpdateWebhookWithAudit = (callbacks?: MutationCallbacks) => {
  const dispatch = useDispatch()
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
          if (isDevelopment) console.error('Audit logging failed:', auditError)
        })
        dispatch(updateToast(true, 'success', 'Webhook updated successfully'))
        queryUtils.invalidateQueriesByKey(queryClient, getGetAllWebhooksQueryKey())
        callbacksRef.current?.onSuccess?.()
        return result
      } catch (error) {
        const err = error as MutationError
        dispatch(updateToast(true, 'error', extractErrorMessage(err, 'Failed to update webhook')))
        callbacksRef.current?.onError?.(err instanceof Error ? err : new Error(String(err)))
        throw error
      }
    },
    [mutation, logAction, dispatch, queryClient],
  )

  return {
    updateWebhook,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  }
}

export const useDeleteWebhookWithAudit = (callbacks?: MutationCallbacks) => {
  const dispatch = useDispatch()
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
          if (isDevelopment) console.error('Audit logging failed:', auditError)
        })
        dispatch(updateToast(true, 'success', 'Webhook deleted successfully'))
        queryUtils.invalidateQueriesByKey(queryClient, getGetAllWebhooksQueryKey())
        callbacksRef.current?.onSuccess?.()
        return result
      } catch (error) {
        const err = error as MutationError
        dispatch(updateToast(true, 'error', extractErrorMessage(err, 'Failed to delete webhook')))
        callbacksRef.current?.onError?.(err instanceof Error ? err : new Error(String(err)))
        throw error
      }
    },
    [mutation, logAction, dispatch, queryClient],
  )

  return {
    deleteWebhook,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  }
}
