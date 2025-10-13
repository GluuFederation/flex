/**
 * Helper functions for triggering webhooks on user management actions
 * These functions replace the saga-based webhook triggering with React Query mutation callbacks
 */

import store from 'Redux/store'

export async function triggerUserWebhook(data: any): Promise<void> {
  try {
    const dispatch = (store as any).dispatch
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
