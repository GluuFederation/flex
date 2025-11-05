import type {
  Scope,
  ScopeAttributes,
  ScopeScopeType,
  ScopeCreatorType,
  ScopeCreatorAttributes,
  GetOauthScopesParams,
} from 'JansConfigApi'

export type {
  Scope,
  ScopeAttributes,
  ScopeScopeType,
  ScopeCreatorType,
  ScopeCreatorAttributes,
  GetOauthScopesParams,
}

export interface ExtendedScopeAttributes extends ScopeAttributes {
  spontaneousClientId?: string | null | undefined
}

export interface ScopeClient {
  inum: string
  displayName?: string
  dn?: string
}

export interface ExtendedScope extends Scope {
  clients?: ScopeClient[]
  attributes?: ExtendedScopeAttributes
  iconUrl?: string
  umaAuthorizationPolicies?: string[]
  creationDate?: string | Date
  creatorType?: string
  creatorId?: string
  spontaneousClientScopes?: string[]
}

export interface ScopeWithClients extends ExtendedScope {}

export interface ScopeScript {
  dn: string
  name: string
  inum?: string
  scriptType?: string
  enabled?: boolean
}

export interface ScopeClaim {
  dn: string
  name: string
  key?: string
  claimName?: string
  displayName?: string
}

export interface ScopeListOptions extends GetOauthScopesParams {
  startIndex?: number
  limit?: number
  pattern?: string
  withAssociatedClients?: boolean
}

export interface ScopeFormData extends Omit<Scope, 'attributes'> {
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
