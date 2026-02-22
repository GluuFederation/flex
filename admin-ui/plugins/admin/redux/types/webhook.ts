import type { WebhookEntry } from 'JansConfigApi'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

export interface WebhookTriggerResponseItem {
  success: boolean
  responseMessage?: string
  responseObject?: {
    inum?: string
    webhookId?: string
    webhookName?: string
  }
}

export interface WebhookSliceTriggerPayload {
  feature: string | null
  payload: JsonValue
}

export type TriggerPayloadValue =
  | string
  | number
  | boolean
  | null
  | Record<string, string | number | boolean | null>
  | Array<string | number | boolean | null>

export interface TriggerPayloadActionPayload {
  feature?: string | null
  payload?: TriggerPayloadValue
}

export interface TriggerWebhookActionPayload {
  createdFeatureValue?: Record<string, JsonValue>
}

export type TriggerWebhookReducerPayload = TriggerPayloadActionPayload | TriggerWebhookActionPayload

export interface WebhookSliceState {
  loadingWebhooks: boolean
  featureWebhooks: WebhookEntry[]
  webhookModal: boolean
  triggerWebhookInProgress: boolean
  triggerWebhookMessage: string
  webhookTriggerErrors: WebhookTriggerResponseItem[]
  triggerPayload: WebhookSliceTriggerPayload
  featureToTrigger: string
  showErrorModal: boolean
}
