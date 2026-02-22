import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type { PagedResultEntriesItem, WebhookEntry } from 'JansConfigApi'

const HTTP_METHODS_WITH_BODY = new Set(['POST', 'PUT', 'PATCH'])

const fromEntry = <K extends keyof WebhookEntry>(
  entry: PagedResultEntriesItem,
  key: K,
  fallback: WebhookEntry[K],
): WebhookEntry[K] => {
  const v = entry[key]
  return (v !== undefined && v !== null ? v : fallback) as WebhookEntry[K]
}

export const toWebhookEntries = (entries: PagedResultEntriesItem[] | undefined): WebhookEntry[] =>
  (entries ?? []).map(
    (entry): WebhookEntry => ({
      dn: fromEntry(entry, 'dn', undefined),
      inum: fromEntry(entry, 'inum', undefined),
      displayName: fromEntry(entry, 'displayName', ''),
      description: fromEntry(entry, 'description', undefined),
      url: fromEntry(entry, 'url', ''),
      httpRequestBodyString: fromEntry(entry, 'httpRequestBodyString', undefined),
      httpMethod: fromEntry(entry, 'httpMethod', undefined),
      jansEnabled: fromEntry(entry, 'jansEnabled', undefined),
      httpHeaders: fromEntry(entry, 'httpHeaders', undefined),
      auiFeatureIds: fromEntry(entry, 'auiFeatureIds', undefined),
      httpRequestBody: fromEntry(entry, 'httpRequestBody', undefined),
      baseDn: fromEntry(entry, 'baseDn', undefined),
    }),
  )

export const HTTP_METHODS = [
  { value: 'GET', label: 'GET' },
  { value: 'POST', label: 'POST' },
  { value: 'PUT', label: 'PUT' },
  { value: 'PATCH', label: 'PATCH' },
  { value: 'DELETE', label: 'DELETE' },
]

export const hasHttpBody = (method: string): boolean => HTTP_METHODS_WITH_BODY.has(method)

export const isLastHeaderComplete = (
  headers: Array<{ key?: string | null; value?: string | null }>,
): boolean => {
  if (headers.length === 0) return true
  const last = headers[headers.length - 1]
  return Boolean((last.key ?? '').trim() && (last.value ?? '').trim())
}

interface WebhookHeader {
  key?: string | null
  value?: string | null
  source?: string | null
  destination?: string | null
}

interface WebhookData {
  httpRequestBody?: JsonValue | object | string
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
