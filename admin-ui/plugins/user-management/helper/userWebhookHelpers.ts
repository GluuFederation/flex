import store from 'Redux/store'
import type { AppDispatch } from '@/redux/hooks'
import { devLogger } from '@/utils/devLogger'
import { triggerWebhook } from 'Plugins/admin/redux/features/WebhookSlice'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type { CustomUser } from '../types/UserApiTypes'

export const triggerUserWebhook = (data: CustomUser): void => {
  try {
    const dispatch: AppDispatch = store.dispatch
    dispatch(
      triggerWebhook({
        createdFeatureValue: data as Record<string, JsonValue>,
        feature: adminUiFeatures.users_edit,
      }),
    )
  } catch (error) {
    devLogger.error('Failed to trigger webhook:', error)
  }
}
