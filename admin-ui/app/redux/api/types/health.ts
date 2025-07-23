export interface AuthServerHealthCheckApi {
  getAuthServerHealth: (callback: (error: Error | null, data: any) => void) => void
}

export interface HealthCheckApiInterface {
  getServiceStatus: (
    input: ServiceStatusInput,
    callback: (error: Error | null, data: any) => void,
  ) => void
}

export interface ServiceStatusInput {
  [key: string]: any
}
