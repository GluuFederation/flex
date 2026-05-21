import type {
  Scope,
  ScopeAttributes,
  ScopeScopeType,
  ScopeCreatorType,
  ScopeCreatorAttributes,
  GetOauthScopesParams,
} from 'JansConfigApi'
import type { JsonValue } from '@/routes/Apps/Gluu/types/common'

export type {
  Scope,
  ScopeAttributes,
  ScopeScopeType,
  ScopeCreatorType,
  ScopeCreatorAttributes,
  GetOauthScopesParams,
}

export type ExtendedScopeAttributes = ScopeAttributes & {
  spontaneousClientId?: string | null | undefined
}

export type ScopeClient = {
  inum: string
  displayName?: string
  dn?: string
  [key: string]: JsonValue | undefined
}

export type ExtendedScope = Scope & {
  clients?: ScopeClient[]
  attributes?: ExtendedScopeAttributes
  spontaneousClientScopes?: string[]
}

export type ScopeWithClients = ExtendedScope

export type ScopeScript = {
  dn: string
  name: string
  inum?: string
  scriptType?: string
  enabled?: boolean
}

export type ScopeClaim = {
  dn: string
  name: string
  key?: string
  claimName?: string
  displayName?: string
}

export type ScopeListOptions = GetOauthScopesParams & {
  startIndex?: number
  limit?: number
  pattern?: string
  withAssociatedClients?: boolean
}

export type ScopeFormData = Omit<Scope, 'attributes'> & {
  attributes: Required<ScopeAttributes>
}

export const EMPTY_SCOPE: Partial<ExtendedScope> = {
  claims: [],
  dynamicScopeScripts: [],
  defaultScope: false,
  attributes: {
    spontaneousClientId: undefined,
    spontaneousClientScopes: [],
    showInConfigurationEndpoint: false,
  },
}
