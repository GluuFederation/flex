// @ts-nocheck
import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroThreeError, addAdditionalData } from 'Utils/TokenController'
import { getHealthStatusResponse, getHealthServerStatusResponse } from '../features/healthSlice'
import { postUserAction } from '../api/backend-api'
import HealthApi from '../api/HealthApi'
import { getClient } from '../api/base'
import HealthCheckApi from '../api/HealthCheckApi'
import { initAudit, redirectToLogout } from '../sagas/SagaUtils'
const JansConfigApi = require('jans_config_api')

function* newFunction() {
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.AuthServerHealthCheckApi(getClient(JansConfigApi, null, issuer))
  return new HealthApi(api)
}

function* newStatusFunction() {
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.HealthCheckApi(getClient(JansConfigApi, null, issuer))
  return new HealthCheckApi(api)
}

export function* getHealthStatus({ payload }) {
  const audit = yield* initAudit()
  try {
    payload = payload || { action: {} }
    addAdditionalData(audit, 'FETCH', 'Health', payload)
    const healthApi = yield* newFunction()
    const data = yield call(healthApi.getHealthStatus, payload.action.action_data)
    yield put(getHealthStatusResponse({ data }))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(getHealthStatusResponse(null))
    if (isFourZeroThreeError(e)) {
      // Session expired - redirect to login
      yield* redirectToLogout()
      return
    }
  }
}

export function* getHealthServerStatus({ payload }) {
  const audit = yield* initAudit()
  try {
    payload = payload || { action: {} }
    addAdditionalData(audit, 'FETCH', 'Health', payload)
    const healthApi = yield* newStatusFunction()
    const data = yield call(healthApi.getHealthServerStatus, payload.action.action_data)
    yield put(getHealthServerStatusResponse({ data }))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(getHealthServerStatusResponse(null))
  }
}

export function* watchGetHealthStatus() {
  yield takeLatest('health/getHealthStatus', getHealthStatus)
}

export function* watchGetHealthServerStatus() {
  yield takeLatest('health/getHealthServerStatus', getHealthServerStatus)
}

export default function* rootSaga() {
  yield all([fork(watchGetHealthStatus), fork(watchGetHealthServerStatus)])
}
