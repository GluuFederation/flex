import { handleResponse } from 'Utils/ApiUtils'
import { HealthCheckApiInterface, ServiceStatusInput } from './types/health'

export default class HealthCheckApi {
  private readonly api: HealthCheckApiInterface

  constructor(api: HealthCheckApiInterface) {
    this.api = api
  }

  getHealthServerStatus = (input: ServiceStatusInput): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.api.getServiceStatus(input, (error: Error | null, data: any) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }
}
