import cloneDeep from 'lodash/cloneDeep'
import type { WebhookEntry, ShortCodeRequest } from 'JansConfigApi'

const getNestedValue = (obj: Record<string, any>, path: string): any => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj)
}

/**
 * Processes enabled webhooks and creates ShortCodeRequest array for triggering
 * @param enabledFeatureWebhooks Array of enabled webhook configurations
 * @param createdFeatureValue The entity data (user, script, etc.) that triggered the webhook
 * @returns Array of ShortCodeRequest objects ready to send to the API
 */
export const webhookOutputObject = (
  enabledFeatureWebhooks: WebhookEntry[],
  createdFeatureValue: Record<string, any>,
): ShortCodeRequest[] => {
  return enabledFeatureWebhooks.map((originalWebhook) => {
    const webhook = cloneDeep(originalWebhook)
    const url = webhook.url || ''
    const shortcodeValueMap: Record<string, any> = {}

    url.match(/\{([^{}]+?)\}/g)?.forEach((placeholder) => {
      const key = placeholder.slice(1, -1)
      const value = key?.includes('.')
        ? getNestedValue(createdFeatureValue, key)
        : createdFeatureValue[key]

      if (value !== undefined) {
        shortcodeValueMap[key] = value
        webhook.url = webhook.url?.replaceAll(`{${key}}`, String(value))
      }
    })

    if (webhook.httpRequestBody && typeof webhook.httpRequestBody === 'object') {
      const requestBody = webhook.httpRequestBody as Record<string, any>
      Object.entries(requestBody).forEach(([key, templateValue]) => {
        if (typeof templateValue === 'string' && templateValue.includes('{')) {
          const matches = templateValue.match(/\{([^{}]+?)\}/g)
          matches?.forEach((placeholder: string) => {
            const placeholderKey = placeholder.slice(1, -1)
            const value = placeholderKey.includes('.')
              ? getNestedValue(createdFeatureValue, placeholderKey)
              : createdFeatureValue[placeholderKey]
            if (value !== undefined && webhook.httpRequestBody) {
              const updatedRequestBody = webhook.httpRequestBody as Record<string, any>
              updatedRequestBody[key] = templateValue.replaceAll(
                `{${placeholderKey}}`,
                String(value),
              )
              shortcodeValueMap[placeholderKey] = value
            }
          })
        }
      })
    }

    return {
      webhookId: webhook.inum || '',
      shortcodeValueMap,
    }
  })
}
