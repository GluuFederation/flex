import { AppConfiguration1 } from 'JansConfigApi'

// Form values for Dynamic Configuration
export interface DynamicConfigFormValues {
  issuer: string
  baseEndpoint: string
  cleanServiceInterval: number | string
  cleanServiceBatchChunkSize: number | string
  useLocalCache: boolean
  disableJdkLogger: boolean
  loggingLevel: string
  loggingLayout: string
  externalLoggerConfiguration: string
  metricReporterEnabled: boolean
  metricReporterInterval: number | string
  metricReporterKeepDataDays: number | string
  personCustomObjectClassList: string[]
  hints: string[]
}

export interface StaticConfigFormValues {
  authenticatorCertsFolder: string
  mdsCertsFolder: string
  mdsTocsFolder: string
  unfinishedRequestExpiration: number | string
  authenticationHistoryExpiration: number | string
  serverMetadataFolder: string
  userAutoEnrollment: boolean
  requestedCredentialTypes: string[]
  requestedParties: Array<{ key: string; value: string }>
}

export interface DynamicConfigurationProps {
  fidoConfiguration: AppConfiguration1 | undefined
  handleSubmit: (data: DynamicConfigFormValues) => void
  isSubmitting: boolean
}

export interface StaticConfigurationProps {
  fidoConfiguration: AppConfiguration1 | undefined
  handleSubmit: (data: StaticConfigFormValues) => void
  isSubmitting: boolean
}

export interface CreateFidoConfigPayloadParams {
  fidoConfiguration: AppConfiguration1
  data: DynamicConfigFormValues | StaticConfigFormValues
  type: string
}

export interface PutPropertiesFido2Params {
  data: AppConfiguration1
}
