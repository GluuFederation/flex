import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

export type WebhookHeader = {
  key?: string | null
  value?: string | null
  source?: string | null
  destination?: string | null
}

export type WebhookData = {
  httpRequestBody?: JsonValue | object | string
  httpMethod?: string | null
  url?: string | null
  displayName?: string | null
  httpHeaders?: WebhookHeader[] | null
  jansEnabled?: boolean | null
  description?: string | null
}
