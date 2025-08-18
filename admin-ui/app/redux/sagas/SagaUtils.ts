import { select, put } from 'redux-saga/effects'
import type { AuditLog, AuthState, RootState } from './types/audit'
import { isFourZeroOneError } from '../../utils/TokenController'
import { getAPIAccessToken } from '../features/authSlice'
import { updateToast } from '../features/toastSlice'
export function* initAudit(): Generator<any, AuditLog, any> {
  const auditlog: AuditLog = {
    headers: {},
  }
  const client_id: string = yield select((state: RootState) => state.authReducer.config.clientId)
  const ip_address: string = yield select((state: RootState) => state.authReducer.location.IPv4)
  const userinfo: AuthState['userinfo'] = yield select(
    (state: RootState) => state.authReducer.userinfo,
  )
  const author: string = userinfo ? userinfo.name : '-'
  const inum: string = userinfo ? userinfo.inum : '-'
  const token: string = yield select((state: RootState) => state.authReducer.token.access_token)
  auditlog.client_id = client_id
  auditlog.ip_address = ip_address
  auditlog.status = 'success'
  auditlog.performedBy = { user_inum: inum, userId: author }
  auditlog.headers.Authorization = `Bearer ${token}`
  return auditlog
}

/**
 * Generic error handler for saga catch blocks that handles common error scenarios:
 * - Shows error toast notification
 * - Handles 401 errors by refreshing the access token
 * - Optionally clears response data
 *
 * @param error - The caught error
 * @param options - Configuration options for error handling
 * @param options.showToast - Whether to show error toast (default: true)
 * @param options.clearDataAction - Redux action to dispatch to clear data (optional)
 */
export function* handleSagaError(
  error: unknown,
  options: {
    showToast?: boolean
    clearDataAction?: any
  } = {},
): Generator<any, unknown, any> {
  const { showToast = true, clearDataAction } = options

  // Show error toast if requested
  if (showToast) {
    yield put(updateToast(true, 'error'))
  }

  // Clear data if action provided
  if (clearDataAction) {
    yield put(clearDataAction)
  }

  // Handle 401 errors by refreshing token
  if (isFourZeroOneError(error)) {
    const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
    yield put(getAPIAccessToken(jwt))
  }

  return error
}
