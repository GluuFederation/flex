// Asset API Types based on JansAssetsApi.js and related models

// Base Document interface
export interface Document {
  dn?: string
  inum?: string
  fileName?: string
  filePath?: string
  description?: string
  document?: string
  creationDate?: Date
  service?: string
  level?: number
  revision?: number
  enabled?: boolean
  baseDn?: string
}

// Paged result for document listing
export interface DocumentPagedResult {
  start?: number
  totalEntriesCount?: number
  entriesCount?: number
  entries?: Document[]
}

// Generic paged result
export interface PagedResult {
  start?: number
  totalEntriesCount?: number
  entriesCount?: number
  entries?: unknown[]
}

// Asset directory mapping
export interface AssetDirMapping {
  directory?: string
  type?: string[]
  description?: string
  jansServiceModule?: string[]
}

// API Error interface
export interface ApiError {
  code?: string
  message?: string
  description?: string
}

// Options for getting all assets
export interface GetAllAssetsOptions {
  limit?: number
  pattern?: string
  status?: string
  startIndex?: number
  sortBy?: string
  sortOrder?: 'ascending' | 'descending'
  fieldValuePair?: string
}

// Asset form data for create/update operations
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

// Asset create payload
export interface CreateAssetPayload {
  payload: {
    action: {
      action_data: AssetFormData
    }
  }
}

// Asset update payload
export interface UpdateAssetPayload {
  payload: {
    action: {
      action_data: AssetFormData
    }
  }
}

// Interface for the underlying JansAssetsApi
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

// Generic API response wrapper
export interface ApiResponse<T = unknown> {
  data?: T
  error?: ApiError
  status?: number
}

// Asset state interfaces for Redux
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

// Action payload interfaces
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

// Error handling interface for sagas
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
