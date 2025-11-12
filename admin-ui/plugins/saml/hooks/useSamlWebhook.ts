import { useCallback } from 'react'
import { useWebhookTrigger } from 'Plugins/admin/hooks/useWebhookTrigger'
import { WEBHOOK_FEATURE_IDS } from 'Plugins/admin/constants/webhookFeatures'

export function useSamlWebhook() {
  const trigger = useWebhookTrigger<Record<string, unknown>>({
    extractId: (entity) => (entity.inum as string | undefined) || (entity.dn as string | undefined),
    idFieldName: 'entity.inum or entity.dn',
  })

  const triggerSamlWebhook = useCallback(
    (
      entity: Record<string, unknown>,
      featureId:
        | typeof WEBHOOK_FEATURE_IDS.SAML_CONFIGURATION_WRITE
        | typeof WEBHOOK_FEATURE_IDS.SAML_IDP_WRITE,
    ): void => {
      trigger(entity, featureId)
    },
    [trigger],
  )

  return { triggerSamlWebhook }
}
