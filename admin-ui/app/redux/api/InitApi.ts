import { handleResponse } from 'Utils/ApiUtils'
import { InitApiClient } from './types/init'

export default class InitApi {
  private readonly api: InitApiClient

  constructor(api: InitApiClient) {
    this.api = api
  }

  getScopes = (options: Record<string, unknown>): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.getOauthScopes(options, (error, data) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  getScripts = (): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.getConfigScripts({}, (error, data) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  getAttributes = (options: Record<string, unknown>): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.getAttributes(options, (error, data) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  getClients = (options: Record<string, unknown>): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.getOauthOpenidClients(options, (error, data) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }
}
