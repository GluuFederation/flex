import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type { CREATE, UPDATE, DELETION, FETCH } from '@/audit/UserActionType'

export type BaseAuditAuthState = {
  config: { clientId: string }
  location: { IPv4: string }
  userinfo: { name: string; inum: string } | null
}

export type BaseAuditRootState = {
  authReducer: BaseAuditAuthState
}

export type BaseAuditActionType = typeof CREATE | typeof UPDATE | typeof DELETION | typeof FETCH

export type BaseAuditInit = {
  client_id: string
  ip_address: string
  status: string
  performedBy: { user_inum: string; userId: string }
  [key: string]: JsonValue | { user_inum: string; userId: string } | undefined
}

export type BaseAuditActionData = Record<string, string | number | boolean | object | null>
