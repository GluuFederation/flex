import { handleResponse } from 'Utils/ApiUtils'

export default class MappingApi {
  constructor(api) {
    this.api = api
  }

  getAllWebhooks = (opts) => {
    return new Promise((resolve, reject) => {
      this.api.getAllWebhooks(opts, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  createWebhook = (body) => {
    const options = {
      webhookEntry: body
    }
    return new Promise((resolve, reject) => {
      this.api.postWebhook(options, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  deleteWebhookByInum = (id) => {
    return new Promise((resolve, reject) => {
      this.api.deleteWebhookByInum(id, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  updateWebhook = (body) => {
    const options = {
      webhookEntry: body
    }
    return new Promise((resolve, reject) => {
      this.api.putWebhook(options, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
}
