// Define types for the audit log structure
export interface PerformedBy {
  user_inum: string
  userId: string
}

export interface AuditLogHeaders {
  Authorization?: string
  [key: string]: any
}

export interface AuditLog {
  headers: AuditLogHeaders
  client_id?: string
  ip_address?: string
  status?: string
  performedBy?: PerformedBy
  [key: string]: any
}

// Define types for Redux state structure
export interface AuthState {
  config: {
    clientId: string
  }
  location: {
    IPv4: string
  }
  userinfo?: {
    name: string
    inum: string
  }
  token: {
    access_token: string
  }
  userinfo_jwt: string | null
  issuer: string
}

export interface RootState {
  authReducer: AuthState
}
