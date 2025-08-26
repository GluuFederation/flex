import { AssetState } from '../../../redux/features/types/asset'

export interface RootState {
  assetReducer: AssetState
  cedarPermissions: {
    permissions: string[]
  }
}

export interface SearchEvent {
  target: {
    name: string
    value: string | number
  }
  keyCode?: number
}
