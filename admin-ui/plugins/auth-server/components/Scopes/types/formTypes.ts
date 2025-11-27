import type { Scope, ExtendedScopeAttributes } from './scopeTypes'

export interface ScopeFormValues {
  id?: string
  displayName?: string
  description?: string
  scopeType?: string
  defaultScope?: boolean
  claims?: string[]
  dynamicScopeScripts?: string[]
  attributes?: ExtendedScopeAttributes
  umaAuthorizationPolicies?: string[]
  iconUrl?: string
  action_message?: string
}

export interface ModifiedFields {
  [key: string]: string | boolean | string[] | undefined | null
}

export interface ScopeFormSubmitData {
  scope: Scope
  modifiedFields?: ModifiedFields
}

export interface UserActionPayload {
  action_message?: string
  scope?: Scope
  modifiedFields?: ModifiedFields
  [key: string]: unknown
}
