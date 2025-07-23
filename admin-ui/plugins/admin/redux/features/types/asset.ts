// Type definitions for Asset functionality
import { Asset } from '../../../components/Assets/types/Asset'

export interface AssetData {
  entries: Asset[]
  totalEntriesCount: number
  entriesCount: number
}

export interface AssetState {
  assets: Asset[]
  services: string[]
  fileTypes: string[]
  loading: boolean
  saveOperationFlag: boolean
  errorInSaveOperationFlag: boolean
  totalItems: number
  entriesCount: number
  selectedAsset: Asset | Record<string, unknown>
  loadingAssets: boolean
  assetModal: boolean
  showErrorModal: boolean
}
