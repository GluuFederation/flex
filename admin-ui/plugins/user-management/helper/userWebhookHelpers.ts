import store from 'Redux/store'

interface WebhookAction {
  type: 'webhook/triggerWebhook'
  payload: {
    createdFeatureValue: Record<string, unknown>
  }
}

interface StoreWithDispatch {
  dispatch: (action: WebhookAction) => void
}

export function triggerUserWebhook(data: Record<string, unknown>): void {
  try {
    const dispatch = (store as StoreWithDispatch).dispatch
    dispatch({
      type: 'webhook/triggerWebhook',
      payload: {
        createdFeatureValue: data,
      },
    })
  } catch (error) {
    console.error('Failed to trigger webhook:', error)
  }
}
