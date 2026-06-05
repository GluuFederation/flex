import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

type PerformedBy = {
  user_inum: string
  userId: string
}

type AuditLogHeaders = {
  Authorization?: string
  [key: string]: string | undefined
}

export type AuditRecord = Record<
  string,
  JsonValue | Date | PerformedBy | AuditLogHeaders | undefined
>

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

export type HttpErrorLike = {
  response?: { status?: number }
  status?: number
}

export type ApiErrorLike = {
  response?: { data?: { responseMessage?: string; message?: string }; status?: number }
  message?: string
}
