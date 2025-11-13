import { useCallback } from 'react'
import { useTriggerWebhook, getWebhooksByFeatureId } from 'JansConfigApi'
import type { WebhookEntry } from 'JansConfigApi'
import { useWebhookDialog } from '@/context/WebhookDialogContext'
import { useDispatch } from 'react-redux'
import { updateToast } from 'Redux/features/toastSlice'
import { useTranslation } from 'react-i18next'
import type { WebhookTriggerResponse } from '../constants/webhookTypes'
import type { ApiError } from '../redux/sagas/types/webhook'
import { webhookOutputObject } from '../helper/webhookUtils'

export function useWebhookTrigger() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { actions } = useWebhookDialog()

  const triggerWebhookMutation = useTriggerWebhook({
    mutation: {
      onSuccess: (data: any) => {
        // Cast to WebhookTriggerResponse since the OpenAPI spec doesn't match the actual response
        const response = data as WebhookTriggerResponse
        const { body = [] } = response
        const allSucceeded = body.every(({ success }) => success)
        if (allSucceeded) {
          actions.setWebhookTriggerErrors([])
          actions.setShowErrorModal(false)
          actions.setWebhookModal(false)
          actions.setTriggerWebhookResponse('')
          dispatch(updateToast(true, 'success', t('messages.webhook_trigger_success')))
        } else {
          const errors = body.filter(({ success }) => !success)
          actions.setWebhookTriggerErrors(errors)
          actions.setTriggerWebhookResponse(t('messages.webhook_trigger_error'))
          dispatch(updateToast(true, 'error', t('messages.webhook_trigger_error')))
          actions.setShowErrorModal(true)
        }
      },
      onError: (error: ApiError) => {
        actions.setTriggerWebhookResponse(t('messages.webhook_trigger_failed'))
        dispatch(
          updateToast(
            true,
            'error',
            error.response?.body?.responseMessage ||
              error.message ||
              t('messages.webhook_trigger_failed'),
          ),
        )
        actions.setShowErrorModal(true)
      },
    },
  })

  const trigger = useCallback(
    async (item: Record<string, any>, featureId: string): Promise<void> => {
      try {
        actions.setTriggerWebhookInProgress(true)
        actions.setFeatureToTrigger(featureId)

        const webhooksResponse = await getWebhooksByFeatureId(featureId)
        // The API response structure is { data: { body: WebhookEntry[] } }
        // Cast to any because the OpenAPI spec doesn't match the actual response
        const responseData = (webhooksResponse as any)?.data
        const featureWebhooks: WebhookEntry[] = Array.isArray(responseData?.body)
          ? responseData.body
          : []

        const enabledFeatureWebhooks = featureWebhooks.filter(
          (webhook) => webhook.jansEnabled === true,
        )

        if (!enabledFeatureWebhooks.length) {
          console.warn(`No enabled webhooks found for feature: ${featureId}`)
          actions.setTriggerWebhookInProgress(false)
          actions.setFeatureToTrigger('')
          return
        }

        const shortCodeRequests = webhookOutputObject(enabledFeatureWebhooks, item)

        const requestData = {
          shortCodeRequest: shortCodeRequests,
        } as any

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
      } catch (error) {
        console.error('Error fetching webhooks:', error)
        actions.setTriggerWebhookInProgress(false)
        actions.setFeatureToTrigger('')
        dispatch(updateToast(true, 'error', t('messages.webhook_fetch_failed')))
      }
    },
    [dispatch, t, actions, triggerWebhookMutation],
  )

  return trigger
}
