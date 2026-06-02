import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { BackendStatus, UserInfo, Config, AuthState } from './types/authTypes'
import type { ApiTokenPayload, PutConfigMeta } from './types'

const initialState: AuthState = {
  isAuthenticated: false,
  userinfo: null,
  userinfo_jwt: null,
  issuer: null,
  permissions: [],
  location: {},
  config: {},
  backendStatus: {
    active: true,
    errorMessage: null,
    statusCode: null,
  },
  loadingConfig: false,
  idToken: null,
  jwtToken: null,
  userInum: null,
  isUserInfoFetched: false,
  hasSession: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    getOAuth2Config: (_state, _action: PayloadAction<ApiTokenPayload | undefined>) => {},
    setBackendStatus: (state, action: PayloadAction<BackendStatus>) => {
      state.backendStatus.active = action.payload.active
      state.backendStatus.errorMessage = action.payload.errorMessage
      state.backendStatus.statusCode = action.payload.statusCode
    },
    getOAuth2ConfigResponse: (state, action: PayloadAction<{ config?: Config }>) => {
      if (action.payload?.config) {
        state.config = { ...state.config, ...action.payload.config }
      }
    },
    setAuthState: (state, action: PayloadAction<{ state: boolean }>) => {
      state.isAuthenticated = action.payload?.state
    },
    getUserInfoResponse: (
      state,
      action: PayloadAction<{
        ujwt?: string
        userinfo?: UserInfo
        idToken?: string
        jwtToken?: string
        isUserInfoFetched?: boolean
      }>,
    ) => {
      if (action.payload?.ujwt) {
        state.userinfo = action.payload.userinfo ?? null
        state.userinfo_jwt = action.payload.ujwt
        state.idToken = action.payload.idToken ?? null
        state.jwtToken = action.payload.jwtToken ?? null
        state.isUserInfoFetched = action.payload.isUserInfoFetched ?? false
        state.isAuthenticated = true
        state.userInum = action.payload?.userinfo?.inum ?? null
      } else {
        state.isAuthenticated = true
      }
    },
    getAPIAccessToken: (_state, _action: PayloadAction<string | null>) => {},
    getAPIAccessTokenResponse: (
      state,
      action: PayloadAction<{ scopes?: string[]; issuer?: string }>,
    ) => {
      if (action.payload?.issuer) {
        state.issuer = action.payload.issuer
      }
      if (action.payload?.scopes) {
        state.permissions = action.payload.scopes
      }
      state.isAuthenticated = true
    },
    setApiDefaultToken: (state, action: PayloadAction<ApiTokenPayload>) => {
      if (action.payload?.issuer) {
        state.issuer = action.payload.issuer
      }
    },
    putConfigWorker: (state, _action: PayloadAction<Config & { _meta?: PutConfigMeta }>) => {
      state.loadingConfig = true
    },
    putConfigWorkerResponse: (state) => {
      state.loadingConfig = false
    },
    createAdminUiSession: (
      _state,
      _action: PayloadAction<{ ujwt: string; apiProtectionToken: string }>,
    ) => {},
    createAdminUiSessionResponse: (
      state,
      action: PayloadAction<{ success: boolean; error?: string }>,
    ) => {
      if (action.payload?.success) {
        state.hasSession = true
      }
    },
  },
})

export const {
  getOAuth2Config,
  getOAuth2ConfigResponse,
  setAuthState,
  getUserInfoResponse,
  getAPIAccessToken,
  getAPIAccessTokenResponse,
  setApiDefaultToken,
  setBackendStatus,
  putConfigWorker,
  putConfigWorkerResponse,
  createAdminUiSession,
  createAdminUiSessionResponse,
} = authSlice.actions
export default authSlice.reducer
reducerRegistry.register('authReducer', authSlice.reducer)
