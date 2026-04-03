import store from '@/redux/store'
import { auditLogoutLogs } from '@/redux/features/sessionSlice'
import { fetchApiTokenWithDefaultScopes, deleteAdminUiSession } from '@/redux/api/backend-api'
import { devLogger } from '@/utils/devLogger'

export const redirectSessionExpired = async (message = 'Session expired'): Promise<void> => {
  store.dispatch(auditLogoutLogs({ message }))
  try {
    const response = await fetchApiTokenWithDefaultScopes()
    await deleteAdminUiSession(response.access_token)
  } catch (e) {
    devLogger.error('Error during logout cleanup:', e)
  } finally {
    window.location.href = '/admin/logout'
  }
}
