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
    editConfig: (state, action) => {
      if (action.payload) {
        state.items = { ...state.items, ...action.payload }
      }
    },
  },
})

export const { editConfig } = apiConfigSlice.actions
export const { actions, reducer } = apiConfigSlice
