import { handleResponse } from 'Utils/ApiUtils'
import { AuthServerHealthCheckApi } from './types/health'

export default class HealthApi {
  private readonly api: AuthServerHealthCheckApi

  constructor(api: AuthServerHealthCheckApi) {
    this.api = api
  }

  getHealthStatus = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.api.getAuthServerHealth((error: Error | null, data: any) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }
}
