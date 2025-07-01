// Core Cedarling Types
export interface CedarlingConstants {
  readonly RESOURCE_TYPE: string
  readonly APP_ID: string
  readonly ACTION_TYPE: string
}
export interface IPermissionWithTags {
  permission: string
  tag: string
  defaultPermissionInToken?: boolean
}

// Principal Types
export interface IPrincipal {
  id: string
  role: string | null
  scopes: string[]
  sub: string | null
  type: string
}
export interface IToken {
  access_token: string
  id_token: string
  userinfo_token: string
}

// Resource Types
export interface ITokenResource {
  app_id: string
  id: string
  type: string
}

// Authorization Request

export interface TokenAuthorizationRequest {
  tokens: IToken
  action: string
  resource: ITokenResource
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
export interface BootStrapConfig {
  [key: string]: unknown
}

// Cedarling Client Interface
export interface ICedarlingClient {
  initialize: (BootStrapConfig: BootStrapConfig) => Promise<void>
  token_authorize: (request: TokenAuthorizationRequest) => Promise<AuthorizationResponse>
}

// Redux State Types for Cedar Permissions
export interface CedarPermissionsState {
  permissions: Record<string, boolean>
  loading: boolean
  error: string | null
  initialized: boolean
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

// API Permission interface
export interface ApiPermission {
  permission: string
  tag: string
  inum?: string
  defaultPermissionInToken?: boolean
  description?: string
}

// Auth Reducer State (partial interface for what Cedar needs)
export interface AuthReducerState {
  userinfo_jwt?: string
  idToken?: string
  JwtToken?: string
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
  apiPermissionReducer: {
    items: ApiPermission[]
    loading: boolean
  }
}
