import type { AuditRecord } from './common'

export interface AuditLog {
  headers: Record<string, string>
  client_id?: string
  ip_address?: string
  status?: string
  performedBy?: {
    user_inum: string
    userId: string
  }
  action?: string
  resource?: string
  message?: string
  modifiedFields?: AuditRecord
  performedOn?: string | Date
  payload?: AuditRecord
  date?: Date
}
