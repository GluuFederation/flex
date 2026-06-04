import { startAppListening } from './index'
import { auditLogoutLogs, auditLogoutLogsResponse } from '../features/sessionSlice'
import {
  postUserAction,
  fetchApiTokenWithDefaultScopes,
  deleteAdminUiSession,
} from '../api/backend-api'
import type { UserActionPayload } from '../api/types/BackendApi'
import { addAdditionalData, isFourZeroThreeError } from 'Utils/TokenController'
import { CREATE } from '@/audit/UserActionType'
import { devLogger } from '@/utils/devLogger'
import type { AuditLog, HttpErrorLike } from '../types/audit'

const API_USERS = '/api/v1/users'

type ApiResponse = { status?: number }

startAppListening({
  actionCreator: auditLogoutLogs,
  effect: async (action, listenerApi) => {
    listenerApi.cancelActiveListeners()
    const { message } = action.payload
    devLogger.log('Logout audit:', message)

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
      const data = (await postUserAction(audit as UserActionPayload)) as ApiResponse
      const ok =
        !!data && typeof data.status === 'number' && data.status >= 200 && data.status < 300
      listenerApi.dispatch(auditLogoutLogsResponse(ok))
    } catch (e) {
      if (isFourZeroThreeError(e as HttpErrorLike)) {
        try {
          const response = await fetchApiTokenWithDefaultScopes()
          await deleteAdminUiSession(response?.access_token)
        } catch (recoveryError) {
          devLogger.error(
            'Session cleanup failed:',
            recoveryError instanceof Error ? recoveryError : String(recoveryError),
          )
        }
        window.location.href = '/admin/logout'
        return
      }
      listenerApi.dispatch(auditLogoutLogsResponse(false))
      devLogger.error('Error:', e instanceof Error ? e : String(e))
    }
  },
})
