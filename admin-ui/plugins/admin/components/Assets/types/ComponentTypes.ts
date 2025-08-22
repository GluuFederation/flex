// Component-specific types for Asset components

import { AssetState } from '../../../redux/features/types/asset'

// Root state interface for Redux selectors
export interface RootState {
  assetReducer: AssetState
  cedarPermissions: {
    permissions: string[]
  }
}

// Interface for advanced search event
export interface SearchEvent {
  target: {
    name: string
    value: string | number
  }
  keyCode?: number
}
