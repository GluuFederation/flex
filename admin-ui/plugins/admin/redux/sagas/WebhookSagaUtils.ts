/**
 * Webhook trigger saga utility
 * Standalone function for triggering webhooks from other sagas
 */

import { call, put } from 'redux-saga/effects'
import { updateToast } from 'Redux/features/toastSlice'

/**
 * Trigger webhook saga function
 * Note: This is a simplified version that doesn't depend on Redux state.
 * The full webhook trigger functionality should be implemented in components using useTriggerWebhook hook.
 * This function is kept for backward compatibility with CustomScriptSaga.
 */
export function* triggerWebhook({
  payload,
}: {
  payload: { createdFeatureValue?: unknown }
}): Generator<unknown, void, unknown> {
  // Note: The webhook trigger functionality has been migrated to use orval hooks.
  // This saga is kept for compatibility but doesn't perform the actual trigger.
  // To properly implement webhook triggers, use the useTriggerWebhook hook in React components.

  console.warn(
    'triggerWebhook saga called but webhook triggering has been migrated to use React Query hooks.',
    'Please use useTriggerWebhook hook in components for webhook trigger functionality.',
  )

  // For now, we just log this and don't fail the parent saga
  return
}
