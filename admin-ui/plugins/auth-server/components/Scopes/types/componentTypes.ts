/**
 * Component prop types for Scope components
 */

import type { Scope, ExtendedScope, ScopeWithClients, ScopeScript, ScopeClaim } from './scopeTypes'
import type { ModifiedFields } from './formTypes'

/**
 * Props for ScopeDetailPage component
 */
export interface ScopeDetailPageProps {
  row: Scope
}

/**
 * Props for ScopeListPage component
 * Currently no props needed (top-level page component)
 */
export interface ScopeListPageProps {}

/**
 * Props for ScopeAddPage component
 * Currently no props needed (top-level page component)
 */
export interface ScopeAddPageProps {}

/**
 * Props for ScopeEditPage component
 * Currently no props needed (top-level page component)
 */
export interface ScopeEditPageProps {}

/**
 * Props for ScopeForm component
 */
export interface ScopeFormProps {
  scope: ExtendedScope
  scripts: ScopeScript[]
  attributes: ScopeClaim[]
  handleSubmit: (data: string) => void
  onSearch?: (value: string) => void
  modifiedFields: ModifiedFields
  setModifiedFields: (fields: ModifiedFields) => void
}

/**
 * Row data for MaterialTable in ScopeListPage
 * Extends Scope with client information
 */
export interface ScopeTableRow extends ScopeWithClients {
  tableData?: {
    id: number
  }
}
