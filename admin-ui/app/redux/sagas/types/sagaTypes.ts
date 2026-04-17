import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type { WebhookSliceState } from 'Plugins/admin/redux/features/WebhookSlice'

export type AuditRecord = Record<
  string,
  JsonValue | Date | PerformedBy | AuditLogHeaders | undefined
>

export type SagaActionPayload = {
  action: {
    action_data?: Record<string, JsonValue>
  }
  options?: Record<string, JsonValue>
}

export type HttpErrorLike = {
  response?: { status?: number }
  status?: number
}

export type PerformedBy = {
  user_inum: string
  userId: string
}

export type AuditLogHeaders = {
  Authorization?: string
  [key: string]: string | undefined
}

export type AuditLog = AuditRecord & {
  headers?: AuditLogHeaders
  client_id?: string
  ip_address?: string
  status?: string
  performedBy?: PerformedBy
  action?: string
  resource?: string
  payload?: Record<string, JsonValue>
}

export type AuthReducerShape = {
  hasSession?: boolean
  jwtToken?: string | null
  idToken?: string | null
  userinfo_jwt?: string | null
}

export type AuthState = {
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

export type RootState = {
  authReducer: AuthState
  webhookReducer: WebhookSliceState
}

export type SagaError = {
  response?: {
    status?: number
    body?: { responseMessage?: string }
  }
  message?: string
}

export type ApiErrorLike = {
  response?: { data?: { responseMessage?: string; message?: string }; status?: number }
  message?: string
}
