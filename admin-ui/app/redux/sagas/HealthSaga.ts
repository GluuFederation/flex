import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import type { CallEffect, PutEffect, SelectEffect, AllEffect, ForkEffect } from 'redux-saga/effects'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import { getHealthStatusResponse, getHealthServerStatusResponse } from '../features/healthSlice'
import { getAPIAccessToken } from '../features/authSlice'
import { postUserAction } from '../api/backend-api'
import HealthApi from '../api/HealthApi'
import { getClient } from '../api/base'
import { initAudit } from '../sagas/SagaUtils'
import HealthCheckApi from '../api/HealthCheckApi'
import type { HealthAction } from './types/health'
const JansConfigApi = require('jans_config_api')

function* newFunction(): Generator<SelectEffect, HealthApi, any> {
  const token = yield select((state: any) => state.authReducer.token.access_token)
  const issuer = yield select((state: any) => state.authReducer.issuer)
  const api = new JansConfigApi.AuthServerHealthCheckApi(getClient(JansConfigApi, token, issuer))
  return new HealthApi(api)
}

function* newStatusFunction(): Generator<SelectEffect, HealthCheckApi, any> {
  const token = yield select((state: any) => state.authReducer.token.access_token)
  const issuer = yield select((state: any) => state.authReducer.issuer)
  const api = new JansConfigApi.HealthCheckApi(getClient(JansConfigApi, token, issuer))
  return new HealthCheckApi(api)
}

export function* getHealthStatus({ payload }: HealthAction): Generator<any, void, any> {
  const audit = yield* initAudit()
  try {
    payload = payload || { action: {} }
    addAdditionalData(audit, 'FETCH', 'Health', payload)
    const healthApi = yield* newFunction()
    const data = yield healthApi.getHealthStatus()
    yield put(getHealthStatusResponse({ data }))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(getHealthStatusResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state: any) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* getHealthServerStatus({ payload }: HealthAction): Generator<any, void, any> {
  const audit = yield* initAudit()
  try {
    payload = payload || { action: {} }
    addAdditionalData(audit, 'FETCH', 'Health', payload)
    const healthApi = yield* newStatusFunction()
    const data = yield healthApi.getHealthServerStatus(payload.action.action_data || {})
    yield put(getHealthServerStatusResponse({ data }))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(getHealthServerStatusResponse(null))
  }
}

export function* watchGetHealthStatus(): Generator<ForkEffect<never>, void, unknown> {
  yield takeLatest('health/getHealthStatus' as any, getHealthStatus)
}

export function* watchGetHealthServerStatus(): Generator<ForkEffect<never>, void, unknown> {
  yield takeLatest('health/getHealthServerStatus' as any, getHealthServerStatus)
}

export default function* rootSaga(): Generator<AllEffect<ForkEffect<void>>, void, unknown> {
  yield all([fork(watchGetHealthStatus), fork(watchGetHealthServerStatus)])
}
