import { useCallback } from 'react'
import type { Scope } from 'JansConfigApi'
import { useWebhookTrigger } from 'Plugins/admin/hooks/useWebhookTrigger'

export function useScopeWebhook() {
  const trigger = useWebhookTrigger<Scope>({
    extractId: (scope) => scope.inum,
    idFieldName: 'scope.inum',
  })

  const triggerScopeWebhook = useCallback(
    (scope: Scope, featureId: 'scopes_write' | 'scopes_delete'): void => {
      trigger(scope, featureId)
    },
    [trigger],
  )

  return { triggerScopeWebhook }
}
