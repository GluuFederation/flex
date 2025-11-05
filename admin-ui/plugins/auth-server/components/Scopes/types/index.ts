/**
 * Central export file for all Scope types
 * Provides a single import point for consumers
 */

// Core domain types
export type {
  Scope,
  ScopeAttributes,
  ScopeScopeType,
  ScopeCreatorType,
  ScopeCreatorAttributes,
  GetOauthScopesParams,
  ExtendedScopeAttributes,
  ExtendedScope,
  ScopeClient,
  ScopeWithClients,
  ScopeScript,
  ScopeClaim,
  ScopeListOptions,
  ScopeFormData,
} from './scopeTypes'

export { EMPTY_SCOPE } from './scopeTypes'

// Form types
export type {
  ScopeFormValues,
  ModifiedFields,
  ScopeFormSubmitData,
  UserActionPayload,
} from './formTypes'

// Component types
export type {
  ScopeDetailPageProps,
  ScopeListPageProps,
  ScopeAddPageProps,
  ScopeEditPageProps,
  ScopeFormProps,
  ScopeTableRow,
} from './componentTypes'
