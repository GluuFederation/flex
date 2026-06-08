import { useCallback } from 'react'
import { postUserAction } from 'Redux/api/backend-api'
import type { UserActionPayload } from 'Redux/api/types/BackendApi'
import { addAdditionalData } from 'Utils/TokenController'
import { createSuccessAuditInit, useAuditContext } from '@/audit'
import { logger } from '@/utils/logger'
import type {
  WebhookAuditActionData,
  WebhookAuditActionType,
  WebhookAuditInit,
  WebhookAuditLogActionPayload,
} from '../types'

export const useWebhookAudit = () => {
  const auditContext = useAuditContext()

  const initAudit = useCallback(
    (): WebhookAuditInit => createSuccessAuditInit(auditContext) as WebhookAuditInit,
    [auditContext],
  )

  const logAction = useCallback(
    async (
      actionType: WebhookAuditActionType,
      resource: string,
      payload: WebhookAuditLogActionPayload,
    ) => {
      const audit = initAudit()
      addAdditionalData(audit, actionType, resource, {
        action: {
          action_message: payload.action_message,
          action_data: payload.action_data as WebhookAuditActionData,
        },
      })
      try {
        await postUserAction(audit as UserActionPayload)
      } catch (err) {
        logger.error('dev', 
          '[Webhook audit] postUserAction failed',
          err instanceof Error ? err : String(err),
        )
      }
    },
    [initAudit],
  )

  return { initAudit, logAction }
}
