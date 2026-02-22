import { handleError } from 'Utils/ApiUtils'

interface ServiceStatusInput {
  [key: string]: string
}

interface ServiceStatusResponse {
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
