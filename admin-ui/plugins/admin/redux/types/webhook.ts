import type { WebhookEntry } from 'JansConfigApi'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

export type WebhookTriggerResponseItem = {
  success: boolean | string
  responseCode?: number
  responseMessage?: string
  responseObject?: {
    inum?: string
    webhookId?: string
    webhookName?: string
    webhookMethod?: string
    webhookRequestBody?: string
  }
}

export type WebhookSliceTriggerPayload = {
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

export type TriggerPayloadActionPayload = {
  feature?: string | null
  payload?: TriggerPayloadValue
}

export type TriggerWebhookActionPayload = {
  createdFeatureValue?: Record<string, JsonValue>
  feature?: string
}

export type TriggerWebhookReducerPayload = TriggerPayloadActionPayload | TriggerWebhookActionPayload

export type WebhookSliceState = {
  loadingWebhooks: boolean
  featureWebhooks: WebhookEntry[]
  webhookModal: boolean
  triggerWebhookInProgress: boolean
  webhookTriggerResults: WebhookTriggerResponseItem[]
  triggerPayload: WebhookSliceTriggerPayload
  featureToTrigger: string
  showWebhookExecutionDialog: boolean
}
