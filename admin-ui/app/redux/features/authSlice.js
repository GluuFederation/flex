import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isAuthenticated: false,
  userinfo: null,
  userinfo_jwt: null,
  token: null,
  issuer: null,
  permissions: [],
  location: {},
  config: {},
  backendIsUp: true,
  defaultToken: null,
  codeChallenge: null,
  codeChallengeMethod: 'S256',
  codeVerifier: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    getOAuth2Config: (state, action) => {
      state.defaultToken = action.payload
    },
    getOAuth2ConfigResponse: (state, action) => {
      if (action.payload?.config && action.payload?.config !== -1) {
        const newDataConfigObject = { ...state.config, ...action.payload.config }
        state.config = newDataConfigObject
        state.backendIsUp = true
      } else {
        state.backendIsUp = false
      }
    },
    setOAuthState: (state, action) => {
      state.authState = action.payload?.authState
    },
    setAuthState: (state, action) => {
      state.isAuthenticated = action.payload?.state
    },
    getUserInfo: (state, action) => {},
    getUserInfoResponse: (state, action) => {
      if (action.payload?.ujwt) {
        state.userinfo = action.payload.userinfo
        state.userinfo_jwt = action.payload.ujwt
        state.isAuthenticated = true
      } else {
        state.isAuthenticated = true
      }
    },
    getAPIAccessToken: (state, action) => {},
    getAPIAccessTokenResponse: (state, action) => {
      if (action.payload?.access_token) {
        state.token = { access_token: action.payload.access_token, scopes: action.payload.scopes }
        state.issuer = action.payload.issuer
        state.permissions = action.payload.scopes
        state.isAuthenticated = true
      }
    },
    getUserLocation: (state, action) => {},
    getUserLocationResponse: (state, action) => {
      if (action.payload?.location) {
        state.location = action.payload.location
      }
    },
    setApiDefaultToken: (state, action) => {
      state.defaultToken = action.payload
      state.issuer = action.payload.issuer
    },
  }
})

export const {
  getOAuth2Config,
  getOAuth2ConfigResponse,
  setOAuthState,
  setAuthState,
  getUserInfo,
  getUserInfoResponse,
  getAPIAccessToken,
  getAPIAccessTokenResponse,
  getUserLocation,
  getUserLocationResponse,
  setApiDefaultToken,
} = authSlice.actions
export default authSlice.reducer
reducerRegistry.register('authReducer', authSlice.reducer)
