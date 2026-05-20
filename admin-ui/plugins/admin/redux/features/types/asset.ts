import type { AdditionalPayload } from 'Utils/TokenController'
import { Document, AssetFormData } from '../../../components/Assets/types/AssetApiTypes'

export interface AssetAuditPayload extends AdditionalPayload {
  action?: {
    action_data?: AssetFormData
    action_message?: string
  }
}

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
}

export interface AssetResponsePayload {
  data?: Document | null
}

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
