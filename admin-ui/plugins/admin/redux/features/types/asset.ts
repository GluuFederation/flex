// Type definitions for Asset functionality

export interface Asset {
  id?: string
  name: string
  type: string
  service: string
  content?: string
  // Add other asset properties as needed
}

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
  selectedAsset: Asset | {}
  loadingAssets: boolean
  assetModal: boolean
  showErrorModal: boolean
}
