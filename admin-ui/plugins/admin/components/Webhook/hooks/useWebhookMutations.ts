import { useCallback, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import {
  usePostWebhook,
  usePutWebhook,
  useDeleteWebhookByInum,
  getGetAllWebhooksQueryKey,
} from 'JansConfigApi'
import { updateToast } from 'Redux/features/toastSlice'
import { useWebhookAudit, CREATE, UPDATE, DELETION } from './useWebhookAudit'
import type { WebhookEntry } from '../types'

interface MutationCallbacks {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

const extractErrorMessage = (error: unknown, fallback: string): string =>
  (error as { response?: { data?: { responseMessage?: string } } })?.response?.data
    ?.responseMessage ||
  (error as Error)?.message ||
  fallback

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
        }).catch((auditError) => console.error('Audit logging failed:', auditError))
        dispatch(updateToast(true, 'success', 'Webhook created successfully'))
        queryClient.invalidateQueries({ queryKey: getGetAllWebhooksQueryKey() })
        callbacksRef.current?.onSuccess?.()
        return result
      } catch (error: unknown) {
        dispatch(updateToast(true, 'error', extractErrorMessage(error, 'Failed to create webhook')))
        callbacksRef.current?.onError?.(error)
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
        }).catch((auditError) => console.error('Audit logging failed:', auditError))
        dispatch(updateToast(true, 'success', 'Webhook updated successfully'))
        queryClient.invalidateQueries({ queryKey: getGetAllWebhooksQueryKey() })
        callbacksRef.current?.onSuccess?.()
        return result
      } catch (error: unknown) {
        dispatch(updateToast(true, 'error', extractErrorMessage(error, 'Failed to update webhook')))
        callbacksRef.current?.onError?.(error)
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
        }).catch((auditError) => console.error('Audit logging failed:', auditError))
        dispatch(updateToast(true, 'success', 'Webhook deleted successfully'))
        queryClient.invalidateQueries({ queryKey: getGetAllWebhooksQueryKey() })
        callbacksRef.current?.onSuccess?.()
        return result
      } catch (error: unknown) {
        dispatch(updateToast(true, 'error', extractErrorMessage(error, 'Failed to delete webhook')))
        callbacksRef.current?.onError?.(error)
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
