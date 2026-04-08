import { handleError } from 'Utils/ApiUtils'
import type {
  WebhookTriggerResponseItem,
  WebhooksByFeatureIdApiResponse,
  TriggerWebhookApiResponse,
  TriggerWebhookApiPayload,
  AdminUIWebhooksApiInstance,
} from '../types/webhook'
import type { WebhookOutputItem } from 'Plugins/admin/helper/utils'

export type {
  WebhookTriggerResponseItem,
  WebhookOutputItem,
  WebhooksByFeatureIdApiResponse,
  TriggerWebhookApiResponse,
  TriggerWebhookApiPayload,
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
