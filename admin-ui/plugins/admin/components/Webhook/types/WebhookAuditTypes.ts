import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type { CREATE, UPDATE, DELETION, FETCH } from '@/audit/UserActionType'
import type { WebhookEntry } from './WebhookTypes'

export type WebhookAuditAuthState = {
  config: { clientId: string }
  location: { IPv4: string }
  userinfo: { name: string; inum: string } | null
}

export type WebhookAuditRootState = {
  authReducer: WebhookAuditAuthState
}

export type WebhookAuditActionType = typeof CREATE | typeof UPDATE | typeof DELETION | typeof FETCH

export type WebhookAuditInit = {
  client_id: string
  ip_address: string
  status: string
  performedBy: { user_inum: string; userId: string }
  [key: string]: JsonValue | { user_inum: string; userId: string } | undefined
}

export type WebhookAuditActionData = Record<string, string | number | boolean | object | null>

export type WebhookAuditLogActionPayload = {
  action_message?: string
  action_data?: WebhookEntry | { inum: string }
}
