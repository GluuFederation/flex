import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

export type ITokenEntry = {
  mapping: string
  payload: string
}

type ICedarEntityMappingResource = {
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
