import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import type { PayloadAction } from '@reduxjs/toolkit'
import { auditLogoutLogs, auditLogoutLogsResponse } from '../features/sessionSlice'
import { fetchApiTokenWithDefaultScopes, deleteAdminUiSession } from '../api/backend-api'
import { isFourZeroThreeError, addAdditionalData } from 'Utils/TokenController'
import { postUserAction } from 'Redux/api/backend-api'
import { CREATE } from '../../audit/UserActionType'
import { initAudit } from '../sagas/SagaUtils'
import { devLogger } from '@/utils/devLogger'
import type { AuditLog, HttpErrorLike } from './types'
import type { UserActionPayload } from '../api/types/BackendApi'
import type { ApiTokenResponse } from '../api/types/BackendApi'

const API_USERS = '/api/v1/users'

interface ApiResponse {
  status?: number
}

export function* auditLogoutLogsSaga({
  payload,
}: PayloadAction<{ message: string }>): SagaIterator<boolean> {
  devLogger.log('Logout audit:', payload.message)

  const audit = (yield call(initAudit)) as AuditLog

  try {
    addAdditionalData(audit, CREATE, API_USERS, {})
    audit.message = payload.message
    const data = (yield call(postUserAction, audit as UserActionPayload)) as ApiResponse
    const ok = !!data && typeof data.status === 'number' && data.status >= 200 && data.status < 300

    yield put(auditLogoutLogsResponse(ok))
    return ok
  } catch (e) {
    if (isFourZeroThreeError(e as HttpErrorLike)) {
      try {
        const response = (yield call(fetchApiTokenWithDefaultScopes)) as ApiTokenResponse
        yield call(deleteAdminUiSession, response?.access_token)
      } catch (recoveryError) {
        devLogger.error(
          'Session cleanup failed:',
          recoveryError instanceof Error ? recoveryError : String(recoveryError),
        )
      }
      window.location.href = '/admin/logout'
      return false
    }
    yield put(auditLogoutLogsResponse(false))
    devLogger.error('Error:', e instanceof Error ? e : String(e))
    return false
  }
}

export function* watchAuditLogoutLogs(): SagaIterator<void> {
  yield takeLatest(auditLogoutLogs.type, auditLogoutLogsSaga)
}

export default function* sessionSaga(): SagaIterator<void> {
  yield all([fork(watchAuditLogoutLogs)])
}
