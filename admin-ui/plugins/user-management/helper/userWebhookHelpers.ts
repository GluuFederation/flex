/**
 * Helper functions for triggering webhooks on user management actions
 * These functions replace the saga-based webhook triggering with React Query mutation callbacks
 */

import store from 'Redux/store'

/**
 * Trigger webhook for user creation/update/deletion
 * This is a simplified version that dispatches the webhook action
 */
export async function triggerUserWebhook(data: any): Promise<void> {
  try {
    // Get the Redux dispatch function
    const dispatch = (store as any).dispatch

    // Dispatch the trigger webhook action with the created feature value
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
