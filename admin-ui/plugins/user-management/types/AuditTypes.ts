import type { CustomUser } from './UserApiTypes'

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
