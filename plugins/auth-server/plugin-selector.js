import { select } from 'redux-saga/effects'

export function* initAudit() {
  const auditlog = {}
  const client_id = yield select((state) => state.authReducer.config.clientId)
  const ip_address = yield select((state) => state.authReducer.location.IPv4)
  const userinfo = yield select((state) => state.authReducer.userinfo)
  const author = userinfo ? userinfo.family_name || userinfo.name : '-'
  auditlog['client_id'] = client_id
  auditlog['ip_address'] = ip_address
  auditlog['author'] = author
  auditlog['status'] = 'succeed'
  return auditlog
}
