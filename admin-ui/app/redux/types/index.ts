import type { Reducer, UnknownAction } from '@reduxjs/toolkit'
import type { ProfileDetails } from 'Routes/Apps/Profile/types'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type { CedarPermissionsState } from '@/cedarling/types'
import type { WebhookSliceState } from 'Plugins/admin/redux/types'

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

type InitState = {
  isTimeout: boolean
}

// Logout State (stateless)
type LogoutState = Record<string, never>

// License State
type LicenseState = {
  isLicenseValid: boolean
  islicenseCheckResultLoaded: boolean
  isLoading: boolean
  isConfigValid: boolean | null
  error: string
  errorSSA: string
  generatingTrialKey: boolean
  isNoValidLicenseKeyFound: boolean
  isUnderThresholdLimit: boolean
  isValidatingFlow: boolean
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
  logoutAuditSucceeded: boolean | null
}

// Auth server plugin state types

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
  toastReducer: ToastState
  profileDetailsReducer: ProfileDetailsState
  cedarPermissions: CedarPermissionsState
  logoutAuditReducer: SessionState
}

// Admin plugin reducers
type AdminPluginState = {
  mauReducer: MauState
  webhookReducer: WebhookSliceState
}

// Auth server plugin reducers
type AuthServerPluginState = {
  scopeReducer: ScopeState
  UMAResourceReducer: UmaResourceState
  messageReducer: MessageState
}

export type RootState = CoreAppState & Partial<AdminPluginState & AuthServerPluginState>

export type ReducerMap = {
  [K in keyof RootState]?: Reducer<RootState[K], UnknownAction>
}

export type ReducerChangeListener = (reducers: ReducerMap) => void
