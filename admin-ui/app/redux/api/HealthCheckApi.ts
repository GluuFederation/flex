import { handleError } from 'Utils/ApiUtils'

export interface ServiceStatusInput {
  [key: string]: string
}

export interface ServiceStatusResponse {
  [serviceName: string]: string
}

interface HealthCheckApiInstance {
  getServiceStatus: (
    input: ServiceStatusInput,
    callback: (error: Error | null, data: ServiceStatusResponse) => void,
  ) => void
}

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
