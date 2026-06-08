import store from '@/redux/store'
import { auditLogoutLogs } from '@/redux/features/sessionSlice'
import { fetchApiTokenWithDefaultScopes, deleteAdminUiSession } from '@/redux/api/backend-api'
import { logger } from '@/utils/logger'
import { SESSION_EXPIRED } from '@/audit/messages'

export const redirectSessionExpired = async (message = SESSION_EXPIRED): Promise<void> => {
  store.dispatch(auditLogoutLogs({ message }))
  try {
    const response = await fetchApiTokenWithDefaultScopes()
    await deleteAdminUiSession(response.access_token)
  } catch (e) {
    logger.error('dev', 'Error during logout cleanup:', e instanceof Error ? e : String(e))
  } finally {
    window.location.href = '/admin/logout'
  }
}
