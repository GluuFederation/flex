import type { Scope } from 'JansConfigApi'
import type { ExtendedScope, ExtendedScopeAttributes } from './types'
import { adminUiFeatures } from '@/constants'
import { SCOPE_TYPES } from 'Plugins/auth-server/common/Constants'

export const SCOPE_SORT_COLUMNS = ['inum', 'displayName'] as const
export const SCOPE_SORT_COLUMN_LABELS: Record<string, string> = {
  inum: 'fields.inum',
  displayName: 'fields.displayname',
}
export const DEFAULT_SCOPE_SORT_BY = ''
export const FEATURE_SCOPE_DELETE = adminUiFeatures.scopes_delete

export const SCOPE_TYPE_OPTIONS = [
  { value: SCOPE_TYPES.OAUTH, label: 'OAuth' },
  { value: SCOPE_TYPES.OPENID, label: 'OpenID' },
  { value: SCOPE_TYPES.DYNAMIC, label: 'Dynamic' },
  { value: SCOPE_TYPES.UMA, label: 'UMA' },
]

export const CREATOR_TYPES = ['CLIENT', 'USER'] as const

export const EMPTY_PLACEHOLDER = '—'

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
