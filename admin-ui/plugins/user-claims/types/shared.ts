export interface SchemaPluginRootState {
  authReducer: {
    config?: {
      clientId?: string
    }
    token?: {
      access_token?: string
    }
    userinfo?: {
      name?: string
      inum?: string
    }
    location?: {
      IPv4?: string
    }
  }
}

export interface AuthState {
  token?: string
  userinfo?: {
    name?: string
    inum?: string
  }
  clientId?: string
  ipAddress?: string
}
