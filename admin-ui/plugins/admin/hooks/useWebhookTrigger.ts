import { useCallback } from 'react'
import { useTriggerWebhook } from 'JansConfigApi'
import type { ShortCodeRequest } from 'JansConfigApi'
import { useWebhookDialog } from '@/context/WebhookDialogContext'
import { useDispatch } from 'react-redux'
import { updateToast } from 'Redux/features/toastSlice'
import { useTranslation } from 'react-i18next'
import type { WebhookTriggerResponse } from '../constants/webhookTypes'
import { WEBHOOK_FEATURE_IDS } from '../constants/webhookFeatures'

interface WebhookTriggerConfig<T> {
  extractId: (item: T) => string | undefined
  idFieldName: string
}

export function useWebhookTrigger<T extends Record<string, unknown>>(
  config: WebhookTriggerConfig<T>,
) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { actions } = useWebhookDialog()

  const triggerWebhookMutation = useTriggerWebhook({
    mutation: {
      onSuccess: (data: WebhookTriggerResponse) => {
        const { body = [] } = data
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
      onError: (error: Error) => {
        actions.setTriggerWebhookResponse(t('messages.webhook_trigger_failed'))
        dispatch(
          updateToast(
            true,
            'error',
            (error as Error & { response?: { body?: { responseMessage?: string } } })?.response
              ?.body?.responseMessage ||
              error.message ||
              t('messages.webhook_trigger_failed'),
          ),
        )
        actions.setShowErrorModal(true)
      },
    },
  })

  const trigger = useCallback(
    (item: T, featureId: string): void => {
      const webhookId = config.extractId(item)
      if (!webhookId) {
        console.error(`Cannot trigger webhook: ${config.idFieldName} is missing`)
        dispatch(updateToast(true, 'error', t('messages.webhook_trigger_invalid_data')))
        return
      }

      const isDelete =
        featureId === WEBHOOK_FEATURE_IDS.OIDC_CLIENTS_DELETE ||
        featureId === WEBHOOK_FEATURE_IDS.SCOPES_DELETE ||
        featureId === WEBHOOK_FEATURE_IDS.CUSTOM_SCRIPT_DELETE ||
        featureId.endsWith('_delete')

      const valueKey = isDelete ? 'deletedFeatureValue' : 'createdFeatureValue'

      const requestData: ShortCodeRequest = {
        webhookId,
        shortcodeValueMap: {
          [valueKey]: item as Record<string, unknown>,
        },
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
    [config, dispatch, t, actions, triggerWebhookMutation],
  )

  return trigger
}
