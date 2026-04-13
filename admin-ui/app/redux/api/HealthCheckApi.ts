import { handleError } from 'Utils/ApiUtils'
import type {
  HealthCheckApiInstance,
  ServiceStatusInput,
  ServiceStatusResponse,
} from './types/HealthCheckApi'

export type { ServiceStatusInput, ServiceStatusResponse }

export default class HealthCheckApi {
  private readonly api: HealthCheckApiInstance

  constructor(api: HealthCheckApiInstance) {
    this.api = api
  }

  getHealthServerStatus = (input: ServiceStatusInput): Promise<ServiceStatusResponse> => {
    return new Promise<ServiceStatusResponse>((resolve, reject) => {
      this.api.getServiceStatus(input, (error: Error | null, data: ServiceStatusResponse) => {
        if (error) {
          handleError(error, reject)
          return
        }
        resolve(data)
      })
    })
  }
}
