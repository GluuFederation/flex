import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { triggerWebhook } from 'Plugins/admin/redux/features/WebhookSlice'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { devLogger } from '@/utils/devLogger'
import type { JansAttribute } from 'JansConfigApi'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

export function useSchemaWebhook() {
  const dispatch = useDispatch()

  const triggerAttributeWebhook = useCallback(
    (
      attribute: Partial<JansAttribute>,
      feature: string = adminUiFeatures.attributes_write,
    ): void => {
      try {
        dispatch(
          triggerWebhook({
            createdFeatureValue: attribute as Record<string, JsonValue>,
            feature,
          }),
        )
      } catch (error) {
        devLogger.error('Failed to trigger attribute webhook:', error)
      }
    },
    [dispatch],
  )

  return { triggerAttributeWebhook }
}
