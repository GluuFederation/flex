import { handleError } from 'Utils/ApiUtils'

export interface HealthData {
  status?: string
  db_status?: string
}

interface AuthServerHealthCheckApi {
  getAuthServerHealth: (callback: (error: Error | null, data: HealthData) => void) => void
}

export default class HealthApi {
  private readonly api: AuthServerHealthCheckApi

  constructor(api: AuthServerHealthCheckApi) {
    this.api = api
  }

  getHealthStatus = (): Promise<HealthData> => {
    return new Promise<HealthData>((resolve, reject) => {
      this.api.getAuthServerHealth((error: Error | null, data: HealthData) => {
        if (error) {
          handleError(error, reject)
          return
        }
        resolve(data)
      })
    })
  }
}
