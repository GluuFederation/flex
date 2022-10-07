import { handleResponse } from 'Utils/ApiUtils'

export default class InitApi {
  constructor(api) {
    this.api = api
  }

  getScopes = (options) => {
    return new Promise((resolve, reject) => {
      this.api.getOauthScopes(options, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  getScripts = () => {
    return new Promise((resolve, reject) => {
      this.api.getConfigScripts({},(error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  getAttributes = (options) => {
    return new Promise((resolve, reject) => {
      this.api.getAttributes(options, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  getClients = (options) => {
    return new Promise((resolve, reject) => {
      this.api.getOauthOpenidClients(options, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
}
