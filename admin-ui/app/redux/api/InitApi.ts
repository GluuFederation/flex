import { handleTypedResponse } from 'Utils/ApiUtils'
import type { GenericItem, PagedResult } from 'Redux/types'
import type { InitApiClient } from './types/InitApi'

export default class InitApi {
  private readonly api: InitApiClient

  constructor(api: InitApiClient) {
    this.api = api
  }

  getScopes = (options: Record<string, string | number>): Promise<GenericItem[]> => {
    return new Promise((resolve, reject) => {
      this.api.getOauthScopes(options, (error, data) => {
        handleTypedResponse(error, reject, resolve, data, null)
      })
    })
  }

  getScripts = (): Promise<PagedResult> => {
    return new Promise((resolve, reject) => {
      this.api.getConfigScripts({}, (error, data) => {
        handleTypedResponse(error, reject, resolve, data, null)
      })
    })
  }

  getAttributes = (options: Record<string, string | number>): Promise<PagedResult> => {
    return new Promise((resolve, reject) => {
      this.api.getAttributes(options, (error, data) => {
        handleTypedResponse(error, reject, resolve, data, null)
      })
    })
  }

  getClients = (options: Record<string, string | number>): Promise<PagedResult> => {
    return new Promise((resolve, reject) => {
      this.api.getOauthOpenidClients(options, (error, data) => {
        handleTypedResponse(error, reject, resolve, data, null)
      })
    })
  }
}
