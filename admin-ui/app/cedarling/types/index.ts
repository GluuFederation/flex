import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

export type CedarlingConstants = {
  readonly ACTION_TYPE: string
  readonly RESOURCE_TYPE: string
}

export type IPermissionWithTags = {
  permission: string
  tag: string
  defaultPermissionInToken?: boolean
}

export type IPrincipal = {
  id: string
  role: string | null
  scopes: string[]
  sub: string | null
  type: string
}

export type ITokenEntry = {
  mapping: string
  payload: string
}

export type ICedarEntityMappingResource = {
  cedar_entity_mapping: {
    entity_type: string
    id: string
  }
}

export type TokenAuthorizationRequest = {
  tokens: ITokenEntry[]
  action: string
  resource: ICedarEntityMappingResource
  context: Record<string, JsonValue>
}

export type AuthorizationResponse = {
  decision: boolean
  diagnostics?: {
    reason?: string[]
    errors?: string[]
  }
  [key: string]: JsonValue | undefined
}

export type AuthorizationResult = {
  isAuthorized: boolean
  response?: AuthorizationResponse
  error?: string
}

export type BootStrapConfig = {
  [key: string]: JsonValue | undefined
}

export type ICedarlingClient = {
  initialize: (config: BootStrapConfig, policyStoreBytes: Uint8Array) => Promise<void>
  token_authorize: (request: TokenAuthorizationRequest) => Promise<AuthorizationResponse>
}

export type CedarPermissionsState = {
  permissions: Record<string, boolean>
  loading: boolean
  error: string | null
  initialized: null | boolean
  isInitializing: boolean
  cedarFailedStatusAfterMaxTries: null | boolean
  policyStoreBytes: string
}

export type SetCedarlingPermissionPayload = {
  resourceId: string
  isAuthorized: boolean
}

export type ResourceScopeEntry = {
  permission: string
  resourceId: AdminUiFeatureResource
}

export type UseCedarlingReturn = {
  authorize: (resourceScope: ResourceScopeEntry[]) => Promise<AuthorizationResult>
  authorizeHelper: (resourceScopes: ResourceScopeEntry[]) => Promise<AuthorizationResult[]>
  hasCedarReadPermission: (resourceId: AdminUiFeatureResource) => boolean | undefined
  hasCedarWritePermission: (resourceId: AdminUiFeatureResource) => boolean | undefined
  hasCedarDeletePermission: (resourceId: AdminUiFeatureResource) => boolean | undefined
  isLoading: boolean
  error: string | null
}

export type ApiPermission = {
  permission: string
  tag: string
  inum?: string
  defaultPermissionInToken?: boolean
  description?: string
}

export type AuthReducerState = {
  userinfo_jwt?: string
  idToken?: string
  jwtToken?: string
  token?: {
    scopes: string[]
  }
  permissions?: string[]
  userinfo?: {
    jansAdminUIRole: string
    sub: string
  }
}

export type RootState = {
  authReducer: AuthReducerState
  cedarPermissions: CedarPermissionsState
}

export type Permission = {
  name: string
  tag: string
}

export type RolePermissionEntry = {
  role: string
  permissions: Permission[]
}

export type RolePermissionMapping = RolePermissionEntry[]

export type RuntimePolicyStore = {
  policies: Record<
    string,
    {
      description: string
      creation_date: string
      policy_content: string
    }
  >
}

export type RuntimePolicyStoreConfig = {
  policy_stores: Record<string, RuntimePolicyStore>
}

export type TrustedIssuer = {
  name?: string
  description?: string
  openid_configuration_endpoint: string
  token_metadata?: Record<string, JsonValue>
  [key: string]: JsonValue | undefined
}

export type ExtendedPolicyStore = RuntimePolicyStore & {
  trusted_issuers?: Record<string, TrustedIssuer>
  name?: string
  description?: string
  schema?: string
  [key: string]: JsonValue | Record<string, TrustedIssuer> | undefined
}

export type ExtendedPolicyStoreConfig = {
  policy_stores: Record<string, ExtendedPolicyStore>
  cedar_version?: string
  [key: string]: JsonValue | Record<string, ExtendedPolicyStore> | undefined
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
  | 'Metrics'

export type ApiPermissionType = { permission: string; tag: string }

export type CedarAction = 'read' | 'write' | 'delete'
