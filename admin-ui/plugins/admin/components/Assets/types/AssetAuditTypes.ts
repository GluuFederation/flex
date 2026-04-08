import type {
  BaseAuditAuthState,
  BaseAuditRootState,
  BaseAuditActionType,
  BaseAuditInit,
  BaseAuditActionData,
} from '../../../types'

export type AssetAuditAuthState = BaseAuditAuthState
export type AssetAuditRootState = BaseAuditRootState
export type AssetAuditActionType = BaseAuditActionType
export type AssetAuditInit = BaseAuditInit
export type AssetAuditActionData = BaseAuditActionData

export type AssetAuditLogActionPayload = {
  action_message?: string
  action_data?: Record<string, string | number | boolean | object | null>
}
