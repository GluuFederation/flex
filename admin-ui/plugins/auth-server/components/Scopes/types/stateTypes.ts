export type ScopeAuthUserInfo = {
  inum: string
  name?: string
}

export type ScopeAuthState = {
  token?: {
    access_token: string
  }
  config?: {
    clientId: string
  }
  userinfo?: ScopeAuthUserInfo
}

export type ScopeRootState = {
  authReducer: ScopeAuthState
}
