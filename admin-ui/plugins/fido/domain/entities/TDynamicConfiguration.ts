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
  personCustomObjectClassList: string[]
}

export interface TDynamicConfigurationPayload {
  appConfiguration1: TDynamicConfigurationFields
}

export interface TLoggingLayout {
  [key: string]: 'text' | 'json'
}
