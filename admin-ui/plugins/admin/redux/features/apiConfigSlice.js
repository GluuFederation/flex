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
}

const apiConfigSlice = createSlice({
  name: 'apiConfig',
  initialState,
  reducers: {
    editConfig: (state, data) => {
      if (data) {
        state.items = { ...state.items, ...data }
      }
    },
  },
})

export const { editConfig } = apiConfigSlice.actions
export const { actions, reducer, state } = apiConfigSlice
reducerRegistry.register('apiConfigReducer', reducer)
