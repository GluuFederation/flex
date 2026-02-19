import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { postUserAction } from 'Redux/api/backend-api'
import { addAdditionalData } from 'Utils/TokenController'
import { CREATE, UPDATE, DELETION, FETCH } from '@/audit/UserActionType'
import type { WebhookEntry } from '../types'

interface AuthState {
  config: { clientId: string }
  location: { IPv4: string }
  userinfo: { name: string; inum: string } | null
}

interface RootState {
  authReducer: AuthState
}

type ActionType = typeof CREATE | typeof UPDATE | typeof DELETION | typeof FETCH

export const useWebhookAudit = () => {
  const clientId = useSelector((state: RootState) => state.authReducer.config.clientId)
  const ipAddress = useSelector((state: RootState) => state.authReducer.location.IPv4)
  const userinfo = useSelector((state: RootState) => state.authReducer.userinfo)

  interface AuditInit {
    client_id: string
    ip_address: string
    status: string
    performedBy: { user_inum: string; userId: string }
    [key: string]: string | { user_inum: string; userId: string } | object
  }

  const initAudit = useCallback((): AuditInit => {
    return {
      client_id: clientId,
      ip_address: ipAddress,
      status: 'success',
      performedBy: {
        user_inum: userinfo?.inum || '-',
        userId: userinfo?.name || '-',
      },
    }
  }, [clientId, ipAddress, userinfo])

  type ActionData = Record<string, string | number | boolean | object | null>

  const logAction = useCallback(
    async (
      actionType: ActionType,
      resource: string,
      payload: { action_message?: string; action_data?: WebhookEntry | { inum: string } },
    ) => {
      const audit = initAudit()
      addAdditionalData(audit, actionType, resource, {
        action: payload as { action_message?: string; action_data?: ActionData },
      })
      await postUserAction(audit)
    },
    [initAudit],
  )

  return { initAudit, logAction }
}

export { CREATE, UPDATE, DELETION, FETCH }
