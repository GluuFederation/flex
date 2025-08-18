// Type definitions for Asset functionality
import {
  Document,
  DocumentPagedResult,
  AssetDirMapping,
} from '../../../components/Assets/types/AssetApiTypes'

// Redux state interface for assets
export interface AssetState {
  assets: Document[]
  services: string[]
  fileTypes: string[]
  loading: boolean
  saveOperationFlag: boolean
  errorInSaveOperationFlag: boolean
  totalItems: number
  entriesCount: number
  selectedAsset: Document | Record<string, never>
  loadingAssets: boolean
  assetModal: boolean
  showErrorModal: boolean
}

// Action payload interfaces
export interface AssetActionPayload {
  action?: {
    action_data?: unknown
    [key: string]: unknown
  }
  [key: string]: unknown
}

export interface AssetResponsePayload {
  data?: DocumentPagedResult | Document[] | string[] | Document | null
}

export interface SetSelectedAssetPayload {
  payload: Document | Record<string, never>
}

export interface SetModalPayload {
  payload: boolean
}

// Saga specific types
export interface CreateAssetSagaPayload {
  payload: {
    action: {
      action_data: Document & {
        fileName: string
        description: string
        document: string | File | Blob
        service?: string
        enabled: boolean
      }
    }
  }
}

// Action payload types (for Redux action creators)
export interface CreateAssetActionPayload {
  action: {
    action_data: Document & {
      fileName: string
      description: string
      document: string | File | Blob
      service?: string
      enabled: boolean
    }
  }
}

export interface UpdateAssetSagaPayload {
  payload: {
    action: {
      action_data: Document & {
        fileName: string
        description: string
        document: string | File | Blob
        service?: string
        enabled: boolean
        inum: string
      }
    }
  }
}

export interface UpdateAssetActionPayload {
  action: {
    action_data: Document & {
      fileName: string
      description: string
      document: string | File | Blob
      service?: string
      enabled: boolean
      inum: string
    }
  }
}

export interface DeleteAssetSagaPayload {
  action_message?: string
  action: {
    action_data: {
      inum: string
    }
  }
}

export interface GetAssetsSagaPayload {
  payload?: {
    action?: {
      limit?: number
      pattern?: string
      status?: string
      startIndex?: number
      sortBy?: string
      sortOrder?: 'ascending' | 'descending'
      fieldValuePair?: string
    }
  }
}

// Service and types response interfaces
export interface AssetServicesResponse {
  data?: string[]
}

export interface AssetTypesResponse {
  data?: string[]
}

// Asset directory mapping response
export interface AssetDirMappingResponse {
  data?: AssetDirMapping[]
}
