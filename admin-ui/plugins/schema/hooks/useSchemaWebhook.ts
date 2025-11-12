import { useCallback } from 'react'
import type { JansAttribute } from 'JansConfigApi'
import { useWebhookTrigger } from 'Plugins/admin/hooks/useWebhookTrigger'

/**
 * Hook for triggering webhooks related to schema/attribute operations
 */
export function useSchemaWebhook() {
  const trigger = useWebhookTrigger<Partial<JansAttribute>>({
    extractId: (attribute) => attribute.inum,
    idFieldName: 'attribute.inum',
  })

  const triggerAttributeWebhook = useCallback(
    (attribute: Partial<JansAttribute>): void => {
      trigger(attribute, 'attributes_write')
    },
    [trigger],
  )

  return { triggerAttributeWebhook }
}
