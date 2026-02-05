import type { Reducer, UnknownAction } from '@reduxjs/toolkit'
import type { ProfileDetails } from 'Routes/Apps/Profile/types'

// Core app state types

// Auth
export interface BackendStatus {
  active: boolean
  errorMessage: string | null
  statusCode: number | null
}

export interface UserInfo {
  inum?: string
  user_name?: string
  name?: string
  given_name?: string
  family_name?: string
  [key: string]: string | string[] | number | boolean | undefined | null
}

export interface AuthConfig {
  clientId?: string
  [key: string]: unknown
}

export interface AuthLocation {
  IPv4?: string
  [key: string]: unknown
}

export interface AuthState {
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
  authState?: unknown
  userInum?: string | null
  isUserInfoFetched: boolean
  hasSession: boolean
}

// Init State
export interface GenericItem {
  [key: string]: string | number | boolean | string[] | number[] | boolean[] | null
}

export interface InitState {
  scripts: GenericItem[]
  clients: GenericItem[]
  scopes: GenericItem[]
  attributes: GenericItem[]
  totalClientsEntries: number
  isTimeout: boolean
  loadingScripts: boolean
}

// Logout State (stateless)
export type LogoutState = Record<string, never>

// License State
export interface LicenseState {
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

// License Details State
export interface LicenseDetailsItem {
  companyName?: string
  customerEmail?: string
  customerFirstName?: string
  customerLastName?: string
  licenseActive?: boolean
  licenseEnable?: boolean
  licenseEnabled?: boolean
  licenseKey?: string
  licenseType?: string
  maxActivations?: number
  productCode?: string
  productName?: string
  validityPeriod?: string
  licenseExpired?: boolean
}

export interface LicenseDetailsState {
  item: LicenseDetailsItem
  loading: boolean
}

// OIDC Discovery State
export interface OidcDiscoveryState {
  configuration: Record<string, unknown>
  loading: boolean
}

// MAU State
export interface MauStatItem {
  month?: string
  mau?: number
  [key: string]: unknown
}

export interface MauState {
  stat: MauStatItem[]
  loading: boolean
  startMonth: string
  endMonth: string
}

// Health State
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
  [serviceName: string]: HealthStatus
}

export interface HealthState {
  serverStatus: HealthStatus | null
  dbStatus: HealthStatus | null
  health: HealthStatusResponse
  loading: boolean
}

// Attributes State
export interface AttributeItem {
  displayName?: string
  [key: string]: unknown
}

export interface AttributesState {
  items: AttributeItem[]
  loading: boolean
  initLoading: boolean
}

// Toast State
export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastState {
  showToast: boolean
  message: string
  type: ToastType
}

// Profile Details State
export interface ProfileDetailsState {
  profileDetails: ProfileDetails | null
  loading: boolean
}

// Cedar Permissions State
export interface CedarPermissionsState {
  permissions: Record<string, boolean>
  loading: boolean
  error: string | null
  initialized: boolean | null
  isInitializing: boolean
  cedarFailedStatusAfterMaxTries: boolean | null
  policyStoreJson: string
}

// Session State (logout audit)
export interface SessionState {
  logoutAuditInFlight: boolean
  logoutAuditSucceeded: boolean | null
}

// Lock State
export interface LockState {
  lockDetail: Record<string, unknown>
  loading: boolean
}

// Admin plugin state types

// API Role
export interface ApiRoleItem {
  inum?: string
  role?: string
  description?: string
  deletable?: boolean
  [key: string]: unknown
}

export interface ApiRoleState {
  items: ApiRoleItem[]
  item?: ApiRoleItem
  loading: boolean
}

// API Permission State
export interface ApiPermissionItem {
  inum?: string
  permission?: string
  description?: string
  defaultPermissionInToken?: boolean
  [key: string]: unknown
}

export interface ApiPermissionState {
  items: ApiPermissionItem[]
  item?: ApiPermissionItem
  loading: boolean
  saveOperationFlag: boolean
  errorInSaveOperationFlag: boolean
}

// Mapping State (role-permission)
export interface MappingItem {
  role?: string
  permissions?: string[]
  [key: string]: unknown
}

export interface MappingState {
  items: MappingItem[]
  serverItems: MappingItem[]
  loading: boolean
}

// Webhook State
export interface WebhookEntry {
  inum?: string
  displayName?: string
  url?: string
  httpMethod?: string
  httpHeaders?: Record<string, string>
  httpRequestBody?: string
  jansEnabled?: boolean
  [key: string]: unknown
}

export interface AuiFeature {
  inum?: string
  displayName?: string
  description?: string
  [key: string]: unknown
}

export interface TriggerPayload {
  feature: string | null
  payload: unknown
}

export interface WebhookState {
  webhooks: WebhookEntry[]
  loading: boolean
  saveOperationFlag: boolean
  errorInSaveOperationFlag: boolean
  totalItems: number
  entriesCount: number
  selectedWebhook: WebhookEntry | null
  loadingFeatures: boolean
  features: AuiFeature[]
  webhookFeatures: AuiFeature[]
  loadingWebhookFeatures: boolean
  loadingWebhooks: boolean
  featureWebhooks: WebhookEntry[]
  webhookModal: boolean
  triggerWebhookInProgress: boolean
  triggerWebhookMessage: string
  webhookTriggerErrors: unknown[]
  triggerPayload: TriggerPayload
  featureToTrigger: string
  showErrorModal: boolean
}

// Asset State
export interface AssetDocument {
  inum?: string
  displayName?: string
  description?: string
  document?: string
  creationDate?: string
  jansEnabled?: boolean
  [key: string]: unknown
}

export interface AssetState {
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
  assetModal: boolean
  showErrorModal: boolean
}

// Custom Script State
export interface ScriptError {
  type?: string
  message?: string
  stackTrace?: string
}

export interface ScriptType {
  value: string
  name: string
}

export interface ModuleProperty {
  value1: string
  value2: string
  description?: string
  hide?: boolean
}

export interface ConfigurationProperty {
  key?: string
  value?: string
  value1?: string
  value2?: string
  hide?: boolean
}

export interface CustomScriptItem {
  inum?: string
  name?: string
  description?: string
  scriptType?: string
  programmingLanguage?: string
  level?: number
  script?: string
  aliases?: string[]
  moduleProperties?: ModuleProperty[]
  configurationProperties?: ConfigurationProperty[]
  locationPath?: string
  locationType?: string
  enabled?: boolean
  scriptError?: ScriptError
  internal?: boolean
  revision?: number
}

export interface CustomScriptState {
  items: CustomScriptItem[]
  item?: CustomScriptItem
  loading: boolean
  view: boolean
  saveOperationFlag: boolean
  errorInSaveOperationFlag: boolean
  totalItems: number
  entriesCount: number
  scriptTypes: ScriptType[]
  hasFetchedScriptTypes: boolean
  loadingScriptTypes: boolean
}

// Auth server plugin state types

// OIDC Client
export interface OidcClientItem {
  inum?: string
  clientName?: string
  displayName?: string
  [key: string]: unknown
}

export interface OidcTokensState {
  items: unknown[]
  totalItems: number
  entriesCount: number
}

export interface OidcState {
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
export interface ScopeItem {
  inum?: string
  id?: string
  displayName?: string
  description?: string
  scopeType?: string
  [key: string]: unknown
}

export interface ScopeState {
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

// JSON Config State
export interface JsonConfigState {
  configuration: Record<string, unknown>
  loading: boolean
  saveError: boolean
}

// UMA Resource State
export interface UmaResourceItem {
  inum?: string
  name?: string
  [key: string]: unknown
}

export interface UmaResourceState {
  items: UmaResourceItem[]
  item: UmaResourceItem
  loading: boolean
}

// Message State
export interface MessageState {
  messages: unknown[]
  loading: boolean
  error: string | null
}

// Auth Server Session State
export interface AuthServerSessionState {
  sessions: unknown[]
  loading: boolean
  totalItems: number
  entriesCount: number
}

// SMTP plugin state types

export type ConnectProtection = 'None' | 'STARTTLS' | 'SSL/TLS'

export interface SmtpConfiguration {
  host?: string
  port?: number
  connect_protection?: ConnectProtection
  from_name?: string
  from_email_address?: string
  requires_authentication?: boolean
  smtp_authentication_account_username?: string
  smtp_authentication_account_password?: string
  trust_host?: boolean
  key_store?: string
  key_store_password?: string
  key_store_alias?: string
  signing_algorithm?: string
}

export interface SmtpState {
  smtp: SmtpConfiguration
  loading: boolean
  testStatus: boolean | null
  openModal: boolean
  testButtonEnabled: boolean
}

// Root state: core reducers (always present)

export interface CoreAppState {
  authReducer: AuthState
  initReducer: InitState
  logoutReducer: LogoutState
  licenseReducer: LicenseState
  licenseDetailsReducer: LicenseDetailsState
  oidcDiscoveryReducer: OidcDiscoveryState
  mauReducer: MauState
  healthReducer: HealthState
  attributesReducerRoot: AttributesState
  toastReducer: ToastState
  profileDetailsReducer: ProfileDetailsState
  cedarPermissions: CedarPermissionsState
  lockReducer: LockState
  logoutAuditReducer: SessionState
}

// Admin plugin reducers
export interface AdminPluginState {
  apiRoleReducer: ApiRoleState
  apiPermissionReducer: ApiPermissionState
  mappingReducer: MappingState
  webhookReducer: WebhookState
  assetReducer: AssetState
  customScriptReducer: CustomScriptState
}

// Auth server plugin reducers
export interface AuthServerPluginState {
  oidcReducer: OidcState
  scopeReducer: ScopeState
  jsonConfigReducer: JsonConfigState
  UMAResourceReducer: UmaResourceState
  messageReducer: MessageState
  sessionReducer: AuthServerSessionState
}

// SMTP plugin reducers
export interface SmtpPluginState {
  smtpsReducer: SmtpState
}

// RootState: core + optional plugin reducers (dynamically registered)
export interface RootState
  extends CoreAppState, Partial<AdminPluginState & AuthServerPluginState & SmtpPluginState> {}

// AppDispatch, useAppDispatch, useAppSelector: import from @/redux/hooks (canonical source using typeof store.dispatch)

// Reducer registry types
export type ReducerMap = {
  [K in keyof RootState]?: Reducer<RootState[K], UnknownAction>
}

export type ReducerChangeListener = (reducers: ReducerMap) => void

export type { AuthState as AuthReducerState }
export type SliceState<K extends keyof RootState> = NonNullable<RootState[K]>
