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
import { RootState, JansAttribute, AttributePagedResult, SagaError } from '../../types'
import {
  GetAttributesAction,
  SearchAttributesAction,
  AddAttributeAction,
  EditAttributeAction,
  DeleteAttributeAction,
} from '../types/AttributeSagaTypes'

const PERSON_SCHEMA = 'person schema'

import * as JansConfigApi from 'jans_config_api'

function* newFunction() {
  const token: string = yield select((state: RootState) => state.authReducer.token.access_token)
  const issuer: string = yield select((state: RootState) => state.authReducer.issuer)
  const api = new JansConfigApi.AttributeApi(getClient(JansConfigApi, token, issuer))
  return new AttributeApi(api)
}

export function* getAttributes({ payload }: GetAttributesAction) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, PERSON_SCHEMA, payload)
    const attributeApi: AttributeApi = yield* newFunction()
    const data: AttributePagedResult = yield call(attributeApi.getAllAttributes, payload.options)
    yield put(getAttributesResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(getAttributesResponse({ data: undefined }))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}
export function* searchAttributes({ payload }: SearchAttributesAction) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, PERSON_SCHEMA, payload)
    const attributeApi: AttributeApi = yield* newFunction()
    const data: AttributePagedResult = yield call(attributeApi.searchAttributes, payload.options)
    yield put(getAttributesResponse({ data }))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(getAttributesResponse({ data: undefined }))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* addAttribute({ payload }: AddAttributeAction) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, CREATE, PERSON_SCHEMA, payload)
    const attributeApi: AttributeApi = yield* newFunction()
    const data: JansAttribute = yield call(attributeApi.addNewAttribute, payload.action.action_data)
    yield put(updateToast(true, 'success'))
    yield put(addAttributeResponse({ data }))
    yield call(postUserAction, audit)
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })
    return data
  } catch (e) {
    const error = e as SagaError
    const errorMessage = error?.response?.body?.message || error.message
    yield put(updateToast(true, 'error', errorMessage))
    yield put(addAttributeResponse({ data: undefined }))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* editAttribute({ payload }: EditAttributeAction) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, UPDATE, PERSON_SCHEMA, payload)
    const attributeApi: AttributeApi = yield* newFunction()
    const data: JansAttribute = yield call(attributeApi.editAnAttribute, payload.action.action_data)
    yield put(updateToast(true, 'success'))
    yield put(editAttributeResponse({ data }))
    yield call(postUserAction, audit)
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })
    return data
  } catch (e) {
    const error = e as SagaError
    const errorMessage = error?.response?.body?.message || error.message
    yield put(updateToast(true, 'error', errorMessage))
    yield put(editAttributeResponse({ data: undefined }))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* deleteAttribute({ payload }: DeleteAttributeAction) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, DELETION, PERSON_SCHEMA, payload)
    const attributeApi: AttributeApi = yield* newFunction()
    const data: void = yield call(attributeApi.deleteAnAttribute, payload.inum)
    yield put(updateToast(true, 'success'))
    yield put(deleteAttributeResponse({ inum: payload.inum }))
    yield call(postUserAction, audit)
    yield* triggerWebhook({
      payload: { createdFeatureValue: { inum: payload?.inum, name: payload?.name } },
    })
    return data
  } catch (e) {
    yield put(updateToast(true, 'error'))
    yield put(deleteAttributeResponse({ inum: undefined }))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* watchGetAttributes() {
  yield takeLatest('attribute/getAttributes', getAttributes)
}

export function* watchSearchAttributes() {
  yield takeLatest('attribute/searchAttributes', searchAttributes)
}

export function* watchAddAttribute() {
  yield takeLatest('attribute/addAttribute', addAttribute)
}

export function* watchEditAttribute() {
  yield takeLatest('attribute/editAttribute', editAttribute)
}
export function* watchDeleteAttribute() {
  yield takeLatest('attribute/deleteAttribute', deleteAttribute)
}

export default function* rootSaga() {
  yield all([
    fork(watchGetAttributes),
    fork(watchSearchAttributes),
    fork(watchAddAttribute),
    fork(watchEditAttribute),
    fork(watchDeleteAttribute),
  ])
}
