import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type { CREATE, UPDATE, DELETION, FETCH } from '@/audit/UserActionType'

export type AssetAuditAuthState = {
  config: { clientId: string }
  location: { IPv4: string }
  userinfo: { name: string; inum: string } | null
}

export type AssetAuditRootState = {
  authReducer: AssetAuditAuthState
}

export type AssetAuditActionType = typeof CREATE | typeof UPDATE | typeof DELETION | typeof FETCH

export type AssetAuditInit = {
  client_id: string
  ip_address: string
  status: string
  performedBy: { user_inum: string; userId: string }
  [key: string]: JsonValue | { user_inum: string; userId: string } | undefined
}

export type AssetAuditActionData = Record<string, string | number | boolean | object | null>

export type AssetAuditLogActionPayload = {
  action_message?: string
  action_data?: Record<string, string | number | boolean | object | null>
}
