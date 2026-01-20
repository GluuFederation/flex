import type { Deployment } from 'JansConfigApi'

/**
 * Extended Agama project type with additional UI fields
 */
export interface AgamaProject extends Deployment {
  deployed_on: string
  type: string
  status: 'Processed' | 'Pending'
  error: 'Yes' | 'No' | ''
}

/**
 * Agama repository item from marketplace
 */
export interface AgamaRepository {
  'repository-name': string
  'download-link': string
  'description': string
  'sha256sum'?: string
}

/**
 * Response from Agama repositories endpoint
 */
export interface AgamaRepositoriesResponse {
  projects: AgamaRepository[]
}

/**
 * ACR (Authentication Context Class Reference) mapping
 */
export interface AcrMapping {
  mapping: string
  source: string
}

/**
 * Flow error details for display in table
 */
export interface FlowError {
  flow: string
  error: string
}

/**
 * ACR Mapping table row with MaterialTable metadata
 */
export type AcrMappingTableRow = AcrMapping & {
  tableData?: {
    id: number
  }
}

/**
 * Root state for JSON config reducer
 */
export interface JsonConfigRootState {
  jsonConfigReducer: {
    configuration: {
      acrMappings?: Record<string, string>
    }
    loading: boolean
  }
}

interface AgamaJsonPatch {
  op: 'add' | 'remove' | 'replace'
  path: string
  value?: Record<string, string>
}

export interface AgamaJsonPatchRequestBody {
  requestBody: AgamaJsonPatch[]
  [key: string]:
    | AgamaJsonPatch[]
    | string
    | number
    | boolean
    | string[]
    | number[]
    | boolean[]
    | null
}

/**
 * Project details state for modal
 */
export interface ProjectDetailsState {
  isLoading: boolean
  data: {
    statusCode?: number
    tableOptions?: FlowError[]
  } & Deployment
}

/**
 * Config details state for modal
 */
export interface ConfigDetailsState {
  isLoading: boolean
  data: Record<string, unknown>
}

/**
 * Table row type for Material Table
 */
export interface AgamaTableRow extends AgamaProject {
  tableData?: {
    id: number
  }
}

/**
 * Modified fields tracker for audit logging
 */
export interface ModifiedFields {
  [key: string]: string | boolean | string[] | number | undefined | null | Record<string, unknown>
}

/**
 * Type for JSON-serializable values
 */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[]

/**
 * Type for JSON objects
 */
export type JsonObject = { [key: string]: JsonValue }

/**
 * Type for API error responses
 */
export type ApiError = Error | { message?: string; status?: number; statusText?: string }
