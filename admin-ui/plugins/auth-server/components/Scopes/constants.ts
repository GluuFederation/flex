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

export const SCOPE_TYPE_OPTIONS = [
  { value: 'oauth', label: 'OAuth' },
  { value: 'openid', label: 'OpenID' },
  { value: 'dynamic', label: 'Dynamic' },
  { value: 'uma', label: 'UMA' },
]

export const CREATOR_TYPES = ['CLIENT', 'USER'] as const

export const EMPTY_PLACEHOLDER = '\u2014'
export const DELETE_SUBJECT_SCOPE = 'scope'

export const DEFAULT_ATTRIBUTES_LIMIT = 100

export const SCOPE_CACHE_CONFIG = {
  staleTime: 5 * 60 * 1000,
  gcTime: 10 * 60 * 1000,
} as const

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
