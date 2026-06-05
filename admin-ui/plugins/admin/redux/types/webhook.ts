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

type TriggerPayloadValue =
  | string
  | number
  | boolean
  | null
  | Record<string, string | number | boolean | null>
  | Array<string | number | boolean | null>

type TriggerPayloadActionPayload = {
  feature?: string | null
  payload?: TriggerPayloadValue
}

type TriggerWebhookActionPayload = {
  createdFeatureValue?: Record<string, JsonValue>
  feature?: string
}

export type TriggerWebhookReducerPayload = TriggerPayloadActionPayload | TriggerWebhookActionPayload

export type WebhookSliceState = {
  webhookModal: boolean
  triggerWebhookInProgress: boolean
  webhookTriggerResults: WebhookTriggerResponseItem[]
  featureToTrigger: string
  showWebhookExecutionDialog: boolean
}
