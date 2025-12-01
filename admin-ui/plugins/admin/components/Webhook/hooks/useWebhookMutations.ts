import { useCallback } from 'react'
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

export const useCreateWebhookWithAudit = (callbacks?: MutationCallbacks) => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { logAction } = useWebhookAudit()
  const mutation = usePostWebhook()

  const createWebhook = useCallback(
    async (data: WebhookEntry, userMessage?: string) => {
      try {
        const result = await mutation.mutateAsync({ data })
        await logAction(CREATE, 'webhook', {
          action_message: userMessage,
          action_data: data,
        })
        dispatch(updateToast(true, 'success', 'Webhook created successfully'))
        queryClient.invalidateQueries({ queryKey: getGetAllWebhooksQueryKey() })
        callbacks?.onSuccess?.()
        return result
      } catch (error: unknown) {
        const errorMessage =
          (error as { response?: { data?: { responseMessage?: string } } })?.response?.data
            ?.responseMessage ||
          (error as Error)?.message ||
          'Failed to create webhook'
        dispatch(updateToast(true, 'error', errorMessage))
        callbacks?.onError?.(error)
        throw error
      }
    },
    [mutation, logAction, dispatch, queryClient, callbacks],
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

  const updateWebhook = useCallback(
    async (data: WebhookEntry, userMessage?: string) => {
      try {
        const result = await mutation.mutateAsync({ data })
        await logAction(UPDATE, 'webhook', {
          action_message: userMessage,
          action_data: data,
        })
        dispatch(updateToast(true, 'success', 'Webhook updated successfully'))
        queryClient.invalidateQueries({ queryKey: getGetAllWebhooksQueryKey() })
        callbacks?.onSuccess?.()
        return result
      } catch (error: unknown) {
        const errorMessage =
          (error as { response?: { data?: { responseMessage?: string } } })?.response?.data
            ?.responseMessage ||
          (error as Error)?.message ||
          'Failed to update webhook'
        dispatch(updateToast(true, 'error', errorMessage))
        callbacks?.onError?.(error)
        throw error
      }
    },
    [mutation, logAction, dispatch, queryClient, callbacks],
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

  const deleteWebhook = useCallback(
    async (inum: string, userMessage?: string) => {
      try {
        const result = await mutation.mutateAsync({ webhookId: inum })
        await logAction(DELETION, 'webhook', {
          action_message: userMessage,
          action_data: { inum },
        })
        dispatch(updateToast(true, 'success', 'Webhook deleted successfully'))
        queryClient.invalidateQueries({ queryKey: getGetAllWebhooksQueryKey() })
        callbacks?.onSuccess?.()
        return result
      } catch (error: unknown) {
        const errorMessage =
          (error as { response?: { data?: { responseMessage?: string } } })?.response?.data
            ?.responseMessage ||
          (error as Error)?.message ||
          'Failed to delete webhook'
        dispatch(updateToast(true, 'error', errorMessage))
        callbacks?.onError?.(error)
        throw error
      }
    },
    [mutation, logAction, dispatch, queryClient, callbacks],
  )

  return {
    deleteWebhook,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  }
}
