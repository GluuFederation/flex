import type { Reducer, UnknownAction } from '@reduxjs/toolkit'
import type { ProfileDetails } from 'Routes/Apps/Profile/types'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type { CedarPermissionsState } from '@/cedarling/types'
import type { WebhookTriggerResponseItem } from 'Plugins/admin/redux/types'

type BackendStatus = {
  active: boolean
  errorMessage: string | null
  statusCode: number | null
}

type UserInfo = {
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

type AuthLocation = {
  IPv4?: string
  [key: string]: string | number | boolean | undefined
}

type AuthState = {
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

// Init State
export type GenericItem = {
  [key: string]: string | number | boolean | string[] | number[] | boolean[] | null
}

export type PagedResult = {
  entries?: GenericItem[]
  totalEntriesCount?: number
}

type InitState = {
  scripts: GenericItem[]
  clients: GenericItem[]
  scopes: GenericItem[]
  attributes: GenericItem[]
  totalClientsEntries: number
  isTimeout: boolean
  loadingScripts: boolean
}

// Logout State (stateless)
type LogoutState = Record<string, never>

// License State
type LicenseState = {
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

// OIDC Discovery State
export type OidcDiscoveryConfig = Record<string, string>

type OidcDiscoveryState = {
  configuration: OidcDiscoveryConfig
  loading: boolean
}

export type MauEntry = {
  monthly_active_users?: number
}

// MAU State
type MauStatItem = {
  month?: string
  mau?: number
  [key: string]: string | number | boolean | null | undefined
}

type MauState = {
  stat: MauStatItem[]
  loading: boolean
  startMonth: string
  endMonth: string
}

// Health State
type HealthStatus = 'Running' | 'Not present' | 'Down'

type HealthServiceKey =
  | 'jans-lock'
  | 'jans-auth'
  | 'jans-config-api'
  | 'jans-casa'
  | 'jans-fido2'
  | 'jans-scim'
  | 'jans-link'
  | 'keycloak'

type HealthStatusResponse = Partial<Record<HealthServiceKey, HealthStatus>> & {
  [serviceName: string]: HealthStatus
}

type HealthState = {
  serverStatus: HealthStatus | null
  dbStatus: HealthStatus | null
  health: HealthStatusResponse
  loading: boolean
}

export type ToastType = 'success' | 'error' | 'warning' | 'info'

type ToastMessageExtras = Record<string, string | number | boolean | null>

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

// Profile Details State
type ProfileDetailsState = {
  profileDetails: ProfileDetails | null
  loading: boolean
}

// Session State (logout audit)
type SessionState = {
  logoutAuditInFlight: boolean
  logoutAuditSucceeded: boolean | null
}

// Lock State
type LockState = {
  lockDetail: Record<string, JsonValue>
  loading: boolean
}

// Admin plugin state types

// Webhook State
type WebhookEntry = {
  inum?: string
  displayName?: string
  url?: string
  httpMethod?: string
  httpHeaders?: Record<string, string>
  httpRequestBody?: string
  jansEnabled?: boolean
  [key: string]: JsonValue | Record<string, string> | undefined
}

type StoredTriggerPayload = {
  feature: string | null
  payload: JsonValue
}

type WebhookState = {
  loadingWebhooks: boolean
  featureWebhooks: WebhookEntry[]
  webhookModal: boolean
  triggerWebhookInProgress: boolean
  webhookTriggerResults: WebhookTriggerResponseItem[]
  triggerPayload: StoredTriggerPayload
  featureToTrigger: string
  showWebhookExecutionDialog: boolean
}

// Asset State
type AssetDocument = {
  inum?: string
  displayName?: string
  description?: string
  document?: string
  creationDate?: string
  jansEnabled?: boolean
  [key: string]: JsonValue | undefined
}

type AssetState = {
  assets: AssetDocument[]
  services: string[]
  fileTypes: string[]
  loading: boolean
  saveOperationFlag: boolean
  errorInSaveOperationFlag: boolean
  totalItems: number
  entriesCount: number
  selectedAsset: AssetDocument | Record<string, never>
  loadingAssets: boolean
}

// Auth server plugin state types

// OIDC Client
export type OidcClientItem = {
  inum?: string
  clientName?: string
  displayName?: string
  [key: string]: JsonValue | undefined
}

type OidcTokensState = {
  items: JsonValue[]
  totalItems: number
  entriesCount: number
}

type OidcState = {
  items: OidcClientItem[]
  item: OidcClientItem
  view: boolean
  loading: boolean
  isTokenLoading: boolean
  saveOperationFlag: boolean
  errorInSaveOperationFlag: boolean
  totalItems: number
  entriesCount: number
  tokens: OidcTokensState
}

// Scope State
export type ScopeItem = {
  inum?: string
  id?: string
  displayName?: string
  description?: string
  scopeType?: string
  [key: string]: JsonValue | undefined
}

type ScopeState = {
  items: ScopeItem[]
  item: ScopeItem
  loading: boolean
  saveOperationFlag: boolean
  errorInSaveOperationFlag: boolean
  scopesByCreator: ScopeItem[]
  totalItems: number
  entriesCount: number
  clientScopes: ScopeItem[]
  loadingClientScopes: boolean
  selectedClientScopes: ScopeItem[]
}

// UMA Resource State
type UmaResourceItem = {
  inum?: string
  name?: string
  [key: string]: JsonValue | undefined
}

type UmaResourceState = {
  items: UmaResourceItem[]
  item: UmaResourceItem
  loading: boolean
}

// Message State
type MessageState = {
  messages: JsonValue[]
  loading: boolean
  error: string | null
}

// Root state: core reducers (always present)

type CoreAppState = {
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

// Admin plugin reducers
type AdminPluginState = {
  mauReducer: MauState
  webhookReducer: WebhookState
  assetReducer: AssetState
}

// Auth server plugin reducers
type AuthServerPluginState = {
  oidcReducer: OidcState
  scopeReducer: ScopeState
  UMAResourceReducer: UmaResourceState
  messageReducer: MessageState
}

export type RootState = CoreAppState & Partial<AdminPluginState & AuthServerPluginState>

export type ReducerMap = {
  [K in keyof RootState]?: Reducer<RootState[K], UnknownAction>
}

export type ReducerChangeListener = (reducers: ReducerMap) => void
