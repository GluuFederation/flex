// Asset-related type definitions

export interface AssetReducerState {
  loading: boolean
  assets: any[]
  services: string[]
  fileTypes: any[]
  saveOperationFlag: boolean
  errorInSaveOperationFlag: boolean
  totalItems: number
  entriesCount: number
  selectedAsset: any
  loadingAssets: boolean
  assetModal: boolean
  showErrorModal: boolean
}

export interface RootState {
  assetReducer: AssetReducerState
} 