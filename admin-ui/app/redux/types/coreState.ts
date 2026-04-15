import type { ProfileDetails } from 'Routes/Apps/Profile/types'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

export type CancellablePromise<T> = Promise<T> & { cancel?: () => void }

export type BackendStatus = {
  active: boolean
  errorMessage: string | null
  statusCode: number | null
}

export type UserInfo = {
  inum?: string
  user_name?: string
  name?: string
  given_name?: string
  family_name?: string
  [key: string]: string | string[] | number | boolean | undefined | null
}

export type AuthConfig = {
  clientId?: string
  endSessionEndpoint?: string
  postLogoutRedirectUri?: string
  [key: string]: string | number | boolean | undefined
}

export type AuthLocation = {
  IPv4?: string
  [key: string]: string | number | boolean | undefined
}

export type AuthState = {
  isAuthenticated: boolean
  userinfo: UserInfo | null
  userinfo_jwt: string | null
  idToken: string | null
  jwtToken: string | null
  issuer: string | null
  permissions: string[]
  location: AuthLocation
  config: AuthConfig
  codeChallenge: string | null
  codeChallengeMethod: string
  codeVerifier: string | null
  backendStatus: BackendStatus
  loadingConfig: boolean
  authState?: Record<string, string | number | boolean>
  userInum?: string | null
  isUserInfoFetched: boolean
  hasSession: boolean
}

export type GenericItem = {
  [key: string]: string | number | boolean | string[] | number[] | boolean[] | null
}

export type PagedResult = {
  entries?: GenericItem[]
  totalEntriesCount?: number
}

export type InitState = {
  scripts: GenericItem[]
  clients: GenericItem[]
  scopes: GenericItem[]
  attributes: GenericItem[]
  totalClientsEntries: number
  isTimeout: boolean
  loadingScripts: boolean
}

export type LogoutState = Record<string, never>

export type LicenseState = {
  isLicenseValid: boolean
  islicenseCheckResultLoaded: boolean
  isLicenseActivationResultLoaded: boolean
  isLicenceAPIkeyValid: boolean
  isLoading: boolean
  isConfigValid: boolean | null
  error: string
  errorSSA: string
  generatingTrialKey: boolean
  isNoValidLicenseKeyFound: boolean
  isUnderThresholdLimit: boolean
  isValidatingFlow: boolean
}

export type OidcDiscoveryConfig = Record<string, string>

export type OidcDiscoveryState = {
  configuration: OidcDiscoveryConfig
  loading: boolean
}

export type HealthStatus = 'Running' | 'Not present' | 'Down'

export type HealthServiceKey =
  | 'jans-lock'
  | 'jans-auth'
  | 'jans-config-api'
  | 'jans-casa'
  | 'jans-fido2'
  | 'jans-scim'
  | 'jans-link'
  | 'keycloak'

export type HealthStatusResponse = Partial<Record<HealthServiceKey, HealthStatus>> & {
  [serviceName: string]: HealthStatus | undefined
}

export type HealthState = {
  serverStatus: HealthStatus | null
  dbStatus: HealthStatus | null
  health: HealthStatusResponse
  loading: boolean
}

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export type ToastMessageExtras = Record<string, string | number | boolean | null>

export type ToastMessage =
  | string
  | {
      message: string
      extras?: ToastMessageExtras
    }

export type ToastState = {
  showToast: boolean
  message: ToastMessage
  type: ToastType
  onCloseRedirectUrl: string
}

export type UpdateToastPayload = {
  showToast: boolean
  type: ToastType
  message: ToastMessage
  onCloseRedirectUrl?: string
}

export type ProfileDetailsState = {
  profileDetails: ProfileDetails | null
  loading: boolean
}

export type CedarPermissionsState = {
  permissions: Record<string, boolean>
  loading: boolean
  error: string | null
  initialized: boolean | null
  isInitializing: boolean
  cedarFailedStatusAfterMaxTries: boolean | null
  policyStoreBytes: string
}

export type SessionState = {
  logoutAuditInFlight: boolean
  logoutAuditSucceeded: boolean | null
}

export type LockState = {
  lockDetail: Record<string, JsonValue>
  loading: boolean
}

export type CoreAppState = {
  authReducer: AuthState
  initReducer: InitState
  logoutReducer: LogoutState
  licenseReducer: LicenseState
  oidcDiscoveryReducer: OidcDiscoveryState
  healthReducer: HealthState
  toastReducer: ToastState
  profileDetailsReducer: ProfileDetailsState
  cedarPermissions: CedarPermissionsState
  lockReducer: LockState
  logoutAuditReducer: SessionState
}
