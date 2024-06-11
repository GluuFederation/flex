import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loading: true,
  configuration: null,
}

const configApiSlice = createSlice({
  name: 'config_api',
  initialState,
  reducers: {
    getConfigApiConfiguration: (state) => {
      state.loading = true
    },
    getConfigApiConfigurationResponse: (state, action) => {
      state.loading = false
      const data = action.payload ? { ...action.payload } : null
      if (data) {
        delete data?.apiProtectionType
        delete data?.apiClientId
        delete data?.apiClientPassword
        delete data?.endpointInjectionEnabled
        delete data?.authIssuerUrl
        delete data?.authOpenidConfigurationUrl
        delete data?.authOpenidIntrospectionUrl
        delete data?.authOpenidTokenUrl
        delete data?.authOpenidRevokeUrl
        delete data?.exclusiveAuthScopes
        delete data?.corsConfigurationFilters
      }
      state.configuration = data
    },
    patchApiConfigConfiguration: (state) => {
      state.loading = true
    },
  },
})

export const {
  getConfigApiConfiguration,
  getConfigApiConfigurationResponse,
  patchApiConfigConfiguration,
} = configApiSlice.actions
export const { actions, reducer, state } = configApiSlice
export default reducer
reducerRegistry.register('configApiReducer', reducer)
