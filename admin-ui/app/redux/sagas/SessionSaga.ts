import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import { auditLogoutLogs, auditLogoutLogsResponse } from '../features/sessionSlice'
import { initAudit } from './SagaUtils'
import { addAdditionalData } from 'Utils/TokenController'
import { postUserAction } from 'Redux/api/backend-api'
import { CREATE } from '../../audit/UserActionType'

const API_USERS = '/api/v1/users'

interface ApiResponse {
  status?: number
}

export function* auditLogoutLogsSaga({
  payload,
}: PayloadAction<{ message: string }>): Generator<any, boolean, any> {
  if (process.env.NODE_ENV === 'development') {
    console.log('Logout audit:', payload.message)
  }

  const audit = yield call(initAudit)

  try {
    addAdditionalData(audit, CREATE, API_USERS, {})
    audit.message = payload.message
    const data: ApiResponse = yield call(postUserAction, audit)
    const ok = !!data && typeof data.status === 'number' && data.status >= 200 && data.status < 300
    yield put(auditLogoutLogsResponse(ok))
    return ok
  } catch (e: unknown) {
    yield put(auditLogoutLogsResponse(false))
    if (process.env.NODE_ENV === 'development') {
      console.error('Error:', e)
    }
    return false
  }
}

export function* watchAuditLogoutLogs(): Generator<any, void, any> {
  yield takeLatest(auditLogoutLogs.type, auditLogoutLogsSaga)
}

export default function* sessionSaga(): Generator<any, void, any> {
  yield all([fork(watchAuditLogoutLogs)])
}
