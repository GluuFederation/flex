import { call, all, put, fork, takeLatest } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import { isFourZeroThreeError, addAdditionalData } from 'Utils/TokenController'
import { getScriptsResponse } from '../features/initSlice'
import { postUserAction } from '../api/backend-api'
import { initAudit, redirectToLogout } from '../sagas/SagaUtils'
import type { PagedResult } from 'Redux/types'
import type { AuditLog, SagaActionPayload, HttpErrorLike } from './types'
import type { UserActionPayload } from '../api/types/BackendApi'
import { getConfigScripts } from 'JansConfigApi'
import type { GetConfigScriptsParams } from 'JansConfigApi'

function* getScripts(action: PayloadAction<SagaActionPayload>) {
  const payload = action.payload ?? ({ action: {} } as SagaActionPayload)
  const audit: AuditLog = yield* initAudit()
  try {
    addAdditionalData(audit, 'FETCH SCRIPTS FOR STAT', 'SCRIPT', payload)
    const params = (payload.action.action_data ?? {}) as GetConfigScriptsParams
    const data = (yield call(getConfigScripts, params)) as PagedResult
    yield put(getScriptsResponse({ data }))
    yield call(postUserAction, audit as UserActionPayload)
  } catch (e) {
    yield put(getScriptsResponse({ data: undefined }))
    if (isFourZeroThreeError(e as HttpErrorLike)) {
      yield* redirectToLogout()
      return
    }
  }
}

function* watchGetScripts() {
  yield takeLatest(
    'init/getScripts',
    getScripts as (...args: [PayloadAction<SagaActionPayload>]) => Generator,
  )
}

export default function* rootSaga() {
  yield all([fork(watchGetScripts)])
}
