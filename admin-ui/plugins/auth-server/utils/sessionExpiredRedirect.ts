import store from '@/redux/store'
import { auditLogoutLogs } from '@/redux/features/sessionSlice'
import { fetchApiTokenWithDefaultScopes, deleteAdminUiSession } from '@/redux/api/backend-api'
import { devLogger } from '@/utils/devLogger'

/**
 * Mirrors `redirectToLogout` from Redux/sagas/SagaUtils for use outside sagas (e.g. React Query).
 */
export async function redirectSessionExpired(message = 'Session expired'): Promise<void> {
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
