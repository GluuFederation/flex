import { AssetReducerState } from './AssetReducer'
import { CedarPermissionsState } from './Cedar'

export interface ActionOptions {
  limit?: number
  pattern?: string | null
  startIndex?: number
}

export interface SearchEvent {
  target: {
    name: string
    value: string | number
  }
}

export interface UserAction {
  action_message?: string
  action_data?: any
  [key: string]: any
}

export interface RootState {
  assetReducer: AssetReducerState
  cedarPermissions: CedarPermissionsState
}
