import { all, call, fork, put, select, takeLatest } from 'redux-saga/effects'
import type { SelectEffect } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import { PayloadAction } from '@reduxjs/toolkit'
import { getClient } from 'Redux/api/base'
import JansLockApi from '../api/JansLockApi'
import { initAudit } from 'Redux/sagas/SagaUtils'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import { getJansLockConfigurationResponse } from '../features/JansLockSlice'
import { postUserAction } from 'Redux/api/backend-api'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import { FETCH, PATCH } from '../../../../app/audit/UserActionType'
import {
  RootState,
  AppConfiguration5,
  JansLockAction,
  JansLockConfiguration,
} from '../../types/JansLockApiTypes'

import * as JansConfigApi from 'jans_config_api'
export const JANS_LOCK = 'jans-link'

function* initJansLockApi(): Generator<SelectEffect, JansLockApi, string> {
  const token: string = yield select((state: RootState) => state.authReducer.token.access_token)
  const issuer: string = yield select((state: RootState) => state.authReducer.issuer)
  const api = new JansConfigApi.LockConfigurationApi(getClient(JansConfigApi, token, issuer))
  return new JansLockApi(api)
}

export function* getJansLockConfigs(): SagaIterator<AppConfiguration5 | unknown> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, JANS_LOCK, {})
    const jansKcApi: JansLockApi = yield* initJansLockApi()
    const data: AppConfiguration5 = yield call(jansKcApi.getLockProperties)
    yield put(getJansLockConfigurationResponse(data as JansLockConfiguration))
    yield call(postUserAction, audit)
    return data
  } catch (e: unknown) {
    yield put(getJansLockConfigurationResponse({}))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* putJansLockConfigs({
  payload,
}: PayloadAction<JansLockAction>): SagaIterator<AppConfiguration5 | unknown> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, PATCH, JANS_LOCK, payload)
    const jansKcApi: JansLockApi = yield* initJansLockApi()
    const data: AppConfiguration5 = yield call(
      jansKcApi.updateLockConfig,
      payload.action.action_data,
    )
    yield put(getJansLockConfigurationResponse(data as JansLockConfiguration))
    yield call(postUserAction, audit)
    return data
  } catch (e: unknown) {
    yield put(getJansLockConfigurationResponse({}))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* watchGetJansLockConfig(): SagaIterator<void> {
  yield takeLatest('jansLock/getJansLockConfiguration', getJansLockConfigs)
}

export function* watchPutJansLockConfig(): SagaIterator<void> {
  yield takeLatest('jansLock/putJansLockConfiguration', putJansLockConfigs)
}

export default function* rootSaga(): SagaIterator<void> {
  yield all([fork(watchGetJansLockConfig), fork(watchPutJansLockConfig)])
}
