import { select, put, call } from 'redux-saga/effects'
import type { AuditLog, AuthState, RootState } from './types'
import type { ApiTokenResponse } from '../api/types/BackendApi'
import { devLogger } from '@/utils/devLogger'
import { auditLogoutLogs } from '../features/sessionSlice'
import { fetchApiTokenWithDefaultScopes, deleteAdminUiSession } from '../api/backend-api'

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
  } catch (e) {
    devLogger.error('Error during logout cleanup:', e instanceof Error ? e : String(e))
  } finally {
    window.location.href = '/admin/logout'
  }
}
