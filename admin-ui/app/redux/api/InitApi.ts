import { handleResponse } from 'Utils/ApiUtils'

interface ApiClient {
  getOauthScopes: (
    options: Record<string, unknown>,
    callback: (error: Error | null, data: unknown) => void,
  ) => void
  getConfigScripts: (
    options: Record<string, unknown>,
    callback: (error: Error | null, data: unknown) => void,
  ) => void
  getAttributes: (
    options: Record<string, unknown>,
    callback: (error: Error | null, data: unknown) => void,
  ) => void
  getOauthOpenidClients: (
    options: Record<string, unknown>,
    callback: (error: Error | null, data: unknown) => void,
  ) => void
}

export default class InitApi {
  private readonly api: ApiClient

  constructor(api: ApiClient) {
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
