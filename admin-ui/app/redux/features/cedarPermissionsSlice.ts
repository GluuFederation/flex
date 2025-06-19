import { createSlice } from '@reduxjs/toolkit'
import reducerRegistry from '../reducers/ReducerRegistry'

const initialState = {
  permissions: {},
  loading: false,
  error: null,
}

const cedarPermissionsSlice = createSlice({
  name: 'cedarPermissions',
  initialState,
  reducers: {
    setCedarlingPermission: (state, action) => {
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
