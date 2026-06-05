import type { BaseAuditActionType, BaseAuditInit, BaseAuditActionData } from '../../../types'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

export type AssetAuditActionType = BaseAuditActionType
export type AssetAuditInit = BaseAuditInit
export type AssetAuditActionData = BaseAuditActionData

export type AssetAuditLogActionPayload = {
  action_message?: string
  action_data?: Record<
    string,
    string | number | boolean | object | string[] | File | Blob | null | undefined
  >
}

export type SanitizableValue = JsonValue | File | Blob | undefined
export type SanitizedValue = JsonValue | undefined
