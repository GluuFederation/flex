import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import type { SelectEffect } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import type { PayloadAction } from '@reduxjs/toolkit'
import { isFourZeroThreeError, addAdditionalData } from 'Utils/TokenController'
import type { AdditionalPayload } from 'Utils/TokenController'
import { getHealthStatusResponse, getHealthServerStatusResponse } from '../features/healthSlice'
import { postUserAction } from '../api/backend-api'
import HealthApi from '../api/HealthApi'
import { getClient } from '../api/base'
import HealthCheckApi from '../api/HealthCheckApi'
import { initAudit, redirectToLogout } from '../sagas/SagaUtils'
import { isHttpLikeError } from 'Plugins/admin/redux/sagas/types/common'
import * as JansConfigApi from 'jans_config_api'

function* createHealthApi(): Generator<SelectEffect, HealthApi, string> {
  const issuer: string = yield select(
    (state: { authReducer: { issuer: string } }) => state.authReducer.issuer,
  )
  const api = new JansConfigApi.AuthServerHealthCheckApi(getClient(JansConfigApi, null, issuer))
  return new HealthApi(api)
}

function* createHealthCheckApi(): Generator<SelectEffect, HealthCheckApi, string> {
  const issuer: string = yield select(
    (state: { authReducer: { issuer: string } }) => state.authReducer.issuer,
  )
  const api = new JansConfigApi.HealthCheckApi(getClient(JansConfigApi, null, issuer))
  return new HealthCheckApi(api)
}

export function* getHealthStatus({
  payload,
}: PayloadAction<AdditionalPayload>): SagaIterator<void> {
  const audit = yield* initAudit()
  try {
    const resolvedPayload: AdditionalPayload = payload ?? { action: {} }
    addAdditionalData(audit, 'FETCH', 'Health', resolvedPayload)
    const healthApi: HealthApi = yield* createHealthApi()
    const data = yield call(healthApi.getHealthStatus)
    yield put(getHealthStatusResponse({ data }))
    yield call(postUserAction, audit)
  } catch (e: unknown) {
    yield put(getHealthStatusResponse(null))
    if (isHttpLikeError(e) && isFourZeroThreeError(e)) {
      yield* redirectToLogout()
    }
  }
}

export function* getHealthServerStatus({
  payload,
}: PayloadAction<AdditionalPayload>): SagaIterator<void> {
  const audit = yield* initAudit()
  try {
    const resolvedPayload: AdditionalPayload = payload ?? { action: {} }
    addAdditionalData(audit, 'FETCH', 'Health', resolvedPayload)
    const healthApi: HealthCheckApi = yield* createHealthCheckApi()
    const data = yield call(
      healthApi.getHealthServerStatus,
      (resolvedPayload.action?.action_data ?? {}) as Record<string, string>,
    )
    yield put(getHealthServerStatusResponse({ data }))
    yield call(postUserAction, audit)
  } catch {
    yield put(getHealthServerStatusResponse(null))
  }
}

export function* watchGetHealthStatus(): SagaIterator<void> {
  yield takeLatest('health/getHealthStatus', getHealthStatus)
}

export function* watchGetHealthServerStatus(): SagaIterator<void> {
  yield takeLatest('health/getHealthServerStatus', getHealthServerStatus)
}

export default function* rootSaga(): SagaIterator<void> {
  yield all([fork(watchGetHealthStatus), fork(watchGetHealthServerStatus)])
}
