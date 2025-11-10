export function triggerWebhook({ payload }: { payload: { createdFeatureValue?: unknown } }): void {
  console.warn(
    'triggerWebhook saga called but webhook triggering has been migrated to use React Query hooks.',
    'Please use useTriggerWebhook hook in components for webhook trigger functionality.',
  )
}
