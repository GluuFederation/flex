import type { WebhookEntry } from 'JansConfigApi'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type { WebhookOutputItem } from 'Plugins/admin/helper/utils'

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
  feature?: string
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

export type WebhooksByFeatureIdApiResponse = {
  body?: WebhookEntry[]
}

export type TriggerWebhookApiResponse = {
  body?: WebhookTriggerResponseItem[]
}

export type TriggerWebhookApiPayload = {
  feature: string
  outputObject: WebhookOutputItem[]
}

export type SdkCallback<TBody, TResponse> = (
  error: Error | null,
  data: TBody | null,
  response: TResponse,
) => void

export type AdminUIWebhooksApiInstance = {
  getWebhooksByFeatureId(
    featureId: string,
    callback: SdkCallback<WebhookEntry[], WebhooksByFeatureIdApiResponse>,
  ): void

  triggerWebhook(
    feature: string,
    shortCodeRequest: { shortCodeRequest: WebhookOutputItem[] },
    callback: SdkCallback<WebhookTriggerResponseItem[], TriggerWebhookApiResponse>,
  ): void
}
