import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { BackendStatus, UserInfo, Config, Location, AuthState } from './types/authTypes'

interface ApiTokenPayload {
  access_token?: string
  issuer?: string
  scopes?: string[]
}

interface PutConfigMeta {
  cedarlingLogTypeChanged?: boolean
  toastMessage?: string
}

const initialState: AuthState = {
  isAuthenticated: false,
  userinfo: null,
  userinfo_jwt: null,
  issuer: null,
  permissions: [],
  location: {},
  config: {},
  codeChallenge: null,
  codeChallengeMethod: 'S256',
  codeVerifier: null,
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
    // Saga trigger action
    getOAuth2Config: (_state, _action: PayloadAction<ApiTokenPayload | undefined>) => {},
    setBackendStatus: (state, action: PayloadAction<BackendStatus>) => {
      state.backendStatus.active = action.payload.active
      state.backendStatus.errorMessage = action.payload.errorMessage
      state.backendStatus.statusCode = action.payload.statusCode
    },
    getOAuth2ConfigResponse: (state, action: PayloadAction<{ config?: Config }>) => {
      if (action.payload?.config) {
        const newDataConfigObject = { ...state.config, ...action.payload.config }
        state.config = newDataConfigObject
      }
    },
    setOAuthState: (state, action: PayloadAction<{ authState: string | null }>) => {
      state.authState = action.payload?.authState
    },
    setAuthState: (state, action: PayloadAction<{ state: boolean }>) => {
      state.isAuthenticated = action.payload?.state
    },
    getUserInfo: (_state, _action: PayloadAction<void>) => {},
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
      state.issuer = action.payload?.issuer || null
      state.permissions = action.payload?.scopes || []
      state.isAuthenticated = true
    },
    getUserLocation: (_state, _action: PayloadAction<void>) => {},
    getUserLocationResponse: (state, action: PayloadAction<{ location?: Location }>) => {
      if (action.payload?.location) {
        state.location = action.payload.location
      }
    },
    setApiDefaultToken: (state, action: PayloadAction<ApiTokenPayload>) => {
      state.issuer = action.payload?.issuer || null
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
    deleteAdminUiSession: (_state) => {},
    deleteAdminUiSessionResponse: () => initialState,
  },
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
  setBackendStatus,
  putConfigWorker,
  putConfigWorkerResponse,
  createAdminUiSession,
  createAdminUiSessionResponse,
  deleteAdminUiSession,
  deleteAdminUiSessionResponse,
} = authSlice.actions
export default authSlice.reducer
reducerRegistry.register('authReducer', authSlice.reducer)
