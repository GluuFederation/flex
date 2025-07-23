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
  action_data?: unknown
  [key: string]: unknown
}

export interface RootState {
  assetReducer: AssetReducerState
  cedarPermissions: CedarPermissionsState
}
