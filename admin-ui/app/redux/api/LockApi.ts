import { handleTypedResponse } from 'Utils/ApiUtils'
import type { LockStatEntry } from 'Routes/Dashboards/types/DashboardTypes'
import type { LockApiClient } from './types/LockApi'

export default class LockApi {
  private readonly api: LockApiClient

  constructor(api: LockApiClient) {
    this.api = api
  }

  getLockMau = (opt: Record<string, string>): Promise<LockStatEntry[]> => {
    return new Promise((resolve, reject) => {
      this.api.getLockStat(opt, (error, data) => {
        handleTypedResponse(error, reject, resolve, data, null)
      })
    })
  }
}
