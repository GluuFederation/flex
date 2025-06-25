import { handleResponse } from 'Utils/ApiUtils'

interface LockApiClient {
  getLockStat: (
    options: Record<string, unknown>,
    callback: (error: Error | null, data: unknown) => void,
  ) => void
}

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
