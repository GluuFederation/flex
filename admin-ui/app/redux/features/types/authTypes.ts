export type BackendStatus = {
  active: boolean
  errorMessage: string | null
  statusCode: number | null
}

export type UserInfo = {
  inum?: string
  user_name?: string
  name?: string
  given_name?: string
  family_name?: string
  [key: string]: string | string[] | number | boolean | undefined | null
}

type ConfigValue = string | number | boolean | null | object | undefined

export type Config = {
  [key: string]: ConfigValue
}

export type Location = {
  [key: string]: string | number | null | undefined
}

export type AuthState = {
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
