import { useCallback } from 'react'
import type { Scope } from 'JansConfigApi'
import { useWebhookTrigger } from 'Plugins/admin/hooks/useWebhookTrigger'
import { WEBHOOK_FEATURE_IDS } from 'Plugins/admin/constants/webhookFeatures'

export function useScopeWebhook() {
  const trigger = useWebhookTrigger<Scope>({
    extractId: (scope) => scope.inum,
    idFieldName: 'scope.inum',
  })

  const triggerScopeWebhook = useCallback(
    (
      scope: Scope,
      featureId: typeof WEBHOOK_FEATURE_IDS.SCOPES_WRITE | typeof WEBHOOK_FEATURE_IDS.SCOPES_DELETE,
    ): void => {
      trigger(scope, featureId)
    },
    [trigger],
  )

  return { triggerScopeWebhook }
}
