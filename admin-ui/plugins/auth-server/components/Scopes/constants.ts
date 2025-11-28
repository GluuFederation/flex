import type { Scope } from 'JansConfigApi'
import type { ExtendedScope, ExtendedScopeAttributes } from './types'

export interface ScopeWithMessage extends Scope {
  action_message?: string
}
export const DEFAULT_SCOPE_ATTRIBUTES: ExtendedScopeAttributes = {
  spontaneousClientId: undefined,
  spontaneousClientScopes: [] as string[],
  showInConfigurationEndpoint: false,
}
export const INITIAL_SCOPE: ExtendedScope = {
  id: '',
  displayName: '',
  description: '',
  scopeType: undefined,
  defaultScope: false,
  claims: [],
  dynamicScopeScripts: [],
  attributes: DEFAULT_SCOPE_ATTRIBUTES,
  umaAuthorizationPolicies: [],
}
