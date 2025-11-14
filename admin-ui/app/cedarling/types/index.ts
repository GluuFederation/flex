// Core Cedarling Types
export interface CedarlingConstants {
  readonly ACTION_TYPE: string
  readonly RESOURCE_TYPE: string
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
export interface ICedarEntityMappingResource {
  cedar_entity_mapping: {
    entity_type: string
    id: string
  }
}

// Authorization Request

export interface TokenAuthorizationRequest {
  tokens: IToken
  action: string
  resource: ICedarEntityMappingResource
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
  initialized: null | boolean
  isInitializing: boolean
  cedarFailedStatusAfterMaxTries: null | boolean
  policyStoreJson: string
}

export interface SetCedarlingPermissionPayload {
  resourceId: string
  isAuthorized: boolean
}

// Hook Types
export type ResourceScopeEntry = {
  permission: string
  resourceId: string
}

export interface UseCedarlingReturn {
  authorize: (resourceScope: ResourceScopeEntry[]) => Promise<AuthorizationResult>
  authorizeHelper: (resourceScopes: ResourceScopeEntry[]) => Promise<AuthorizationResult[]>
  hasCedarPermission: (resourceId: string, permission?: string) => boolean | undefined
  hasCedarReadPermission: (resourceId: string) => boolean | undefined
  hasCedarWritePermission: (resourceId: string) => boolean | undefined
  hasCedarDeletePermission: (resourceId: string) => boolean | undefined
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

// Policy Generation Types
export interface Permission {
  name: string
  tag: string
}

export interface RolePermissionEntry {
  role: string
  permissions: Permission[]
}

export type RolePermissionMapping = RolePermissionEntry[]

// Policy store structure for runtime usage (subset of config types)
export interface RuntimePolicyStore {
  policies: Record<
    string,
    {
      description: string
      creation_date: string
      policy_content: string
    }
  >
}

export interface RuntimePolicyStoreConfig {
  policy_stores: Record<string, RuntimePolicyStore>
}

/**
 * Interface for trusted issuer with openid_configuration_endpoint
 */
export interface TrustedIssuer {
  name?: string
  description?: string
  openid_configuration_endpoint: string
  token_metadata?: Record<string, unknown>
  [key: string]: unknown
}

/**
 * Extended RuntimePolicyStore that includes trusted_issuers
 */
export interface ExtendedPolicyStore extends RuntimePolicyStore {
  trusted_issuers?: Record<string, TrustedIssuer>
  name?: string
  description?: string
  schema?: string
  [key: string]: unknown
}

/**
 * Extended RuntimePolicyStoreConfig that allows for the extended store
 */
export interface ExtendedPolicyStoreConfig {
  policy_stores: Record<string, ExtendedPolicyStore>
  cedar_version?: string
  [key: string]: unknown
}

export type AdminUiFeatureResource =
  | 'Dashboard'
  | 'License'
  | 'MAU'
  | 'Security'
  | 'Settings'
  | 'Webhooks'
  | 'Assets'
  | 'AuditLogs'
  | 'Clients'
  | 'Scopes'
  | 'Keys'
  | 'AuthenticationServerConfiguration'
  | 'Logging'
  | 'SSA'
  | 'Authentication'
  | 'ConfigApiConfiguration'
  | 'Session'
  | 'Users'
  | 'Scripts'
  | 'Attributes'
  | 'Cache'
  | 'Persistence'
  | 'SMTP'
  | 'SCIM'
  | 'FIDO'
  | 'SAML'
  | 'Lock'

export type ApiPermissionType = { permission: string; tag: string }

export type CedarAction = 'read' | 'write' | 'delete'
