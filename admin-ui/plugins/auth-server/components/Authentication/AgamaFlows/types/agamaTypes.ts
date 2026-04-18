import type { Deployment } from 'JansConfigApi'
import type { JsonValue, JsonObject } from 'Routes/Apps/Gluu/types/common'

export type AgamaProject = Deployment & {
  deployed_on: string
  type: string
  status: 'Processed' | 'Pending'
  error: 'Yes' | 'No' | ''
}

export type AgamaRepository = {
  'repository-name': string
  'download-link': string
  'description': string
  'sha256sum'?: string
}

export type AgamaRepositoriesResponse = {
  projects: AgamaRepository[]
}

export type AcrMapping = {
  mapping: string
  source: string
}

export type FlowError = {
  flow: string
  error: string
}

export type AcrMappingTableRow = AcrMapping & {
  tableData?: {
    id: number
  }
}

export type AgamaJsonPatch = {
  op: 'add' | 'remove' | 'replace'
  path: string
  value?: Record<string, string>
  [key: string]: JsonValue | undefined
}

export type AgamaJsonPatchRequestBody = {
  requestBody: AgamaJsonPatch[]
}

export type ProjectDetailsState = {
  isLoading: boolean
  data: {
    statusCode?: number
    tableOptions?: FlowError[]
  } & Deployment
}

export type ConfigDetailsState = {
  isLoading: boolean
  data: JsonObject
}

export type AgamaTableRow = AgamaProject & {
  tableData?: {
    id: number
  }
}

export type ModifiedFields = {
  [key: string]: JsonValue
}

export type { JsonValue, JsonObject }

export type ApiError = Error | { message?: string; status?: number; statusText?: string }
