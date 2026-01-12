// @ts-nocheck
import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import {
  getAttributesResponse,
  getScriptsResponse,
  getScopesResponse,
  getClientsResponse,
} from '../features/initSlice'
import { postUserAction } from '../api/backend-api'
import { initAudit, redirectToLogout } from '../sagas/SagaUtils'
import InitApi from '../api/InitApi'
import { getClient } from '../api/base'
const JansConfigApi = require('jans_config_api')

function* initScripts() {
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.CustomScriptsApi(getClient(JansConfigApi, null, issuer))
  return new InitApi(api)
}

function* initScopes() {
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.OAuthScopesApi(getClient(JansConfigApi, null, issuer))
  return new InitApi(api)
}

function* initClients() {
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.OAuthOpenIDConnectClientsApi(getClient(JansConfigApi, null, issuer))
  return new InitApi(api)
}

function* initAttributes() {
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.AttributeApi(getClient(JansConfigApi, null, issuer))
  return new InitApi(api)
}

export function* getScripts({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, 'FETCH SCRIPTS FOR STAT', 'SCRIPT', payload)
    const scriptApi = yield* initScripts()
    const data = yield call(scriptApi.getScripts, payload.action.action_data)
    yield put(getScriptsResponse({ data }))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(getScriptsResponse(null))
    if (isFourZeroOneError(e)) {
      yield* redirectToLogout()
      return
    }
  }
}

export function* getClients({ payload }) {
  const audit = yield* initAudit()
  try {
    payload = payload ? payload : { action: {} }
    addAdditionalData(audit, 'FETCH CIENTS FOR STAT', 'OIDC', payload)
    const openIdApi = yield* initClients()
    const data = yield call(openIdApi.getClients, payload.action.action_data)
    yield put(getClientsResponse({ data }))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(getClientsResponse(null))
    if (isFourZeroOneError(e)) {
      yield* redirectToLogout()
      return
    }
  }
}

export function* getScopes({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, 'FETCH SCOPES FOR STAT', 'SCOPE', payload)
    const scopeApi = yield* initScopes()
    const data = yield call(scopeApi.getScopes, payload.action.action_data)
    yield put(getScopesResponse({ data }))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(getScopesResponse(null))
    if (isFourZeroOneError(e)) {
      yield* redirectToLogout()
      return
    }
  }
}

export function* getAttributes({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, 'FETCH ATTRIBUTES FOR STAT', 'SCOPE', payload)
    const attributeApi = yield* initAttributes()
    const data = yield call(attributeApi.getAttributes, payload.options)
    yield put(getAttributesResponse({ data }))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(getAttributesResponse(null))
    if (isFourZeroOneError(e)) {
      yield* redirectToLogout()
      return
    }
  }
}

export function* watchGetScripts() {
  yield takeLatest('init/getScripts', getScripts)
}
export function* watchGetClients() {
  yield takeLatest('init/getClients', getClients)
}
export function* watchGetScopes() {
  yield takeLatest('init/getScopes', getScopes)
}
export function* watchGetAttributes() {
  yield takeLatest('init/getAttributes', getAttributes)
}
export default function* rootSaga() {
  yield all([
    fork(watchGetScripts),
    fork(watchGetClients),
    fork(watchGetScopes),
    fork(watchGetAttributes),
  ])
}
