import { handleTypedResponse } from 'Utils/ApiUtils'
import type { MauEntry } from 'Redux/types'
import type { MauApiClient } from './types/MauApi'

export default class MauApi {
  private readonly api: MauApiClient

  constructor(api: MauApiClient) {
    this.api = api
  }

  getMau = (opts: Record<string, string>): Promise<MauEntry[]> => {
    opts['format'] = 'json'
    return new Promise((resolve, reject) => {
      this.api.getStat(opts, (error, data) => {
        handleTypedResponse(error, reject, resolve, data)
      })
    })
  }
}
