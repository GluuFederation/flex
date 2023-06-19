export interface TDynamicConfigurationFields {
  issuer: string
  baseEndpoint: string
  cleanServiceInterval: number
  cleanServiceBatchChunkSize: number
  useLocalCache: boolean
  disableJdkLogger: boolean
  loggingLevel: string
  loggingLayout: TLoggingLayout
  externalLoggerConfiguration?: string
  metricReporterEnabled: boolean
  metricReporterInterval: number
  metricReporterKeepfTDynamicConfigurationFieldsDataDays: number
  superGluuEnabled: boolean
  personCustomObjectClassList: string[],
  metricReporterKeepDataDays: number
}

export interface TDynamicConfigurationPayload {
  [key: string]: TDynamicConfigurationFields
}

export interface TLoggingLayout {
  [key: string]: 'text' | 'json'
}
