import { useCallback } from 'react'
import type { JansAttribute } from 'JansConfigApi'
import { useWebhookTrigger } from 'Plugins/admin/hooks/useWebhookTrigger'

export function useSchemaWebhook() {
  const trigger = useWebhookTrigger()

  const triggerAttributeWebhook = useCallback(
    (attribute: Partial<JansAttribute>): void => {
      trigger(attribute, 'attributes_write')
    },
    [trigger],
  )

  return { triggerAttributeWebhook }
}
