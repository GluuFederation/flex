import { useCallback } from 'react'
import { useWebhookTrigger } from 'Plugins/admin/hooks/useWebhookTrigger'

export function useOidcWebhook() {
  const trigger = useWebhookTrigger<Record<string, unknown>>({
    extractId: (client) => client.inum as string | undefined,
    idFieldName: 'client.inum',
  })

  const triggerOidcWebhook = useCallback(
    (
      client: Record<string, unknown>,
      featureId: 'oidc_clients_write' | 'oidc_clients_delete',
    ): void => {
      trigger(client, featureId)
    },
    [trigger],
  )

  return { triggerOidcWebhook }
}
