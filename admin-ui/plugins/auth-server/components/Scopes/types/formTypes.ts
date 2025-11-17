/**
 * Form-specific types for Scopes
 */

import type { Scope, ScopeAttributes } from './scopeTypes'

/**
 * Formik form values for ScopeForm
 * Represents the subset of Scope fields that are editable in the form
 */
export interface ScopeFormValues {
  id?: string
  displayName?: string
  description?: string
  scopeType?: string
  defaultScope?: boolean
  claims?: string[]
  dynamicScopeScripts?: string[]
  attributes?: ScopeAttributes
  umaAuthorizationPolicies?: string[]
  iconUrl?: string
}

/**
 * Modified fields tracking for audit logging
 * Tracks which fields were changed during form editing
 */
export interface ModifiedFields {
  [key: string]: string | boolean | string[] | undefined | null
}

/**
 * Form submission data with audit message
 */
export interface ScopeFormSubmitData {
  scope: Scope
  modifiedFields?: ModifiedFields
}

/**
 * User action payload for API calls
 * Used with buildPayload utility
 */
export interface UserActionPayload {
  action_message?: string
  scope?: Scope
  modifiedFields?: ModifiedFields
  [key: string]: unknown
}
