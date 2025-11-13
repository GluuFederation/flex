import { useCallback } from 'react'
import { useWebhookTrigger } from './useWebhookTrigger'
import { WEBHOOK_FEATURE_IDS } from '../constants/webhookFeatures'

export function useScriptWebhook() {
  const trigger = useWebhookTrigger()

  const triggerScriptWebhook = useCallback(
    (
      script: Record<string, unknown>,
      featureId:
        | typeof WEBHOOK_FEATURE_IDS.CUSTOM_SCRIPT_WRITE
        | typeof WEBHOOK_FEATURE_IDS.CUSTOM_SCRIPT_DELETE,
    ): void => {
      trigger(script, featureId)
    },
    [trigger],
  )

  return { triggerScriptWebhook }
}
