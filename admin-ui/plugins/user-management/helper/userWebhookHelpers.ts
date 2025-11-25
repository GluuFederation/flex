import store from 'Redux/store'
import type { CustomUser } from '../types/UserApiTypes'

interface WebhookAction {
  type: 'webhook/triggerWebhook'
  payload: {
    createdFeatureValue: CustomUser | Record<string, string | number | boolean | null | undefined>
  }
}

interface StoreWithDispatch {
  dispatch: (action: WebhookAction) => void
}

export function triggerUserWebhook(data: CustomUser): void {
  try {
    const dispatch = (store as StoreWithDispatch).dispatch
    dispatch({
      type: 'webhook/triggerWebhook',
      payload: {
        createdFeatureValue: data as CustomUser &
          Record<string, string | number | boolean | null | undefined>,
      },
    })
  } catch (error) {
    console.error('Failed to trigger webhook:', error)
  }
}
