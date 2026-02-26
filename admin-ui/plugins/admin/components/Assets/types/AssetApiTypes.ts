export interface Document {
  dn?: string
  inum?: string
  fileName?: string
  filePath?: string
  description?: string
  document?: string
  creationDate?: string | Date
  service?: string
  level?: number
  revision?: number
  enabled?: boolean
  baseDn?: string
}

export interface AssetUploadResponse extends Document {
  displayName?: string
  jansModuleProperty?: string[]
  jansLevel?: string
  jansRevision?: string
  jansEnabled?: boolean
}

export interface DocumentPagedResult {
  start?: number
  totalEntriesCount?: number
  entriesCount?: number
  entries?: Document[]
}

export interface PagedResult {
  start?: number
  totalEntriesCount?: number
  entriesCount?: number
  entries?: unknown[]
}

export interface AssetDirMapping {
  directory?: string
  type?: string[]
  description?: string
  jansServiceModule?: string[]
}

export interface ApiError {
  code?: string
  message?: string
  description?: string
}

export interface GetAllAssetsOptions {
  limit?: number
  pattern?: string
  status?: string
  startIndex?: number
  sortBy?: string
  sortOrder?: 'ascending' | 'descending'
  fieldValuePair?: string
}

export interface AssetFormData {
  fileName: string
  description: string
  document: string | File | Blob
  service?: string
  enabled: boolean
  inum?: string
  dn?: string
  baseDn?: string
  [key: string]: unknown
}

export interface CreateAssetPayload {
  payload: {
    action: {
      action_data: AssetFormData
    }
  }
}

export interface UpdateAssetPayload {
  payload: {
    action: {
      action_data: AssetFormData
    }
  }
}

export interface IJansAssetsApi {
  deleteAsset(
    inum: string,
    callback: (error: Error | null, data?: unknown, response?: unknown) => void,
  ): unknown

  getAllAssets(
    opts: GetAllAssetsOptions,
    callback: (error: Error | null, data?: DocumentPagedResult, response?: unknown) => void,
  ): unknown

  getAssetByInum(
    inum: string,
    callback: (error: Error | null, data?: PagedResult, response?: unknown) => void,
  ): unknown

  getAssetByName(
    name: string,
    callback: (error: Error | null, data?: DocumentPagedResult, response?: unknown) => void,
  ): unknown

  getAssetDirMapping(
    callback: (error: Error | null, data?: AssetDirMapping[], response?: unknown) => void,
  ): unknown

  getAssetServices(
    callback: (error: Error | null, data?: string[], response?: unknown) => void,
  ): unknown

  getAssetTypes(
    callback: (error: Error | null, data?: string[], response?: unknown) => void,
  ): unknown

  loadServiceAsset(
    serviceName: string,
    callback: (error: Error | null, data?: string, response?: unknown) => void,
  ): unknown

  postNewAsset(
    document: Document,
    assetFile: File,
    callback: (error: Error | null, data?: Document, response?: unknown) => void,
  ): unknown

  putAsset(
    document: Document,
    assetFile: File,
    callback: (error: Error | null, data?: Document, response?: unknown) => void,
  ): unknown
}

export interface ApiResponse<T = unknown> {
  data?: T
  error?: ApiError
  status?: number
}

export interface AssetState {
  items: Document[]
  selectedAsset: Document | null
  loading: boolean
  totalItems: number
  entriesCount: number
  services: string[]
  types: string[]
  dirMappings: AssetDirMapping[]
}

export interface GetAssetsPayload {
  action: GetAllAssetsOptions
}

export interface CreateAssetPayload {
  data: AssetFormData
  token: string
}

export interface UpdateAssetPayload {
  data: UpdateAssetPayload
  token: string
}

export interface DeleteAssetPayload {
  inum: string
}

export interface LoadServiceAssetPayload {
  serviceName: string
}

export interface SagaError {
  response?: {
    body?: {
      description?: string
      message?: string
    }
    text?: string
  }
  message?: string
}
