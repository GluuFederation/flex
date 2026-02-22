import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type { WebhookSliceState } from 'Plugins/admin/redux/features/WebhookSlice'

export type AuditRecord = Record<string, string | number | boolean | object | null | undefined>

export interface HttpErrorLike {
  response?: { status?: number }
  status?: number
}

export interface PerformedBy {
  user_inum: string
  userId: string
}

export interface AuditLogHeaders {
  Authorization?: string
  [key: string]: string | undefined
}

export interface AuditLog {
  headers?: AuditLogHeaders
  client_id?: string
  ip_address?: string
  status?: string
  performedBy?: PerformedBy
  action?: string
  resource?: string
  payload?: Record<string, JsonValue>
}

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
  userinfo_jwt: string | null
  issuer: string
  hasSession: boolean
  jwtToken: string | null
}

export interface RootState {
  authReducer: AuthState
  webhookReducer: WebhookSliceState
}

export interface SagaError {
  response?: {
    status?: number
    body?: { responseMessage?: string }
  }
  message?: string
}
