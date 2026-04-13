export type SsaAuthState = {
  token: {
    access_token: string
  }
  userinfo: {
    inum?: string
    name?: string
  }
  config: {
    clientId: string
  }
  location?: {
    IPv4?: string
  }
}

export type SsaAuditRootState = {
  authReducer: SsaAuthState
}

export type SsaAuditParams = {
  action: string
  resource: string
  message: string
  payload?: object | string | number | boolean | null
}
