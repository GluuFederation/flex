import type { CustomUser } from './UserApiTypes'

export type AuditLog = {
  client_id?: string
  ip_address?: string
  status?: string
  performedBy?: {
    user_inum: string
    userId: string
  }
  message?: string
}

export type AuditPayload = CustomUser & {
  modifiedFields?: Record<string, string | string[] | boolean>
  performedOn?: {
    user_inum?: string
    userId?: string
  }
  action_message?: string
  message?: string
  userPassword?: string
  userConfirmPassword?: string
  jsonPatchString?: string
}

export type ErrorResponse = {
  response?: {
    status?: number
    data?: {
      message?: string
      description?: string
      error_description?: string
    }
    body?: {
      description?: string
      message?: string
      error_description?: string
    }
    text?: string
  }
  message?: string
}
