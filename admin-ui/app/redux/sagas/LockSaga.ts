import { call, all, put, fork, takeLatest } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import { isFourZeroThreeError } from 'Utils/TokenController'

import { redirectToLogout } from '../sagas/SagaUtils'
import { getLockStatusResponse } from '../features/lockSlice'
import type { HttpErrorLike, SagaActionPayload } from './types'
import type { LockStatEntry } from 'Routes/Dashboards/types/DashboardTypes'
import { getLockStat } from 'JansConfigApi'
import type { GetLockStatParams } from 'JansConfigApi'

export function* getLockMau(action: PayloadAction<SagaActionPayload>) {
  const { payload } = action
  try {
    const data = (yield call(
      getLockStat,
      (payload.options ?? {}) as GetLockStatParams,
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
