import { FormikProps } from 'formik'
import {
  AppConfiguration1,
  Fido2Configuration,
} from '../../../jans_config_api_orval/src/JansConfigApi'

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
  personCustomObjectClassList: Array<{ value: string } | string>
  hints: string[]
}

// Form values for Static Configuration
export interface StaticConfigFormValues {
  authenticatorCertsFolder: string
  mdsCertsFolder: string
  mdsTocsFolder: string
  checkU2fAttestations: boolean
  unfinishedRequestExpiration: number | string
  authenticationHistoryExpiration: number | string
  serverMetadataFolder: string
  userAutoEnrollment: boolean
  requestedCredentialTypes: Array<{ value: string } | string>
  requestedParties: Array<{ key: string; value: string }>
}

// FIDO Configuration response structure
export interface FidoConfigurationData {
  fido: AppConfiguration1
  loading: boolean
}

// Component Props
export interface FidoProps {}

export interface DynamicConfigurationProps {
  fidoConfiguration: AppConfiguration1 | undefined
  handleSubmit: (data: DynamicConfigFormValues) => void
  loading: boolean
}

export interface StaticConfigurationProps {
  fidoConfiguration: AppConfiguration1 | undefined
  handleSubmit: (data: StaticConfigFormValues) => void
  loading: boolean
}

// RequestedParty structure for form mapping
export interface RequestedPartyForm {
  name: string
  domains: string[]
}

// Utility types for helper functions
export interface CreateFidoConfigPayloadParams {
  fidoConfiguration: AppConfiguration1
  data: DynamicConfigFormValues | StaticConfigFormValues
  type: string
}

export interface PutPropertiesFido2Params {
  appConfiguration1: AppConfiguration1
}
