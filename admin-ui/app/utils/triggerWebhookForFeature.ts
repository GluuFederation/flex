import store from 'Redux/store'
import type { AppDispatch } from '@/redux/hooks'
import { devLogger } from '@/utils/devLogger'
import { triggerWebhook } from 'Plugins/admin/redux/features/WebhookSlice'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

export const triggerWebhookForFeature = (
  data: Record<string, JsonValue>,
  feature: string,
): void => {
  try {
    const dispatch: AppDispatch = store.dispatch
    dispatch(
      triggerWebhook({
        createdFeatureValue: data,
        feature,
      }),
    )
  } catch (error) {
    devLogger.error(
      `Failed to trigger webhook for feature "${feature}":`,
      error instanceof Error ? error : String(error),
    )
  }
}
