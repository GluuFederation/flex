import type { AdditionalPayload } from 'Utils/TokenController'
import { Document, AssetFormData } from '../../../components/Assets/types/AssetApiTypes'

export type AssetAuditPayload = AdditionalPayload & {
  action?: {
    action_data?: AssetFormData
    action_message?: string
  }
}

export type AssetState = {
  loading: boolean
  saveOperationFlag: boolean
  errorInSaveOperationFlag: boolean
  selectedAsset: Document | Record<string, never>
}

export type AssetResponsePayload = {
  data?: Document | null
}

export type CreateAssetSagaPayload = {
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

export type CreateAssetActionPayload = {
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

export type UpdateAssetSagaPayload = {
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

export type UpdateAssetActionPayload = {
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
