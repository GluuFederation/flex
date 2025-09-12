import { call, all, put, fork, takeLatest, select, takeEvery } from 'redux-saga/effects'
import type { PutEffect, SelectEffect } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import { PayloadAction } from '@reduxjs/toolkit'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import { getClient } from 'Redux/api/base'
import { initAudit } from 'Redux/sagas/SagaUtils'
import { updateToast } from 'Redux/features/toastSlice'
import { postUserAction } from 'Redux/api/backend-api'
import { RootState } from 'Redux/sagas/types/audit'
import SCIMConfigApi from '../api/ScimApi'
import { getScimConfigurationResponse } from '../features/ScimSlice'
import { PATCH, FETCH } from '../../../../app/audit/UserActionType'
import { triggerWebhook } from 'Plugins/admin/redux/sagas/WebhookSaga'
import { SCIMConfig, ScimConfigPatchRequestBody } from '../types'
import { ScimActionPayload } from '../types/ScimConfig.type'
import * as JansConfigApi from 'jans_config_api'

function isApiError(error: unknown): error is {
  response?: { body?: { description?: string; message?: string }; text?: string }
  message?: string
} {
  return typeof error === 'object' && error !== null && ('response' in error || 'message' in error)
}

function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return (
      error?.response?.body?.description ||
      error?.response?.body?.message ||
      error?.response?.text ||
      error?.message ||
      'Unknown error'
    )
  }
  return 'Unknown error'
}

const UPDATE_SCIM_CONFIG = 'update_scim_config'
const GET_SCIM_CONFIG = 'get_scim_config'

function* createScimApi(): Generator<SelectEffect, SCIMConfigApi, string> {
  const token: string = yield select((state: RootState) => state.authReducer.token.access_token)
  const issuer: string = yield select((state: RootState) => state.authReducer.issuer)
  const api = new JansConfigApi.SCIMConfigManagementApi(getClient(JansConfigApi, token, issuer))
  return new SCIMConfigApi(api)
}

export function* updateScimSaga({
  payload,
}: PayloadAction<ScimActionPayload>): SagaIterator<SCIMConfig | unknown> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, PATCH, UPDATE_SCIM_CONFIG, payload)
    const scimApi: SCIMConfigApi = yield* createScimApi()
    const data: SCIMConfig = yield call(
      scimApi.updateScimConfig,
      payload.action.action_data as ScimConfigPatchRequestBody,
    )
    yield put(updateToast(true, 'success'))
    yield put(getScimConfigurationResponse(data))
    yield call(postUserAction, audit)
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })
    return data
  } catch (e: unknown) {
    const errMsg = getErrorMessage(e)
    yield* errorToast(errMsg)
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      if (jwt) {
        yield put(getAPIAccessToken(jwt))
      }
    }
    return e
  }
}

export function* getScimSaga(): SagaIterator<SCIMConfig | unknown> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, GET_SCIM_CONFIG, {})
    const scimApi: SCIMConfigApi = yield* createScimApi()
    const data: SCIMConfig = yield call(scimApi.getScimConfig)
    yield put(getScimConfigurationResponse(data))
    yield call(postUserAction, audit)
    return data
  } catch (e: unknown) {
    const errMsg = getErrorMessage(e)
    yield* errorToast(errMsg)
    yield put(getScimConfigurationResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      if (jwt) {
        yield put(getAPIAccessToken(jwt))
      }
    }
    return e
  }
}

function* errorToast(errMsg: string): Generator<PutEffect, void, void> {
  yield put(updateToast(true, 'error', errMsg))
}

export function* watchGetScim(): SagaIterator<void> {
  yield takeEvery('scim/getScimConfiguration', getScimSaga)
}

export function* watchUpdateScim(): SagaIterator<void> {
  yield takeLatest('scim/putScimConfiguration', updateScimSaga)
}

export default function* rootSaga(): SagaIterator<void> {
  yield all([fork(watchGetScim), fork(watchUpdateScim)])
}
