import { useCallback } from 'react'
import type { CustomUser } from 'JansConfigApi'
import { WEBHOOK_FEATURE_IDS } from 'Plugins/admin/constants/webhookFeatures'
import { useWebhookTrigger } from 'Plugins/admin/hooks/useWebhookTrigger'

export function useUserWebhook() {
  const trigger = useWebhookTrigger<Partial<CustomUser>>({
    extractId: (user) => user.inum,
    idFieldName: 'user.inum',
  })

  const triggerUserWebhook = useCallback(
    (user: Partial<CustomUser>): void => {
      trigger(user, WEBHOOK_FEATURE_IDS.USERS_EDIT)
    },
    [trigger],
  )

  return { triggerUserWebhook }
}
