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

export interface StaticConfigFormValues {
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

export interface DynamicConfigurationProps {
  fidoConfiguration: AppConfiguration1 | undefined
  handleSubmit: (data: DynamicConfigFormValues, userMessage?: string) => void
  isSubmitting: boolean
}

export interface StaticConfigurationProps {
  fidoConfiguration: AppConfiguration1 | undefined
  handleSubmit: (data: StaticConfigFormValues, userMessage?: string) => void
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

// Minimal Formik subset used by StaticConfiguration for typeahead adapters
export type FormikSetFieldValue<TValues> = <K extends keyof TValues>(
  field: K,
  value: TValues[K],
  shouldValidate?: boolean,
) => void

export interface MinimalFormik<TValues> {
  values: TValues
  setFieldValue: FormikSetFieldValue<TValues>
}
