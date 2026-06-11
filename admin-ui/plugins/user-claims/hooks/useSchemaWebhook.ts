import { useCallback } from 'react'
import { useAppDispatch } from '@/redux/hooks'
import { triggerWebhook } from 'Plugins/admin/redux/features/WebhookSlice'
import { adminUiFeatures } from '@/constants'
import { logger } from '@/utils/logger'
import type { JansAttribute } from 'JansConfigApi'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

export const useSchemaWebhook = () => {
  const dispatch = useAppDispatch()

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
        logger(
          'Failed to trigger attribute webhook:',
          error instanceof Error ? error : String(error),
        )
      }
    },
    [dispatch],
  )

  return { triggerAttributeWebhook }
}
