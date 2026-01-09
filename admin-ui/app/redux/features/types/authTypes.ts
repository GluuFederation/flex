export interface BackendStatus {
  active: boolean
  errorMessage: string | null
  statusCode: number | null
}

export interface UserInfo {
  // Define userinfo properties as needed, using 'any' for now
  [key: string]: any
}

export interface Config {
  [key: string]: any
}

export interface Location {
  [key: string]: any
}

export interface AuthState {
  isAuthenticated: boolean
  userinfo: UserInfo | null
  userinfo_jwt: string | null
  idToken: string | null
  JwtToken: string | null
  issuer: string | null
  permissions: string[]
  location: Location
  config: Config
  codeChallenge: string | null
  codeChallengeMethod: string
  codeVerifier: string | null
  backendStatus: BackendStatus
  loadingConfig: boolean
  authState?: any
  userInum?: string | null
  isUserInfoFetched: boolean
  hasSession: boolean
}
