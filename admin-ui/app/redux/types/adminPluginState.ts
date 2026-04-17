import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type { WebhookTriggerResponseItem } from 'Plugins/admin/redux/types'
import type { AssetState } from 'Plugins/admin/redux/features/types/asset'

export type { WebhookTriggerResponseItem }

export type MauEntry = {
  monthly_active_users?: number
}

export type MauStatItem = {
  month?: string
  mau?: number
  [key: string]: string | number | boolean | null | undefined
}

export type MauState = {
  stat: MauStatItem[]
  loading: boolean
  startMonth: string
  endMonth: string
}

export type WebhookEntryBase = {
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

export type StoredTriggerPayload = {
  feature: string | null
  payload: JsonValue
}

export type WebhookState = {
  loadingWebhooks: boolean
  featureWebhooks: WebhookEntry[]
  webhookModal: boolean
  triggerWebhookInProgress: boolean
  triggerWebhookMessage: string
  webhookTriggerErrors: WebhookTriggerResponseItem[]
  triggerPayload: StoredTriggerPayload
  featureToTrigger: string
  showErrorModal: boolean
}

export type AdminPluginState = {
  mauReducer: MauState
  webhookReducer: WebhookState
  assetReducer: AssetState
}
