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
  if (isFourZeroOneError(error)) {
    const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
    yield put(getAPIAccessToken(jwt))
  }

  return error
}
