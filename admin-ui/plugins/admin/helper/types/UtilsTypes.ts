import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

export type WebhookOutputItem = {
  webhookId: string
  shortcodeValueMap: Record<string, JsonValue>
  url: string
}

export type WebhookWithBody = {
  inum?: string
  url?: string
  httpRequestBody?: Record<string, JsonValue>
}
