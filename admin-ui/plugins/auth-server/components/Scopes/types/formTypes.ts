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

export type ModifiedFields = {
  [key: string]: string | boolean | string[] | null
}

export interface ScopeFormSubmitData {
  scope: Scope
  modifiedFields?: ModifiedFields
}
