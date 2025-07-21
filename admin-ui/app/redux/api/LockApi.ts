import { handleResponse } from 'Utils/ApiUtils'
import { LockApiClient } from './types/lock'

export default class LockApi {
  private readonly api: LockApiClient

  constructor(api: LockApiClient) {
    this.api = api
  }
  getLockMau = (opt: Record<string, unknown>): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.getLockStat(opt, (error, data) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }
}
