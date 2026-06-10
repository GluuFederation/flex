import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import { CEDAR_ACTIONS, RESOURCE_ACTIONS, CEDARLING_LOG_TYPE } from '@/cedarling/constants'

export type CedarAction = (typeof CEDAR_ACTIONS)[keyof typeof CEDAR_ACTIONS]
export type AdminUiFeatureResource = keyof typeof RESOURCE_ACTIONS
export type ResourceScopeEntry = {
  action: CedarAction
  resourceId: AdminUiFeatureResource
}
export type CedarlingLogType = (typeof CEDARLING_LOG_TYPE)[keyof typeof CEDARLING_LOG_TYPE]

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
  initialized: null | boolean
  isInitializing: boolean
  cedarFailedStatusAfterMaxTries: null | boolean
  policyStoreBytes: string
}

export type SetCedarlingPermissionPayload = {
  resourceId: string
  isAuthorized: boolean
}

export type ResourcePermission = {
  canRead: boolean
  canWrite: boolean
  canDelete: boolean
}

export type UseCedarlingReturn = {
  authorizeHelper: (resourceScopes: ResourceScopeEntry[]) => Promise<AuthorizationResult[]>
  hasCedarReadPermission: (resourceId: AdminUiFeatureResource) => boolean | undefined
  hasCedarWritePermission: (resourceId: AdminUiFeatureResource) => boolean | undefined
  hasCedarDeletePermission: (resourceId: AdminUiFeatureResource) => boolean | undefined
}
