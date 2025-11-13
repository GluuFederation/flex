import { useCallback } from 'react'
import type { Client } from 'JansConfigApi'
import { useWebhookTrigger } from 'Plugins/admin/hooks/useWebhookTrigger'

export function useOidcWebhook() {
  const trigger = useWebhookTrigger()

  const triggerOidcWebhook = useCallback(
    (client: Client, featureId: 'oidc_clients_write' | 'oidc_clients_delete'): void => {
      trigger(client, featureId)
    },
    [trigger],
  )

  return { triggerOidcWebhook }
}
