import { call, all, put, fork, takeLatest } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import type { PayloadAction } from '@reduxjs/toolkit'
import { isFourZeroThreeError, addAdditionalData } from 'Utils/TokenController'
import type { UserActionPayload } from '../api/types/BackendApi'
import type { AdditionalPayload } from 'Utils/TokenController'
import { getHealthStatusResponse, getHealthServerStatusResponse } from '../features/healthSlice'
import { postUserAction } from '../api/backend-api'
import { initAudit, redirectToLogout } from '../sagas/SagaUtils'
import { isHttpLikeError } from 'Plugins/admin/redux/sagas/types/common'
import { devLogger } from '@/utils/devLogger'
import { getAuthServerHealth, getServiceStatus } from 'JansConfigApi'
import type { GetServiceStatusParams } from 'JansConfigApi'

export function* getHealthStatus({
  payload,
}: PayloadAction<AdditionalPayload>): SagaIterator<void> {
  const audit = yield* initAudit()
  try {
    const resolvedPayload: AdditionalPayload = payload ?? { action: {} }
    addAdditionalData(audit, 'FETCH', 'Health', resolvedPayload)
    const data = yield call(getAuthServerHealth)
    yield put(getHealthStatusResponse({ data }))
    yield call(postUserAction, audit as UserActionPayload)
  } catch (e) {
    devLogger.warn('getHealthStatus failed', e instanceof Error ? e : String(e))
    yield put(getHealthStatusResponse(null))
    if (
      isHttpLikeError(e as Error) &&
      isFourZeroThreeError(e as { response?: { status?: number }; status?: number })
    ) {
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
    const params = (resolvedPayload.action?.action_data ?? {}) as GetServiceStatusParams
    const data = yield call(getServiceStatus, params)
    yield put(getHealthServerStatusResponse({ data }))
    yield call(postUserAction, audit as UserActionPayload)
  } catch (e) {
    devLogger.warn('getHealthServerStatus failed', e instanceof Error ? e : String(e))
    yield put(getHealthServerStatusResponse(null))
    if (
      isHttpLikeError(e as Error) &&
      isFourZeroThreeError(e as { response?: { status?: number }; status?: number })
    ) {
      yield* redirectToLogout()
    }
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
