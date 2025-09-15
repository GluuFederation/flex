import { CedarPermissionsState } from './JansLockConfigurationTypes'

export interface JansLockConfiguration {
  [key: string]:
    | string
    | number
    | boolean
    | string[]
    | number[]
    | boolean[]
    | Record<string, unknown>
    | null
    | undefined
}

export interface AppConfiguration5 {
  baseDN?: string
  baseEndpoint?: string
  openIdIssuer?: string
  statEnabled?: boolean
  statTimerIntervalInSeconds?: number
  tokenChannels?: string[]
  clientId?: string
  clientPassword?: string
  tokenUrl?: string
  endpointGroups?: Record<string, string[]>
  endpointDetails?: Record<string, string[]>
  disableJdkLogger?: boolean
  loggingLevel?: string
  loggingLayout?: string
  externalLoggerConfiguration?: string
  metricReporterInterval?: number
  metricReporterKeepDataDays?: number
  metricReporterEnabled?: boolean
  cleanServiceInterval?: number
  policiesJsonUrisAuthorizationToken?: string
  policiesJsonUris?: string[]
  policiesZipUrisAuthorizationToken?: string
  policiesZipUris?: string[]
  messageConsumerType?: string
  policyConsumerType?: string
  errorReasonEnabled?: boolean
}

export interface JansLockState {
  configuration: JansLockConfiguration
  loading: boolean
}

export interface JansLockConfigurationPayload {
  data?: JansLockConfiguration
}

export interface JansLockApiResponse<T = unknown> {
  data?: T
  error?: Error
}

export type JansLockCallback<T> = (error: Error | null, data?: T, response?: unknown) => void

export interface SagaError {
  response?: {
    status: number
    data?: unknown
  }
  message?: string
}

export interface PatchLockPropertiesOptions {
  requestBody?: Record<string, unknown>[]
}

export interface ILockConfigurationApi {
  getLockProperties(callback: JansLockCallback<AppConfiguration5>): void
  patchLockProperties(
    opts: PatchLockPropertiesOptions,
    callback: JansLockCallback<AppConfiguration5>,
  ): void
}

export interface AuthState {
  token: {
    access_token: string
  }
  issuer: string
  userinfo_jwt: string
}

export interface RootState {
  authReducer: AuthState
  jansLockReducer: JansLockState
  cedarPermissions: CedarPermissionsState
}

export interface JansLockAction {
  action: {
    action_data: Record<string, unknown>[]
  }
}
