/**
 * Attribute Sagas
 */
import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError } from '../../../../app/utils/TokenController'
import {
  getAttributesResponse,
  addAttributeResponse,
  editAttributeResponse,
  deleteAttributeResponse,
} from '../actions/AttributeActions'
import { getAPIAccessToken } from '../actions/AuthActions'
import {
  GET_ATTRIBUTES,
  SEARCH_ATTRIBUTES,
  ADD_ATTRIBUTE,
  EDIT_ATTRIBUTE,
  DELETE_ATTRIBUTE,
} from '../actions/types'
import AttributeApi from '../api/AttributeApi'
import { getClient } from '../../../../app/redux/api/base'

const JansConfigApi = require('jans_config_api')

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.AttributeApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new AttributeApi(api)
}

export function* getAttributes({ payload }) {
  try {
    const attributeApi = yield* newFunction()
    const data = yield call(attributeApi.getAllAttributes, payload.options)
    yield put(getAttributesResponse(data))
  } catch (e) {
    yield put(getAttributesResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}
export function* searchAttributes({ payload }) {
  try {
    const attributeApi = yield* newFunction()
    const data = yield call(attributeApi.searchAttributes, payload.options)
    yield put(getAttributesResponse(data))
  } catch (e) {
    yield put(getAttributesResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* addAttribute({ payload }) {
  try {
    const attributeApi = yield* newFunction()
    const data = yield call(attributeApi.addNewAttribute, payload.data)
    yield put(addAttributeResponse(data))
  } catch (e) {
    yield put(addAttributeResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* editAttribute({ payload }) {
  try {
    const attributeApi = yield* newFunction()
    const data = yield call(attributeApi.editAnAttribute, payload.data)
    yield put(editAttributeResponse(data))
  } catch (e) {
    yield put(editAttributeResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* deleteAttribute({ payload }) {
  try {
    const attributeApi = yield* newFunction()
    const data = yield call(attributeApi.deleteAnAttribute, payload.inum)
    yield put(deleteAttributeResponse(payload.inum))
  } catch (e) {
    yield put(deleteAttributeResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetAttributes() {
  yield takeLatest(GET_ATTRIBUTES, getAttributes)
}

export function* watchSearchAttributes() {
  yield takeLatest(SEARCH_ATTRIBUTES, searchAttributes)
}

export function* watchAddAttribute() {
  yield takeLatest(ADD_ATTRIBUTE, addAttribute)
}

export function* watchEditAttribute() {
  yield takeLatest(EDIT_ATTRIBUTE, editAttribute)
}
export function* watchDeleteAttribute() {
  yield takeLatest(DELETE_ATTRIBUTE, deleteAttribute)
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
