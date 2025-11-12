import { useCallback } from 'react'
import { useWebhookTrigger } from './useWebhookTrigger'

export function useScriptWebhook() {
  const trigger = useWebhookTrigger<Record<string, unknown>>({
    extractId: (script) => script.inum as string | undefined,
    idFieldName: 'script.inum',
  })

  const triggerScriptWebhook = useCallback(
    (
      script: Record<string, unknown>,
      featureId: 'custom_script_write' | 'custom_script_delete',
    ): void => {
      trigger(script, featureId)
    },
    [trigger],
  )

  return { triggerScriptWebhook }
}
