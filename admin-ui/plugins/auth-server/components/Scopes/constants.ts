import type { Scope } from 'JansConfigApi'
import type { ExtendedScope, ExtendedScopeAttributes } from './types'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'

export const SCOPE_SORT_COLUMNS = ['inum', 'displayName'] as const
export const SCOPE_SORT_COLUMN_LABELS: Record<string, string> = {
  inum: 'fields.inum',
  displayName: 'fields.displayname',
}
export const DEFAULT_SCOPE_SORT_BY = ''
export const FEATURE_SCOPE_DELETE = adminUiFeatures.scopes_delete

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
