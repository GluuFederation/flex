import { select, put, call } from 'redux-saga/effects'
import type { AuditLog, AuthState, RootState } from './types/audit'
import { isFourZeroThreeError } from '../../utils/TokenController'
import { updateToast } from '../features/toastSlice'
import { auditLogoutLogs } from '../features/sessionSlice'
import { setAuthState } from '../features/authSlice'
import { logoutUser } from '../features/logoutSlice'
import { deleteAdminUiSession as deleteSession } from '../api/backend-api'
import { ROUTES } from '@/helpers/navigation'
import { navigationService } from '../../utils/NavigationService'

export function* initAudit(): Generator<any, AuditLog, any> {
  const auditlog: AuditLog = {}
  const client_id: string = yield select((state: RootState) => state.authReducer.config.clientId)
  const ip_address: string = yield select((state: RootState) => state.authReducer.location.IPv4)
  const userinfo: AuthState['userinfo'] = yield select(
    (state: RootState) => state.authReducer.userinfo,
  )
  const author: string = userinfo ? userinfo.name : '-'
  const inum: string = userinfo ? userinfo.inum : '-'
  auditlog.client_id = client_id
  auditlog.ip_address = ip_address
  auditlog.status = 'success'
  auditlog.performedBy = { user_inum: inum, userId: author }
  return auditlog
}

export function* redirectToLogout(message = 'Session expired'): Generator<any, void, any> {
  yield put(auditLogoutLogs({ message }))
  yield put(setAuthState({ state: false }))

  const hasSession: boolean = yield select((state: RootState) => state.authReducer.hasSession)
  if (hasSession) {
    try {
      yield call(deleteSession)
    } catch (error: unknown) {
      console.error('Error deleting session:', error)
    }
  }

  yield put(logoutUser(undefined))
  navigationService.navigate(ROUTES.LOGOUT, { replace: true })
}

export function* handleResponseError(
  error: unknown,
  options: {
    showToast?: boolean
    clearDataAction?: any
  } = {},
): Generator<any, unknown, any> {
  const { showToast = true, clearDataAction } = options
  if (showToast) {
    yield put(updateToast(true, 'error'))
  }
  if (clearDataAction) {
    yield put(clearDataAction)
  }
  if (isFourZeroThreeError(error as { response?: { status?: number }; status?: number })) {
    yield* redirectToLogout()
    return
  }

  return error
}
