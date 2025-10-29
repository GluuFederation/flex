/**
 * Shared types for the Schema plugin
 */

/**
 * Root state interface for accessing auth reducer across components
 */
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

/**
 * Auth state extracted from Redux store
 */
export interface AuthState {
  token?: string
  userinfo?: {
    name?: string
    inum?: string
  }
  clientId?: string
  ipAddress?: string
}
