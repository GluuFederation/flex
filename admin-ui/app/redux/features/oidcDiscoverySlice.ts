// @ts-nocheck
import { createSlice } from '@reduxjs/toolkit'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'

const initialState = {
  configuration: {},
  loading: false
}

const oidcDiscoverySlice = createSlice({
  name: 'oidcDiscovery',
  initialState,
  reducers: {
    getOidcDiscovery: (state) => {
      state.loading = true
    },
    getOidcDiscoveryResponse: (state, action) => {
      state.loading = false
      const { configuration } = action.payload
      if (configuration) {
        state.configuration = configuration
      }
    }
  }
})

export const { getOidcDiscovery, getOidcDiscoveryResponse } =
  oidcDiscoverySlice.actions

export default oidcDiscoverySlice.reducer
reducerRegistry.register('oidcDiscoveryReducer', oidcDiscoverySlice.reducer)
