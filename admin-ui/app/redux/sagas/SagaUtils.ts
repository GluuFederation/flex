// @ts-nocheck
import { select } from 'redux-saga/effects'

export interface IAuditLog {
  headers: {}
  message?: string
}

export function* initAudit() {
  const auditlog: IAuditLog = {
    headers: {},
  }
  const client_id = yield select((state) => state.authReducer.config.clientId)
  const ip_address = yield select((state) => state.authReducer.location.IPv4)
  const userinfo = yield select((state) => state.authReducer.userinfo)
  const author = userinfo ? userinfo.name : '-'
  const inum = userinfo ? userinfo.inum : '-'
  const token = yield select((state) => state.authReducer.token.access_token)
  auditlog['client_id'] = client_id
  auditlog['ip_address'] = ip_address
  auditlog['status'] = 'success'
  auditlog['performedBy'] = { user_inum: inum, userId: author }
  auditlog['headers']['Authorization'] = `Bearer ${token}`
  return auditlog
}
