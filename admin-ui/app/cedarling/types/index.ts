// Core Cedarling Types
export interface CedarlingConstants {
  readonly PRINCIPAL_TYPE: string
  readonly RESOURCE_TYPE: string
  readonly ACTION_TYPE: string
  readonly APP_ID: string
  readonly APP_NAME: string
}

// Principal Types
export interface Principal {
  id: string
  role: string | null
  scopes: string[]
  sub: string | null
  type: string
}

// Resource Types
export interface Resource {
  app_id: string
  id: string
  name: string
  role: string | null
  scopes: string[]
  sub: string | null
  type: string
}

// Authorization Request
export interface AuthorizationRequest {
  principals: Principal[]
  action: string
  resource: Resource
  context: Record<string, unknown>
}

// Authorization Response
export interface AuthorizationResponse {
  decision: boolean
  diagnostics?: {
    reason?: string[]
    errors?: string[]
  }
  [key: string]: unknown
}

// Authorization Result
export interface AuthorizationResult {
  isAuthorized: boolean
  response?: AuthorizationResponse
  error?: string
}

// Policy Store Configuration
export interface PolicyStoreConfig {
  [key: string]: unknown
}

// Cedarling Client Interface
export interface ICedarlingClient {
  initialize: (policyStoreConfig: PolicyStoreConfig) => Promise<void>
  authorize: (request: AuthorizationRequest) => Promise<AuthorizationResponse>
}

// Redux State Types for Cedar Permissions
export interface CedarPermissionsState {
  permissions: Record<string, boolean>
  loading: boolean
  error: string | null
}

export interface SetCedarlingPermissionPayload {
  url: string
  isAuthorized: boolean
}

// Hook Types
export interface UseCedarlingReturn {
  authorize: (resourceScope: string[]) => Promise<AuthorizationResult>
  hasCedarPermission: (url: string) => boolean | undefined
  isLoading: boolean
  error: string | null
}

// Auth Reducer State (partial interface for what Cedar needs)
export interface AuthReducerState {
  token?: {
    scopes: string[]
  }
  permissions?: string[]
  userinfo?: {
    jansAdminUIRole: string
    sub: string
  }
}

// Root State (partial interface for Cedar operations)
export interface RootState {
  authReducer: AuthReducerState
  cedarPermissions: CedarPermissionsState
}
