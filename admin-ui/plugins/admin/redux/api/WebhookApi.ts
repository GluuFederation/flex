import { handleResponse } from 'Utils/ApiUtils'

interface WebhookApiClient {
  getAllWebhooks: (opts: any, callback: (error: Error | null, data: any) => void) => void
  postWebhook: (
    options: { webhookEntry: any },
    callback: (error: Error | null, data: any) => void,
  ) => void
  deleteWebhookByInum: (id: string, callback: (error: Error | null, data: any) => void) => void
  putWebhook: (
    options: { webhookEntry: any },
    callback: (error: Error | null, data: any) => void,
  ) => void
  getAllFeatures: (callback: (error: Error | null, data: any, response: any) => void) => void
  getFeaturesByWebhookId: (
    webhookId: string,
    callback: (error: Error | null, data: any, response: any) => void,
  ) => void
  getWebhooksByFeatureId: (
    featureId: string,
    callback: (error: Error | null, data: any, response: any) => void,
  ) => void
  triggerWebhook: (
    feature: string,
    shortCodeRequest: { shortCodeRequest: any },
    callback: (error: Error | null, data: any, response: any) => void,
  ) => void
}

interface WebhookPayload {
  feature: string
  outputObject: any
}

export default class WebhookApi {
  private readonly api: WebhookApiClient

  constructor(api: WebhookApiClient) {
    this.api = api
  }

  getAllWebhooks = (opts: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.api.getAllWebhooks(opts, (error: Error | null, data: any) => {
        handleResponse(error, reject, resolve, data, undefined)
      })
    })
  }

  createWebhook = (body: any): Promise<any> => {
    const options = {
      webhookEntry: body,
    }
    return new Promise((resolve, reject) => {
      this.api.postWebhook(options, (error: Error | null, data: any) => {
        handleResponse(error, reject, resolve, data, undefined)
      })
    })
  }

  deleteWebhookByInum = (id: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.api.deleteWebhookByInum(id, (error: Error | null, data: any) => {
        handleResponse(error, reject, resolve, data, undefined)
      })
    })
  }

  updateWebhook = (body: any): Promise<any> => {
    const options = {
      webhookEntry: body,
    }
    return new Promise((resolve, reject) => {
      this.api.putWebhook(options, (error: Error | null, data: any) => {
        handleResponse(error, reject, resolve, data, undefined)
      })
    })
  }

  getAllFeatures = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.api.getAllFeatures((error: Error | null, _data: any, response: any) => {
        handleResponse(error, reject, resolve, response, undefined)
      })
    })
  }

  getFeaturesByWebhookId = (webhookId: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.api.getFeaturesByWebhookId(
        webhookId,
        (error: Error | null, _data: any, response: any) => {
          handleResponse(error, reject, resolve, response, undefined)
        },
      )
    })
  }

  getWebhooksByFeatureId = (featureId: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.api.getWebhooksByFeatureId(
        featureId,
        (error: Error | null, _data: any, response: any) => {
          handleResponse(error, reject, resolve, response, undefined)
        },
      )
    })
  }

  triggerWebhook = (payload: WebhookPayload): Promise<any> => {
    const shortCodeRequest = {
      shortCodeRequest: payload.outputObject,
    }
    return new Promise((resolve, reject) => {
      this.api.triggerWebhook(
        payload.feature,
        shortCodeRequest,
        (error: Error | null, _data: any, response: any) => {
          handleResponse(error, reject, resolve, response, undefined)
        },
      )
    })
  }
}
