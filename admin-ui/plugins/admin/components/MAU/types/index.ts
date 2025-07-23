// Type definitions for MAU components

export interface MauStatEntry {
  month: number
  mau: number
  client_credentials_access_token_count: number
  authz_code_access_token_count: number
  authz_code_idtoken_count: number
}

export interface MauState {
  stat: MauStatEntry[]
  loading: boolean
  startMonth: string
  endMonth: string
}

export interface AuthState {
  permissions: string[]
  isAuthenticated: boolean
  userinfo: any
  userinfo_jwt: string | null
  token: { access_token: string; scopes: string[] } | null
  issuer: string | null
  location: Record<string, any>
  config: Record<string, any>
  defaultToken: any
  codeChallenge: string | null
  codeChallengeMethod: string
  codeVerifier: string | null
  backendStatus: {
    active: boolean
    errorMessage: string | null
    statusCode: number | null
  }
  loadingConfig: boolean
  idToken: string | null
  JwtToken: string | null
  authState?: any
}

export interface RootState {
  mauReducer: MauState
  authReducer: AuthState
}

export interface UserAction {
  action_message?: string
  action_data?: Record<string, any>
  [key: string]: any
}
