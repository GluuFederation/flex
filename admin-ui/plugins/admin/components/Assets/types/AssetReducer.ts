import { Asset } from './Asset'

export interface AssetReducerState {
  totalItems: number
  assets: Asset[]
  services: string[]
  fileTypes: string[]
  loading: boolean
  saveOperationFlag: boolean
  errorInSaveOperationFlag: boolean
  entriesCount: number
  selectedAsset: Asset | null
  loadingAssets: boolean
  assetModal: boolean
  showErrorModal: boolean
}
