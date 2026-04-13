import { call, all, put, fork, select, takeLatest } from 'redux-saga/effects'
import type { SelectEffect } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import { isFourZeroThreeError } from 'Utils/TokenController'

import { getClient } from '../api/base'
import { redirectToLogout } from '../sagas/SagaUtils'
import LockApi from '../api/LockApi'
import { getLockStatusResponse } from '../features/lockSlice'
import type { HttpErrorLike, SagaActionPayload } from './types'
import type { LockStatEntry } from 'Routes/Dashboards/types/DashboardTypes'
import * as JansConfigApi from 'jans_config_api'

function* newFunction(): Generator<SelectEffect, LockApi, string> {
  const issuer = (yield select(
    (state: { authReducer: { issuer: string } }) => state.authReducer.issuer,
  )) as string
  const api = new JansConfigApi.StatisticsApi(getClient(JansConfigApi, null, issuer))
  return new LockApi(api)
}

export function* getLockMau(action: PayloadAction<SagaActionPayload>) {
  const { payload } = action
  try {
    const lockapi: LockApi = yield* newFunction()
    const data = (yield call(
      [lockapi, lockapi.getLockMau],
      (payload.options ?? {}) as Record<string, string>,
    )) as LockStatEntry[]
    yield put(getLockStatusResponse({ data }))
  } catch (e) {
    yield put(getLockStatusResponse({ data: undefined }))
    if (isFourZeroThreeError(e as HttpErrorLike)) {
      yield* redirectToLogout()
      return
    }
  }
}

export function* watchGetLockMau() {
  yield takeLatest(
    'lock/getLockStatus',
    getLockMau as (...args: [PayloadAction<SagaActionPayload>]) => Generator,
  )
}

export default function* rootSaga() {
  yield all([fork(watchGetLockMau)])
}
