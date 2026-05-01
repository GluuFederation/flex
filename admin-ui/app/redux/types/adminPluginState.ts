import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type { AssetState } from 'Plugins/admin/redux/features/types/asset'
import type { WebhookTriggerResponseItem } from 'Plugins/admin/redux/types'

export type MauEntry = {
  monthly_active_users?: number
}

type WebhookEntryBase = {
  inum?: string
  displayName?: string
  url?: string
  httpMethod?: string
  httpHeaders?: Record<string, string>
  httpRequestBody?: string
  jansEnabled?: boolean
}

export type WebhookEntry = WebhookEntryBase & {
  [key: string]: JsonValue | Record<string, string> | undefined
}

export type AuiFeature = {
  inum?: string
  displayName?: string
  description?: string
  [key: string]: JsonValue | undefined
}

type StoredTriggerPayload = {
  feature: string | null
  payload: JsonValue
}

type WebhookState = {
  loadingWebhooks: boolean
  featureWebhooks: WebhookEntry[]
  webhookModal: boolean
  triggerWebhookInProgress: boolean
  webhookTriggerResults: WebhookTriggerResponseItem[]
  triggerPayload: StoredTriggerPayload
  featureToTrigger: string
  showWebhookExecutionDialog: boolean
}

export type AdminPluginState = {
  webhookReducer: WebhookState
  assetReducer: AssetState
}
