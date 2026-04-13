import type {
  BaseAuditAuthState,
  BaseAuditRootState,
  BaseAuditActionType,
  BaseAuditInit,
  BaseAuditActionData,
} from '../../../types'
import type { WebhookEntry } from './WebhookTypes'

export type WebhookAuditAuthState = BaseAuditAuthState
export type WebhookAuditRootState = BaseAuditRootState
export type WebhookAuditActionType = BaseAuditActionType
export type WebhookAuditInit = BaseAuditInit
export type WebhookAuditActionData = BaseAuditActionData

export type WebhookAuditLogActionPayload = {
  action_message?: string
  action_data?: WebhookEntry | { inum: string }
}
