import { useCallback } from 'react'
import { postUserAction } from 'Redux/api/backend-api'
import type { UserActionPayload } from 'Redux/api/types/BackendApi'
import { addAdditionalData } from 'Utils/TokenController'
import { CREATE, UPDATE, DELETION, FETCH } from '@/audit/UserActionType'
import { devLogger } from '@/utils/devLogger'
import type {
  WebhookAuditActionData,
  WebhookAuditActionType,
  WebhookAuditInit,
  WebhookAuditLogActionPayload,
} from '../types'
import { useAppSelector } from '@/redux/hooks'

export const useWebhookAudit = () => {
  const clientId = useAppSelector((state) => state.authReducer.config.clientId ?? '')
  const ipAddress = useAppSelector((state) => state.authReducer.location.IPv4 ?? '')
  const userinfo = useAppSelector((state) => state.authReducer.userinfo)

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
      try {
        await postUserAction(audit as UserActionPayload)
      } catch (err) {
        devLogger.error('[Webhook audit] postUserAction failed', err)
      }
    },
    [initAudit],
  )

  return { initAudit, logAction }
}

export { CREATE, UPDATE, DELETION, FETCH }
