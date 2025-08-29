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
  modifiedFields?: Record<string, unknown>
  performedOn?: string | Date
  payload?: Record<string, unknown>
  date?: Date
}
