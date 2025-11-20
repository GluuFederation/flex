import type {
  CustomScript,
  SimpleCustomProperty,
  SimpleExtendedCustomProperty,
  ScriptError,
  CustomScriptScriptType,
  CustomScriptProgrammingLanguage,
  CustomScriptLocationType,
  GetCustomScriptType200Item,
} from 'JansConfigApi'

// Re-export API types for convenience
export type {
  CustomScript,
  SimpleCustomProperty,
  SimpleExtendedCustomProperty,
  ScriptError,
  CustomScriptScriptType,
  CustomScriptProgrammingLanguage,
  CustomScriptLocationType,
  GetCustomScriptType200Item,
}

/**
 * Script type option for dropdowns
 */
export interface ScriptTypeOption {
  name: string
}

/**
 * Property in key-value format for UI
 */
export interface PropertyKeyValue {
  key: string
  value: string
  description?: string
  hide?: boolean
}

/**
 * Location type for script storage
 */
export type LocationType = 'db' | 'file'

/**
 * Script error information
 */
export interface ScriptErrorInfo {
  raisedAt?: string
  stackTrace?: string
}

/**
 * Mode for form operations
 */
export type FormMode = 'create' | 'edit' | 'view'

/**
 * List filter options
 */
export interface ScriptListFilters {
  pattern: string
  type: string
  sortBy?: 'inum' | 'name' | 'description'
  sortOrder: 'ascending' | 'descending'
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  startIndex: number
  limit: number
  pageNumber: number
}

/**
 * Modified fields for audit logging
 */
export type ModifiedFields = Record<string, unknown>

/**
 * Audit log action types
 */
export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETION'
