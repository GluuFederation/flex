import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import {
  isFourZeroOneError,
  addAdditionalData,
} from '../../../../app/utils/TokenController'
import {
  getAttributesResponse,
  addAttributeResponse,
  editAttributeResponse,
  deleteAttributeResponse,
} from '../actions/AttributeActions'
import { getAPIAccessToken } from 'Redux/actions/AuthActions'
import { postUserAction } from 'Redux/api/backend-api'
import {
  GET_ATTRIBUTES,
  SEARCH_ATTRIBUTES,
  ADD_ATTRIBUTE,
  EDIT_ATTRIBUTE,
  DELETE_ATTRIBUTE,
} from '../actions/types'
import {
  CREATE,
  UPDATE,
  DELETION,
  FETCH,
} from '../../../../app/audit/UserActionType'
import AttributeApi from '../api/AttributeApi'
import { getClient } from 'Redux/api/base'
import { initAudit } from 'Redux/sagas/SagaUtils'

const PERSON_SCHEMA = 'person schema'

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
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, PERSON_SCHEMA, payload)
    const attributeApi = yield* newFunction()
    const data = yield call(attributeApi.getAllAttributes, payload.options)
    yield put(getAttributesResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(getAttributesResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}
export function* searchAttributes({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, PERSON_SCHEMA, payload)
    const attributeApi = yield* newFunction()
    const data = yield call(attributeApi.searchAttributes, payload.options)
    yield put(getAttributesResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(getAttributesResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* addAttribute({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, CREATE, PERSON_SCHEMA, payload)
    const attributeApi = yield* newFunction()
    const data = yield call(attributeApi.addNewAttribute, payload.data)
    yield put(addAttributeResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(addAttributeResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* editAttribute({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, UPDATE, PERSON_SCHEMA, payload)
    const attributeApi = yield* newFunction()
    const data = yield call(attributeApi.editAnAttribute, payload.data)
    yield put(editAttributeResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(editAttributeResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* deleteAttribute({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, DELETION, PERSON_SCHEMA, payload)
    const attributeApi = yield* newFunction()
    yield call(attributeApi.deleteAnAttribute, payload.inum)
    yield put(deleteAttributeResponse(payload.inum))
    yield call(postUserAction, audit)
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
