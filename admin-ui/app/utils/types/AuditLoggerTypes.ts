import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

export type BasicUserInfo = {
  inum?: string
  name?: string
}

export type LogAuditParams = {
  userinfo?: BasicUserInfo | null
  action: string
  resource: string
  message: string
  modifiedFields?: Record<string, JsonValue>
  performedOn?: string | Date
  ip_address?: string
  extra?: Record<string, JsonValue>
  status?: string
  client_id?: string
  payload?: object | string | number | boolean | null
}
