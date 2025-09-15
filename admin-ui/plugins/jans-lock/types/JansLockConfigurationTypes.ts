import { JansLockState } from './JansLockApiTypes'

export interface OpaConfiguration {
  baseUrl?: string
  accessToken?: string
}

export interface ExtendedJansLockConfiguration {
  baseDN?: string
  tokenChannels?: string[]
  disableJdkLogger?: boolean
  loggingLevel?: string
  loggingLayout?: string
  externalLoggerConfiguration?: string
  metricReporterEnabled?: boolean
  metricReporterInterval?: number
  metricReporterKeepDataDays?: number
  cleanServiceInterval?: number
  metricChannel?: string
  pdpType?: string
  opaConfiguration?: OpaConfiguration
  policiesJsonUrisAuthorizationToken?: string
  policiesJsonUris?: string[]
  policiesZipUrisAuthorizationToken?: string
  policiesZipUris?: string[]
  [key: string]:
    | string
    | number
    | boolean
    | string[]
    | number[]
    | boolean[]
    | Record<string, unknown>
    | OpaConfiguration
    | null
    | undefined
}

export interface CedarPermissionsState {
  permissions: Record<string, boolean>
  loading: boolean
  error: string | null
}

export interface UserAction {
  [key: string]: unknown
  action_message: string
  action_data: PatchOperation[]
}

export interface PatchOperation {
  op: 'replace' | 'add' | 'remove'
  path: string
  value: unknown
}

export interface TypeAheadOption {
  customOption?: boolean
  tokenChannels?: string
  policiesJsonUris?: string
  policiesZipUris?: string
}
