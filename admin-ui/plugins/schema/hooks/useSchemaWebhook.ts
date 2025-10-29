import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { triggerWebhook } from 'Plugins/admin/redux/features/WebhookSlice'
import type { JansAttribute } from 'JansConfigApi'

export function useSchemaWebhook() {
  const dispatch = useDispatch()

  const triggerAttributeWebhook = useCallback(
    (attribute: Partial<JansAttribute>): void => {
      dispatch(
        triggerWebhook({
          createdFeatureValue: attribute,
        }),
      )
    },
    [dispatch],
  )

  return { triggerAttributeWebhook }
}
