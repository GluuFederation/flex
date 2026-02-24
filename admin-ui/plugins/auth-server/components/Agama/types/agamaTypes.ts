import type { Deployment } from 'JansConfigApi'
import type { JsonValue, JsonObject } from 'Routes/Apps/Gluu/types/common'

export interface AgamaProject extends Deployment {
  deployed_on: string
  type: string
  status: 'Processed' | 'Pending'
  error: 'Yes' | 'No' | ''
}

export interface AgamaRepository {
  'repository-name': string
  'download-link': string
  'description': string
  'sha256sum'?: string
}

export interface AgamaRepositoriesResponse {
  projects: AgamaRepository[]
}

export interface AcrMapping {
  mapping: string
  source: string
}

export interface FlowError {
  flow: string
  error: string
}

export type AcrMappingTableRow = AcrMapping & {
  tableData?: {
    id: number
  }
}

export interface JsonConfigRootState {
  jsonConfigReducer: {
    configuration: {
      acrMappings?: Record<string, string>
    }
    loading: boolean
    saveError: boolean
  }
}

export interface AgamaJsonPatch {
  op: 'add' | 'remove' | 'replace'
  path: string
  value?: Record<string, string>
}

export interface AgamaJsonPatchRequestBody {
  requestBody: AgamaJsonPatch[]
}

export interface ProjectDetailsState {
  isLoading: boolean
  data: {
    statusCode?: number
    tableOptions?: FlowError[]
  } & Deployment
}

export interface ConfigDetailsState {
  isLoading: boolean
  data: JsonObject
}

export interface AgamaTableRow extends AgamaProject {
  tableData?: {
    id: number
  }
}

export interface ModifiedFields {
  [key: string]: JsonValue
}

export type { JsonValue, JsonObject }

export type ApiError = Error | { message?: string; status?: number; statusText?: string }
