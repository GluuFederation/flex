import { select, put, call } from 'redux-saga/effects'
import type { Action } from 'redux'
import type { AuditLog, AuthState, RootState, SagaError } from './types/audit'
import type { ApiTokenResponse } from '../api/types/BackendApi'
import { isFourZeroThreeError } from '../../utils/TokenController'
import { devLogger } from '@/utils/devLogger'
import { updateToast } from '../features/toastSlice'
import { auditLogoutLogs } from '../features/sessionSlice'
import { fetchApiTokenWithDefaultScopes, deleteAdminUiSession } from '../api/backend-api'

type HttpErrorLike = { response?: { status?: number }; status?: number }

export function* initAudit() {
  const auditlog: AuditLog = {}
  const client_id = (yield select(
    (state: RootState) => state.authReducer.config.clientId,
  )) as string
  const ip_address = (yield select((state: RootState) => state.authReducer.location.IPv4)) as string
  const userinfo = (yield select(
    (state: RootState) => state.authReducer.userinfo,
  )) as AuthState['userinfo']
  const author = userinfo?.name ?? '-'
  const inum = userinfo?.inum ?? '-'
  auditlog.client_id = client_id
  auditlog.ip_address = ip_address
  auditlog.status = 'success'
  auditlog.performedBy = { user_inum: inum, userId: author }
  return auditlog
}

export function* redirectToLogout(message = 'Session expired') {
  yield put(auditLogoutLogs({ message }))
  try {
    const response = (yield call(fetchApiTokenWithDefaultScopes)) as ApiTokenResponse
    yield call(deleteAdminUiSession, response.access_token)
    window.location.href = '/admin/logout'
  } catch (e) {
    devLogger.error('Error during logout cleanup:', e)
  }
}

export function* handleResponseError(
  error: Error | SagaError,
  options: {
    showToast?: boolean
    clearDataAction?: () => Action
  } = {},
) {
  const { showToast = true, clearDataAction } = options
  if (showToast) {
    yield put(updateToast(true, 'error'))
  }
  if (clearDataAction) {
    yield put(clearDataAction())
  }
  if (isFourZeroThreeError(error as HttpErrorLike)) {
    yield* redirectToLogout()
    return error
  }
  return error
}
