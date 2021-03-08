/**
 * Attribute Sagas
 */
import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError, hasApiToken } from '../../utils/TokenController'
import {
  getAttributesResponse,
  addAttributeResponse,
  editAttributeResponse,
  deleteAttributeResponse,
  setApiError,
} from '../actions/AttributeActions'
import { getAPIAccessToken } from '../actions/AuthActions'
import {
  GET_ATTRIBUTES,
  ADD_ATTRIBUTE,
  EDIT_ATTRIBUTE,
  DELETE_ATTRIBUTE,
} from '../actions/types'
import AttributeApi from '../api/AttributeApi'
import { getClient } from '../api/base'
const JansConfigApi = require('jans_config_api')

export function* getAttributes() {
  try {
    const attributeApi = yield* newFunction()
    const data = yield call(attributeApi.getAllAttributes)
    yield put(getAttributesResponse(data))
  } catch (e) {
    if (isFourZeroOneError(e) && !hasApiToken()) {
      yield put(getAPIAccessToken())
    }
    yield put(setApiError(e))
  }
}

export function* addAttribute({ payload }) {
  try {
    const attributeApi = yield* newFunction()
    const data = yield call(attributeApi.addNewAttribute, payload.data)
    yield put(addAttributeResponse(data))
  } catch (error) {
    yield put(setApiError(error))
  }
}

export function* editAttribute({ payload }) {
  try {
    const attributeApi = yield* newFunction()
    const data = yield call(attributeApi.editAnAttribute, payload.data)
    yield put(editAttributeResponse(data))
  } catch (error) {
    yield put(setApiError(error))
  }
}

export function* deleteAttribute({ payload }) {
  try {
    const attributeApi = yield* newFunction()
    const data = yield call(attributeApi.deleteAnAttribute, payload.data)
    yield put(deleteAttributeResponse(data))
  } catch (error) {
    yield put(setApiError(error))
  }
}

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.AttributeApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new AttributeApi(api)
}

export function* watchGetAttributes() {
  yield takeLatest(GET_ATTRIBUTES, getAttributes)
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
    fork(watchAddAttribute),
    fork(watchEditAttribute),
    fork(watchDeleteAttribute),
  ])
}
