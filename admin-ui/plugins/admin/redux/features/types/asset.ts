// Type definitions for Asset functionality
import type { AdditionalPayload } from 'Utils/TokenController'
import {
  Document,
  DocumentPagedResult,
  AssetDirMapping,
  AssetFormData,
} from '../../../components/Assets/types/AssetApiTypes'

/** Payload for asset audit logging - types action_data as AssetFormData */
export interface AssetAuditPayload extends AdditionalPayload {
  action?: {
    action_data?: AssetFormData
    action_message?: string
  }
}

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
    action_data?: AssetFormData
    [key: string]: string | number | boolean | object | AssetFormData | undefined
  }
  [key: string]: string | number | boolean | object | AssetFormData | undefined
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
