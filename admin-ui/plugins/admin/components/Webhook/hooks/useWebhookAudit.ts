import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { postUserAction } from 'Redux/api/backend-api'
import type { UserActionPayload } from 'Redux/api/types/BackendApi'
import { addAdditionalData } from 'Utils/TokenController'
import { CREATE, UPDATE, DELETION, FETCH } from '@/audit/UserActionType'
import type {
  WebhookAuditActionData,
  WebhookAuditActionType,
  WebhookAuditInit,
  WebhookAuditLogActionPayload,
  WebhookAuditRootState,
} from '../types'

export const useWebhookAudit = () => {
  const clientId = useSelector((state: WebhookAuditRootState) => state.authReducer.config.clientId)
  const ipAddress = useSelector((state: WebhookAuditRootState) => state.authReducer.location.IPv4)
  const userinfo = useSelector((state: WebhookAuditRootState) => state.authReducer.userinfo)

  const initAudit = useCallback(
    (): WebhookAuditInit => ({
      client_id: clientId,
      ip_address: ipAddress,
      status: 'success',
      performedBy: {
        user_inum: userinfo?.inum || '-',
        userId: userinfo?.name || '-',
      },
    }),
    [clientId, ipAddress, userinfo],
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
      await postUserAction(audit as UserActionPayload)
    },
    [initAudit],
  )

  return { initAudit, logAction }
}

export { CREATE, UPDATE, DELETION, FETCH }
