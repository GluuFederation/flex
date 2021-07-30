import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import {
  isFourZeroOneError,
  addAdditionalData,
} from '../../utils/TokenController'
import {
  getAttributesResponse,
  getScriptsResponse,
  getScopesResponse,
  getClientsResponse,
} from '../actions/InitActions'
import { getAPIAccessToken } from '../actions/AuthActions'
import {
  GET_SCOPES_FOR_STAT,
  GET_SCRIPTS_FOR_STAT,
  GET_CLIENTS_FOR_STAT,
  GET_ATTRIBUTES_FOR_STAT,
} from '../actions/types'
import InitApi from '../api/InitApi'
import { getClient } from '../api/base'
const JansConfigApi = require('jans_config_api')

function* initScripts() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.CustomScriptsApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new InitApi(api)
}

function* initScopes() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.OAuthScopesApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new InitApi(api)
}

function* initClients() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.OAuthOpenIDConnectClientsApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new InitApi(api)
}

function* initAttributes() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.AttributeApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new InitApi(api)
}

export function* getScripts({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, SCRIPT, payload)
    const scriptApi = yield* initScripts()
    const data = yield call(scriptApi.getAllCustomScript)
    yield put(getScriptsResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(getScriptsResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* getClients({ payload }) {
  const audit = yield* initAudit()
  try {
    payload = payload ? payload : { action: {} }
    addAdditionalData(audit, FETCH, OIDC, payload)
    const openIdApi = yield* initClients()
    const data = yield call(
      openIdApi.getAllOpenidClients,
      payload.action.action_data,
    )
    yield put(getClientsResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    console.log(e)
    yield put(getClientsResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* getScopes({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, SCOPE, payload)
    const scopeApi = yield* initScopes()
    const data = yield call(scopeApi.getAllScopes, payload.action.action_data)
    yield put(getScopesResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(getScopesResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* getAttributes({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, SCOPE, payload)
    const attributeApi = yield* initAttributes()
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

export function* watchGetScripts() {
  yield takeLatest(GET_SCRIPTS_FOR_STAT, getScripts)
}
export function* watchGetClients() {
  yield takeLatest(GET_CLIENTS_FOR_STAT, getClients)
}
export function* watchGetScopes() {
  yield takeLatest(GET_SCOPES_FOR_STAT, getScopes)
}
export function* watchGetAttributes() {
  yield takeLatest(GET_ATTRIBUTES_FOR_STAT, getAttributes)
}
export default function* rootSaga() {
  yield all([
    fork(watchGetScripts),
    fork(watchGetClients),
    fork(watchGetScopes),
    fork(watchGetAttributes),
  ])
}
