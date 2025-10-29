/**
 * Helper functions for triggering webhooks on user management actions
 * These functions replace the saga-based webhook triggering with React Query mutation callbacks
 */

import store from 'Redux/store'

export async function triggerUserWebhook(data: Record<string, unknown>): Promise<void> {
  try {
    const dispatch = (
      store as {
        dispatch: (action: {
          type: string
          payload: { createdFeatureValue: Record<string, unknown> }
        }) => void
      }
    ).dispatch
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
