import { handleError } from 'Utils/ApiUtils'
import type { WebhookEntry } from 'JansConfigApi'

export interface WebhookTriggerResponseItem {
  success: boolean
  responseMessage?: string
  responseObject?: {
    inum?: string
    webhookId?: string
    webhookName?: string
  }
}

export interface WebhookOutputItem {
  webhookId: string
  shortcodeValueMap: Record<string, string | number | boolean | null | object>
  url: string
}

export interface WebhooksByFeatureIdApiResponse {
  body?: WebhookEntry[]
}

export interface TriggerWebhookApiResponse {
  body?: WebhookTriggerResponseItem[]
}

export interface TriggerWebhookApiPayload {
  feature: string
  outputObject: WebhookOutputItem[]
}

type SdkCallback<TBody, TResponse> = (
  error: Error | null,
  data: TBody | null,
  response: TResponse,
) => void

interface AdminUIWebhooksApiInstance {
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

export default class WebhookApi {
  private api: AdminUIWebhooksApiInstance

  constructor(api: AdminUIWebhooksApiInstance) {
    this.api = api
  }

  getWebhooksByFeatureId = (featureId: string): Promise<WebhooksByFeatureIdApiResponse> => {
    return new Promise((resolve, reject) => {
      this.api.getWebhooksByFeatureId(featureId, (error, _data, response) => {
        if (error) {
          handleError(error, reject)
          return
        }
        resolve(response)
      })
    })
  }

  triggerWebhook = (payload: TriggerWebhookApiPayload): Promise<TriggerWebhookApiResponse> => {
    return new Promise((resolve, reject) => {
      this.api.triggerWebhook(
        payload.feature,
        { shortCodeRequest: payload.outputObject },
        (error, _data, response) => {
          if (error) {
            handleError(error, reject)
            return
          }
          resolve(response)
        },
      )
    })
  }
}
