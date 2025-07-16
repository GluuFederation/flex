import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import {
  getAttributesResponse,
  addAttributeResponse,
  editAttributeResponse,
  deleteAttributeResponse,
} from '../features/attributeSlice'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import { postUserAction } from 'Redux/api/backend-api'
import { updateToast } from 'Redux/features/toastSlice'
import { CREATE, UPDATE, DELETION, FETCH } from '../../../../app/audit/UserActionType'
import AttributeApi from 'Plugins/schema/redux/api/AttributeApi'
import { getClient } from 'Redux/api/base'
import { initAudit } from 'Redux/sagas/SagaUtils'
import { triggerWebhook } from 'Plugins/admin/redux/sagas/WebhookSaga'
import { PayloadAction } from '@reduxjs/toolkit'

const PERSON_SCHEMA = 'person schema'

const JansConfigApi = require('jans_config_api')

// Define payload types for actions
interface GetAttributesPayload {
  options: any
}

interface AddAttributePayload {
  action: {
    action_data: any
  }
}

interface EditAttributePayload {
  action: {
    action_data: any
  }
}

interface DeleteAttributeActionPayload {
  inum: string
  name?: string
}

// Define error interface
interface ApiError {
  response?: {
    body?: {
      message?: string
    }
  }
  message?: string
}

function* newFunction(): Generator<any, AttributeApi, any> {
  const token = yield select((state: any) => state.authReducer.token.access_token)
  const issuer = yield select((state: any) => state.authReducer.issuer)
  const api = new JansConfigApi.AttributeApi(getClient(JansConfigApi, token, issuer))
  return new AttributeApi(api)
}

export function* getAttributes({
  payload,
}: PayloadAction<GetAttributesPayload>): Generator<any, any, any> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, PERSON_SCHEMA, payload)
    const attributeApi = yield call(newFunction)
    const data = yield call(attributeApi.getAllAttributes, payload.options)
    yield put(getAttributesResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    const error = e as ApiError
    yield put(getAttributesResponse({ data: undefined }))
    if (isFourZeroOneError(error)) {
      const jwt = yield select((state: any) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return error
  }
}

export function* searchAttributes({
  payload,
}: PayloadAction<GetAttributesPayload>): Generator<any, void, any> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, PERSON_SCHEMA, payload)
    const attributeApi = yield call(newFunction)
    const data = yield call(attributeApi.searchAttributes, payload.options)
    yield put(getAttributesResponse({ data }))
    yield call(postUserAction, audit)
  } catch (e) {
    const error = e as ApiError
    yield put(getAttributesResponse({ data: undefined }))
    if (isFourZeroOneError(error)) {
      const jwt = yield select((state: any) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* addAttribute({
  payload,
}: PayloadAction<AddAttributePayload>): Generator<any, any, any> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, CREATE, PERSON_SCHEMA, payload)
    const attributeApi = yield call(newFunction)
    const data = yield call(attributeApi.addNewAttribute, payload.action.action_data)
    yield put(updateToast(true, 'success'))
    yield put(addAttributeResponse({ data }))
    yield call(postUserAction, audit)
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })
    return data
  } catch (e) {
    const error = e as ApiError
    const errorMessage = error?.response?.body?.message || error.message
    yield put(updateToast(true, 'error', errorMessage))
    yield put(addAttributeResponse({ data: undefined }))
    if (isFourZeroOneError(error)) {
      const jwt = yield select((state: any) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return error
  }
}

export function* editAttribute({
  payload,
}: PayloadAction<EditAttributePayload>): Generator<any, any, any> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, UPDATE, PERSON_SCHEMA, payload)
    const attributeApi = yield call(newFunction)
    const data = yield call(attributeApi.editAnAttribute, payload.action.action_data)
    yield put(updateToast(true, 'success'))
    yield put(editAttributeResponse({ data }))
    yield call(postUserAction, audit)
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })
    return data
  } catch (e) {
    const error = e as ApiError
    const errorMessage = error?.response?.body?.message || error.message
    yield put(updateToast(true, 'error', errorMessage))
    yield put(editAttributeResponse({ data: undefined }))
    if (isFourZeroOneError(error)) {
      const jwt = yield select((state: any) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return error
  }
}

export function* deleteAttribute({
  payload,
}: PayloadAction<DeleteAttributeActionPayload>): Generator<any, any, any> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, DELETION, PERSON_SCHEMA, payload)
    const attributeApi = yield call(newFunction)
    const data = yield call(attributeApi.deleteAnAttribute, payload.inum)
    yield put(updateToast(true, 'success'))
    yield put(deleteAttributeResponse({ inum: payload.inum }))
    yield call(postUserAction, audit)
    yield* triggerWebhook({
      payload: { createdFeatureValue: { inum: payload?.inum, name: payload?.name } },
    })
    return data
  } catch (e) {
    const error = e as ApiError
    yield put(updateToast(true, 'error'))
    yield put(deleteAttributeResponse({ inum: payload.inum }))
    if (isFourZeroOneError(error)) {
      const jwt = yield select((state: any) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return error
  }
}

export function* watchGetAttributes(): Generator<any, void, any> {
  yield takeLatest('attribute/getAttributes', getAttributes)
}

export function* watchSearchAttributes(): Generator<any, void, any> {
  yield takeLatest('attribute/searchAttributes', searchAttributes)
}

export function* watchAddAttribute(): Generator<any, void, any> {
  yield takeLatest('attribute/addAttribute', addAttribute)
}

export function* watchEditAttribute(): Generator<any, void, any> {
  yield takeLatest('attribute/editAttribute', editAttribute)
}

export function* watchDeleteAttribute(): Generator<any, void, any> {
  yield takeLatest('attribute/deleteAttribute', deleteAttribute)
}

export default function* rootSaga(): Generator<any, void, any> {
  yield all([
    fork(watchGetAttributes),
    fork(watchSearchAttributes),
    fork(watchAddAttribute),
    fork(watchEditAttribute),
    fork(watchDeleteAttribute),
  ])
}
