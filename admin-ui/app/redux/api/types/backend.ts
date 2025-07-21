export interface ServerConfigurationPayload {
  token: string
  props: any
}

export interface UserInfoRequest {
  userInfoEndpoint: string
  token_type: string
  access_token: string
}

export interface UserActionPayload {
  headers?: {
    Authorization?: string
    [key: string]: any
  }
  [key: string]: any
}

export interface ApiTokenRequest {
  ujwt?: string
  permissionTag?: string[]
}
