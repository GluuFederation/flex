import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  acrs: [
    {
      name: 'simple_password_auth',
      level: '-1',
      description: 'Basic default password authentication',
      samlACR: 'urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport',
      primaryKey: 'uid',
      passwordAttribute: 'userPassword',
      hashAlgorithm: 'bcrypt',
      defaultAuthNMethod: false,
      acrName: 'simple_password_auth',
    },
  ],
  item: {},
  loading: false,
  acrAUTHReponse: {},
  isSuccess: false,
}

const authNSlice = createSlice({
  name: 'authN',
  initialState,
  reducers: {
    getDefaultAuthn: (state) => {
      state.loading = true
    },
    setCurrentItem: (state, action) => {
      state.item = action.payload?.item
    },
    setSimpleAuthAcrResponse: (state, action) => {
      state.loading = false
      if (action.payload?.data) {
        state.acrAUTHReponse = action.payload.data
      }
    },
    setLDAPAuthAcrResponse: (state, action) => {
      state.loading = false
      if (action.payload?.data) {
        state.acrAUTHReponse = action.payload.data
      }
    },
    setScriptAuthAcrResponse: (state, action) => {
      state.loading = false
      if (action.payload?.data) {
        state.acrAUTHReponse = action.payload.data
      }
    },
    editSimpleAuthAcr: (state) => {
      state.loading = true
    },
    editLDAPAuthAcr: (state) => {
      state.loading = true
    },
    editScriptAuthAcr: (state) => {
      state.loading = true
    },
    setSuccess: (state, action) => {
      state.isSuccess = action.payload?.data
    },
  },
})

export const {
  getDefaultAuthn,
  setCurrentItem,
  setSimpleAuthAcrResponse,
  setLDAPAuthAcrResponse,
  setScriptAuthAcrResponse,
  editSimpleAuthAcr,
  editLDAPAuthAcr,
  editScriptAuthAcr,
  setSuccess,
} = authNSlice.actions
export const { actions, reducer, state } = authNSlice
reducerRegistry.register('authNReducer', reducer)
