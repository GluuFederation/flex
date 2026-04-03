import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

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
  [key: string]: JsonValue | undefined
}

export interface Location {
  [key: string]: string | number | null | undefined
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
  authState?: string
  userInum?: string | null
  isUserInfoFetched: boolean
  hasSession: boolean
}
