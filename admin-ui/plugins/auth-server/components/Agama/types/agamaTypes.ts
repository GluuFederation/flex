import type { Deployment, DeploymentDetails, ProjectMetadata } from 'JansConfigApi'

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
 * File upload payload for Agama project
 */
export interface AgamaFileUpload {
  name: string
  file: Uint8Array
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
 * Extended deployment details with typed flows error
 */
export interface ExtendedDeploymentDetails extends DeploymentDetails {
  flowsError?: Record<string, string>
}

/**
 * Extended project metadata
 */
export interface ExtendedProjectMetadata extends ProjectMetadata {
  configs?: Record<string, Record<string, Record<string, unknown>>>
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
