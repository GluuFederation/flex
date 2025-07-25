import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import reducerRegistry from '../reducers/ReducerRegistry'
import type { CedarPermissionsState, SetCedarlingPermissionPayload } from '../../cedarling/types'

const initialState: CedarPermissionsState = {
  permissions: {},
  loading: false,
  error: null,
  initialized: null,
  isInitializing: false,
  cedarFailedStatusAfterMaxTries: null,
}

const cedarPermissionsSlice = createSlice({
  name: 'cedarPermissions',
  initialState,
  reducers: {
    setCedarlingPermission: (state, action: PayloadAction<SetCedarlingPermissionPayload>) => {
      const { url, isAuthorized } = action.payload
      state.permissions[url] = isAuthorized
      state.loading = false
      state.error = null
    },
    setCedarlingInitialized: (state, action: PayloadAction<boolean>) => {
      state.initialized = action.payload
      state.isInitializing = false
    },
    setCedarlingInitializing: (state, action: PayloadAction<boolean>) => {
      state.isInitializing = action.payload
    },
    setCedarFailedStatusAfterMaxTries: (state) => {
      state.cedarFailedStatusAfterMaxTries = true
    },
  },
})

reducerRegistry.register('cedarPermissions', cedarPermissionsSlice.reducer)
export const {
  setCedarlingPermission,
  setCedarlingInitialized,
  setCedarlingInitializing,
  setCedarFailedStatusAfterMaxTries,
} = cedarPermissionsSlice.actions
export default cedarPermissionsSlice.reducer
