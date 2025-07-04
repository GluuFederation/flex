// @ts-nocheck
import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import { getHealthStatusResponse, getHealthServerStatusResponse } from '../features/healthSlice'
import { getAPIAccessToken } from '../features/authSlice'
import { postUserAction } from '../api/backend-api'
import HealthApi from '../api/HealthApi'
import { getClient } from '../api/base'
import { initAudit } from '../sagas/SagaUtils'
import HealthCheckApi from '../api/HealthCheckApi'
const JansConfigApi = require('jans_config_api')

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.AuthServerHealthCheckApi(getClient(JansConfigApi, token, issuer))
  return new HealthApi(api)
}

function* newStatusFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.HealthCheckApi(getClient(JansConfigApi, token, issuer))
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
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
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
