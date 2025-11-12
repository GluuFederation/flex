import { useCallback } from 'react'
import { useWebhookTrigger } from 'Plugins/admin/hooks/useWebhookTrigger'

export function useScopeWebhook() {
  const trigger = useWebhookTrigger<Record<string, unknown>>({
    extractId: (scope) => scope.inum as string | undefined,
    idFieldName: 'scope.inum',
  })

  const triggerScopeWebhook = useCallback(
    (scope: Record<string, unknown>, featureId: 'scopes_write' | 'scopes_delete'): void => {
      trigger(scope, featureId)
    },
    [trigger],
  )

  return { triggerScopeWebhook }
}
