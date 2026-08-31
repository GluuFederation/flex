import { startAppListening } from './index'
import { auditLogoutLogs } from '../features/sessionSlice'
import { postUserAction } from '../api/backend-api'
import type { UserActionPayload } from '../api/types/BackendApi'
import { addAdditionalData } from 'Utils/TokenController'
import { CREATE } from '@/audit/UserActionType'
import { logger } from '@/utils/logger'
import type { AuditLog } from '../types/audit'

const API_USERS = '/api/v1/users'

startAppListening({
  actionCreator: auditLogoutLogs,
  effect: async (action, listenerApi) => {
    listenerApi.cancelActiveListeners()
    const { message } = action.payload
    logger.info('Logout audit:', message)

    const { authReducer } = listenerApi.getState()
    const userinfo = authReducer?.userinfo
    const audit: AuditLog = {
      client_id: authReducer?.config?.clientId ?? '',
      ip_address: authReducer?.location?.IPv4 ?? '',
      status: 'success',
      performedBy: {
        user_inum: userinfo?.inum ?? '-',
        userId: userinfo?.name ?? '-',
      },
    }

    try {
      addAdditionalData(audit, CREATE, API_USERS, {})
      audit.message = message
      await postUserAction(audit as UserActionPayload)
    } catch (e) {
      logger.error('Error:', e instanceof Error ? e : String(e))
    }
  },
})
