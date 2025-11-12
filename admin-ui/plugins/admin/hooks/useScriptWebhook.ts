import { useCallback } from 'react'
import { useTriggerWebhook } from 'JansConfigApi'
import type { ShortCodeRequest } from 'JansConfigApi'
import { useWebhookDialog } from '@/context/WebhookDialogContext'
import { useDispatch } from 'react-redux'
import { updateToast } from 'Redux/features/toastSlice'
import type { WebhookTriggerResponse } from 'Plugins/admin/constants/webhookTypes'
import { useTranslation } from 'react-i18next'

export function useScriptWebhook() {
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

  const triggerScriptWebhook = useCallback(
    (
      script: Record<string, unknown>,
      featureId: 'custom_script_write' | 'custom_script_delete',
    ): void => {
      const scriptInum = script.inum as string | undefined
      if (!scriptInum) {
        console.error('Cannot trigger webhook: script.inum is missing')
        dispatch(updateToast(true, 'error', t('messages.webhook_trigger_invalid_data')))
        return
      }

      const requestData: ShortCodeRequest = {
        webhookId: scriptInum,
        shortcodeValueMap: script as Record<string, { [key: string]: unknown }>,
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

  return { triggerScriptWebhook }
}
