export interface BackendStatus {
  active: boolean
  errorMessage: string | null
  statusCode: number | null
}

export interface UserInfo {
  inum?: string
  user_name?: string
  name?: string
  given_name?: string
  family_name?: string
  [key: string]: string | string[] | number | boolean | undefined | null
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
  jwtToken: string | null
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
