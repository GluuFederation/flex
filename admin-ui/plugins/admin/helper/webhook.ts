interface WebhookHeader {
  key?: string | null
  value?: string | null
  source?: string | null
  destination?: string | null
}

interface WebhookData {
  httpRequestBody?: unknown
  httpMethod?: string | null
  url?: string | null
  displayName?: string | null
  httpHeaders?: WebhookHeader[] | null
  jansEnabled?: boolean | null
  description?: string | null
}

export const sanitizeWebhookHeaders = (headers?: WebhookHeader[] | null) => {
  if (!headers || !Array.isArray(headers)) {
    return []
  }

  return headers.map((header) => ({
    key: header?.key ?? header?.source ?? '',
    value: header?.value ?? header?.destination ?? '',
  }))
}

export const buildWebhookInitialValues = (webhook?: WebhookData | null) => ({
  httpRequestBody: webhook?.httpRequestBody
    ? typeof webhook.httpRequestBody === 'string'
      ? webhook.httpRequestBody
      : JSON.stringify(webhook.httpRequestBody, null, 2)
    : '',
  httpMethod: webhook?.httpMethod || '',
  url: webhook?.url || '',
  displayName: webhook?.displayName || '',
  httpHeaders: sanitizeWebhookHeaders(webhook?.httpHeaders),
  jansEnabled: Boolean(webhook?.jansEnabled),
  description: webhook?.description || '',
})
