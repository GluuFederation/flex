import type { ExtendedScope, ScopeWithClients, ScopeScript, ScopeClaim } from './scopeTypes'
import type { ModifiedFields } from './formTypes'

export interface ScopeDetailPageProps {
  row: ScopeWithClients
}

export type ScopeListPageProps = Record<string, never>

export type ScopeAddPageProps = Record<string, never>

export type ScopeEditPageProps = Record<string, never>

export interface ScopeFormProps {
  scope: ExtendedScope
  scripts: ScopeScript[]
  attributes: ScopeClaim[]
  handleSubmit: (data: string) => void
  onSearch?: (value: string) => void
  modifiedFields: ModifiedFields
  setModifiedFields: (fields: ModifiedFields) => void
}

export interface ScopeTableRow extends ScopeWithClients {
  tableData?: {
    id: number
  }
}
