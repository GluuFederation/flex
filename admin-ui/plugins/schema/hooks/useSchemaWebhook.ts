import { useCallback } from 'react'
import { useTriggerWebhook } from 'JansConfigApi'
import type { JansAttribute, ShortCodeRequest } from 'JansConfigApi'
import { useWebhookDialog } from '@/context/WebhookDialogContext'
import { useDispatch } from 'react-redux'
import { updateToast } from 'Redux/features/toastSlice'

/**
 * Hook for triggering webhooks related to schema/attribute operations
 */
export function useSchemaWebhook() {
  const dispatch = useDispatch()
  const { actions } = useWebhookDialog()

  const triggerWebhookMutation = useTriggerWebhook({
    mutation: {
      onSuccess: (data: unknown) => {
        const response = data as {
          body?: Array<{ success: boolean; responseMessage: string; responseObject: unknown }>
        }
        const allSucceeded = response?.body?.every((item: { success: boolean }) => item.success)
        if (allSucceeded) {
          actions.setShowErrorModal(false)
          actions.setWebhookModal(false)
          actions.setTriggerWebhookResponse('')
          dispatch(updateToast(true, 'success', 'All webhooks triggered successfully.'))
        } else {
          const errors = response?.body?.filter((item: { success: boolean }) => !item.success) || []
          actions.setWebhookTriggerErrors(errors as never[])
          actions.setTriggerWebhookResponse('Something went wrong while triggering webhook.')
          dispatch(updateToast(true, 'error', 'Something went wrong while triggering webhook.'))
          actions.setShowErrorModal(true)
        }
      },
      onError: (error: Error) => {
        actions.setTriggerWebhookResponse('Failed to trigger webhook.')
        dispatch(
          updateToast(
            true,
            'error',
            (error as Error & { response?: { body?: { responseMessage?: string } } })?.response
              ?.body?.responseMessage ||
              error.message ||
              'Failed to trigger webhook',
          ),
        )
        actions.setShowErrorModal(true)
      },
    },
  })

  const triggerAttributeWebhook = useCallback(
    (attribute: Partial<JansAttribute>): void => {
      const featureId = 'attributes_write' // Feature ID for attribute operations
      const requestData: ShortCodeRequest = {
        webhookId: attribute.inum || '',
        shortcodeValueMap: attribute as Record<string, { [key: string]: unknown }>,
      }

      actions.setTriggerWebhookInProgress(true)
      actions.setFeatureToTrigger(featureId)

      triggerWebhookMutation.mutate(
        {
          featureId,
          data: requestData,
        },
        {
          onSettled: () => {
            actions.setTriggerWebhookInProgress(false)
            actions.setFeatureToTrigger('')
          },
        },
      )
    },
    [triggerWebhookMutation, actions],
  )

  return { triggerAttributeWebhook }
}
