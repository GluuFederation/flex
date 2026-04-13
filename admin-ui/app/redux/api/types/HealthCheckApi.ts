export type ServiceStatusInput = {
  [key: string]: string
}

export type ServiceStatusResponse = {
  [serviceName: string]: string
}

export type HealthCheckApiInstance = {
  getServiceStatus: (
    input: ServiceStatusInput,
    callback: (error: Error | null, data: ServiceStatusResponse) => void,
  ) => void
}
