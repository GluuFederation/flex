import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface BackendStatus {
  active: boolean
  errorMessage: string | null
  statusCode: number | null
}

interface Token {
  access_token: string
  scopes: string[]
}

interface UserInfo {
  // Define userinfo properties as needed, using 'any' for now
  [key: string]: any
}

interface Config {
  [key: string]: any
}

interface Location {
  [key: string]: any
}

interface AuthState {
  isAuthenticated: boolean
  userinfo: UserInfo | null
  userinfo_jwt: string | null
  token: Token | null
  idToken: string | null
  JwtToken: string | null
  issuer: string | null
  permissions: string[]
  location: Location
  config: Config
  defaultToken: any
  codeChallenge: string | null
  codeChallengeMethod: string
  codeVerifier: string | null
  backendStatus: BackendStatus
  loadingConfig: boolean
  authState?: any
}

const initialState: AuthState = {
  isAuthenticated: false,
  userinfo: null,
  userinfo_jwt: null,
  token: null,
  issuer: null,
  permissions: [],
  location: {},
  config: {},
  defaultToken: null,
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
  JwtToken: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    getOAuth2Config: (state, action: PayloadAction<any>) => {
      state.defaultToken = action.payload
    },
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
    setOAuthState: (state, action: PayloadAction<{ authState: any }>) => {
      state.authState = action.payload?.authState
    },
    setAuthState: (state, action: PayloadAction<{ state: boolean }>) => {
      state.isAuthenticated = action.payload?.state
    },
    getUserInfo: (state, _action: PayloadAction<any>) => {},
    getUserInfoResponse: (
      state,
      action: PayloadAction<{
        ujwt?: string
        userinfo?: UserInfo
        idToken?: string
        JwtToken?: string
      }>,
    ) => {
      if (action.payload?.ujwt) {
        state.JwtToken = action.payload.JwtToken ?? null
        state.userinfo = action.payload.userinfo ?? null
        state.userinfo_jwt = action.payload.ujwt
        state.idToken = action.payload.idToken ?? null
        state.isAuthenticated = true
      } else {
        state.isAuthenticated = true
      }
    },
    getAPIAccessToken: (state, _action: PayloadAction<any>) => {},
    getAPIAccessTokenResponse: (
      state,
      action: PayloadAction<{ access_token?: string; scopes?: string[]; issuer?: string }>,
    ) => {
      if (action.payload?.access_token) {
        state.token = {
          access_token: action.payload.access_token,
          scopes: action.payload.scopes || [],
        }
        state.issuer = action.payload.issuer || null
        state.permissions = action.payload.scopes || []
        state.isAuthenticated = true
      }
    },
    getUserLocation: (state, _action: PayloadAction<any>) => {},
    getUserLocationResponse: (state, action: PayloadAction<{ location?: Location }>) => {
      if (action.payload?.location) {
        state.location = action.payload.location
      }
    },
    setApiDefaultToken: (state, action: PayloadAction<any>) => {
      state.defaultToken = action.payload
      state.issuer = action.payload.issuer
    },
    putConfigWorker: (
      state,
      action: PayloadAction<{
        sessionTimeoutInMins?: number
        acrValues?: string
        cedarlingLogType?: any
        allowSmtpKeystoreEdit?: boolean
      }>,
    ) => {
      state.loadingConfig = true
    },
    putConfigWorkerResponse: (state) => {
      state.loadingConfig = false
    },
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
} = authSlice.actions
export default authSlice.reducer
reducerRegistry.register('authReducer', authSlice.reducer)
