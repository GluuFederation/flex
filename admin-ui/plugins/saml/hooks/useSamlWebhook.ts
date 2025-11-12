import { useCallback } from 'react'
import { useWebhookTrigger } from 'Plugins/admin/hooks/useWebhookTrigger'

export function useSamlWebhook() {
  const trigger = useWebhookTrigger<Record<string, unknown>>({
    extractId: (entity) => (entity.inum as string | undefined) || (entity.dn as string | undefined),
    idFieldName: 'entity.inum or entity.dn',
  })

  const triggerSamlWebhook = useCallback(
    (
      entity: Record<string, unknown>,
      featureId: 'saml_configuration_write' | 'saml_idp_write',
    ): void => {
      trigger(entity, featureId)
    },
    [trigger],
  )

  return { triggerSamlWebhook }
}
