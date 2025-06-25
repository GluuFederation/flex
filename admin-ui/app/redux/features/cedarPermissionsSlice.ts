import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import reducerRegistry from '../reducers/ReducerRegistry'
import type { CedarPermissionsState, SetCedarlingPermissionPayload } from '../../cedarling/types'

const initialState: CedarPermissionsState = {
  permissions: {},
  loading: false,
  error: null,
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
  },
})

reducerRegistry.register('cedarPermissions', cedarPermissionsSlice.reducer)
export const { setCedarlingPermission } = cedarPermissionsSlice.actions
export default cedarPermissionsSlice.reducer
