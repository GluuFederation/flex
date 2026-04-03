import { AppConfiguration1 } from 'JansConfigApi'

// Form values for Dynamic Configuration
export type DynamicConfigFormValues = {
  issuer: string
  baseEndpoint: string
  cleanServiceInterval: number | string
  cleanServiceBatchChunkSize: number | string
  useLocalCache: boolean
  disableJdkLogger: boolean
  loggingLevel: string
  loggingLayout: string
  metricReporterEnabled: boolean
  metricReporterInterval: number | string
  metricReporterKeepDataDays: number | string
  personCustomObjectClassList: string[]
  fido2MetricsEnabled: boolean
  fido2MetricsRetentionDays: number | string
  fido2DeviceInfoCollection: boolean
  fido2ErrorCategorization: boolean
  fido2PerformanceMetrics: boolean
}

export type StaticConfigFormValues = {
  authenticatorCertsFolder: string
  mdsCertsFolder: string
  mdsTocsFolder: string
  unfinishedRequestExpiration: number | string
  authenticationHistoryExpiration: number | string
  serverMetadataFolder: string
  userAutoEnrollment: boolean
  requestedParties: Array<{ key: string; value: string }>
  enabledFidoAlgorithms: string[]
  metadataServers: Array<{ url: string; rootCert: string }>
  disableMetadataService: boolean
  hints: string[]
  enterpriseAttestation: boolean
  attestationMode: string
}

export type FidoFormValues = DynamicConfigFormValues | StaticConfigFormValues

export type FidoConfigurationProps<T extends FidoFormValues> = {
  fidoConfiguration: AppConfiguration1 | undefined
  handleSubmit: (data: T, userMessage?: string) => void
  isSubmitting: boolean
  readOnly: boolean
}

export type DynamicConfigurationProps = FidoConfigurationProps<DynamicConfigFormValues>
export type StaticConfigurationProps = FidoConfigurationProps<StaticConfigFormValues>

export type CreateFidoConfigPayloadParams = {
  fidoConfiguration: AppConfiguration1
  data: DynamicConfigFormValues | StaticConfigFormValues
  type: string
}

export type PutPropertiesFido2Params = {
  data: AppConfiguration1
}

export type ApiErrorResponse = {
  response?: {
    data?: {
      message?: string
    }
  }
}

export type FidoFormValuePrimitive =
  | string
  | number
  | boolean
  | string[]
  | Array<{ key: string; value: string }>
  | Array<{ url: string; rootCert: string }>
