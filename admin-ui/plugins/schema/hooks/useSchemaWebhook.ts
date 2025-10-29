import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { triggerWebhook } from 'Plugins/admin/redux/features/WebhookSlice'
import type { JansAttribute } from 'JansConfigApi'

/**
 * Custom hook for triggering webhooks in Schema plugin
 * Handles the type casting and dispatch logic
 */
export function useSchemaWebhook() {
  const dispatch = useDispatch()

  const triggerAttributeWebhook = useCallback(
    (attribute: JansAttribute): void => {
      dispatch(
        triggerWebhook({
          createdFeatureValue: attribute,
        } as unknown as Parameters<typeof triggerWebhook>[0]),
      )
    },
    [dispatch],
  )

  return { triggerAttributeWebhook }
}
