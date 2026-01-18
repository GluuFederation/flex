// @ts-nocheck
import { call, all, put, fork, select, takeLatest } from 'redux-saga/effects'
import { isFourZeroThreeError } from 'Utils/TokenController'

import { getClient } from '../api/base'
import { initAudit, redirectToLogout } from '../sagas/SagaUtils'
import LockApi from '../api/LockApi'
import { getLockStatusResponse } from '../features/lockSlice'
const JansConfigApi = require('jans_config_api')

function* newFunction() {
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.StatisticsApi(getClient(JansConfigApi, null, issuer))
  return new LockApi(api)
}

export function* getLockMau({ payload }) {
  const audit = yield* initAudit()
  try {
    const lockapi = yield* newFunction()
    const data = yield call(lockapi.getLockMau, payload)
    yield put(getLockStatusResponse({ data }))
  } catch (e) {
    yield put(getLockStatusResponse(null))
    if (isFourZeroThreeError(e)) {
      // Session expired - redirect to login
      yield* redirectToLogout()
      return
    }
  }
}

export function* watchGetLockMau() {
  yield takeLatest('lock/getLockStatus', getLockMau)
}

export default function* rootSaga() {
  yield all([fork(watchGetLockMau)])
}
