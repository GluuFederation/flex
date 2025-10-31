import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: {
    authServerHost: '',
    authzBaseUrl: '',
    clientId: '',
    responseType: '',
    scope: '',
    redirectUrl: '',
    acrValues: '',
    frontChannelLogoutUrl: '',
    postLogoutRedirectUri: '',
    endSessionEndpoint: '',
    sessionTimeoutInMins: 0,
    allowSmtpKeystoreEdit: true,
    additionalParameters: [
      {
        key: '',
        value: '',
      },
    ],
    cedarlingLogType: 'off',
    auiPolicyStoreUrl: '',
    auiDefaultPolicyStorePath: '',
    useRemotePolicyStore: true,
  },
  policyStore: {},
  loading: false,
}

const apiConfigSlice = createSlice({
  name: 'apiConfig',
  initialState,
  reducers: {
    getConfig: (state) => {
      state.loading = true
    },
    getConfigResponse: (state, action) => {
      state.loading = false
      if (action.payload?.data) {
        state.items = action.payload.data
      }
    },
    getPolicyStore: (state) => {
      state.loading = true
    },
    getPolicyStoreResponse: (state, action) => {
      state.loading = false
      if (action.payload?.data) {
        state.policyStore = action.payload.data.responseObject
      }
    },
    editConfig: (state) => {
      state.loading = true
    },
    editConfigResponse: (state, action) => {
      state.loading = false
      if (action.payload?.data) {
        state.items = { ...state.items }
      }
    },
    updateSyncRoleScopesMapping: (state, action) => {
      state.loading = true
    },
    updateSyncRoleScopesMappingResponse: (state, action) => {
      state.loading = false
      if (action.payload?.data) {
        state.items = { ...state.items }
      }
    },
    setCurrentItem: (state, action) => {
      state.item = action.payload.item
      state.loading = false
    },
  },
})

export const {
  getConfig,
  getConfigResponse,
  editConfig,
  editConfigResponse,
  updateSyncRoleScopesMapping,
  updateSyncRoleScopesMappingResponse,
  setCurrentItem,
} = apiConfigSlice.actions
export const { actions, reducer, state } = apiConfigSlice
reducerRegistry.register('apiConfigReducer', reducer)
