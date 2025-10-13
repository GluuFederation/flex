/**
 * Session saga for handling logout audit logging
 */
import { call, put, takeLatest } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import { auditLogoutLogsResponse } from '../features/sessionSlice'
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
  const audit = yield call(initAudit)

  try {
    addAdditionalData(audit, CREATE, API_USERS, {})
    audit.message = payload.message
    const data: ApiResponse = yield call(postUserAction, audit)
    if (data.status === 200) {
      yield put(auditLogoutLogsResponse(true))
    }
    return true
  } catch (e: unknown) {
    yield put(auditLogoutLogsResponse(false))
    return false
  }
}

export function* watchAuditLogoutLogs(): Generator<any, void, any> {
  yield takeLatest('session/auditLogoutLogs', auditLogoutLogsSaga)
}

export default function* sessionSaga(): Generator<any, void, any> {
  yield call(watchAuditLogoutLogs)
}
