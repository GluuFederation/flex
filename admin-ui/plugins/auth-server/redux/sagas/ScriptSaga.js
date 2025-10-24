import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError } from 'Utils/TokenController'
import {
  getScriptsResponse,
  getScriptsByTypeResponse,
  getScriptResponse,
} from '../features/scriptSlice'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import ScriptApi from '../api/ScriptApi'
import { getClient } from 'Redux/api/base'
import * as JansConfigApi from 'jans_config_api'

function* getScriptApi() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.CustomScriptsApi(getClient(JansConfigApi, token, issuer))
  return new ScriptApi(api)
}

export function* getScripts({ payload }) {
  try {
    const api = yield* getScriptApi()
    const options = payload?.action || {}
    const data = yield call(api.getAllScripts, options)
    yield put(getScriptsResponse({ data }))
  } catch (e) {
    yield put(getScriptsResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* getScriptsByType({ payload }) {
  try {
    const api = yield* getScriptApi()
    const isString = typeof payload?.action === 'string'
    const scriptType =
      payload?.action?.type || (isString ? payload.action : 'PERSON_AUTHENTICATION')
    const options = !isString && typeof payload?.action === 'object' ? payload.action : {}
    const data = yield call(api.getScriptsByType, scriptType, options)
    yield put(getScriptsByTypeResponse({ data }))
  } catch (e) {
    yield put(getScriptsByTypeResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* getScript({ payload }) {
  try {
    const api = yield* getScriptApi()
    const data = yield call(api.getScript, payload.inum)
    yield put(getScriptResponse({ data }))
  } catch (e) {
    yield put(getScriptResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetScripts() {
  yield takeLatest('scripts/getScripts', getScripts)
}

export function* watchGetScriptsByType() {
  yield takeLatest('scripts/getScriptsByType', getScriptsByType)
}

export function* watchGetScript() {
  yield takeLatest('scripts/getScript', getScript)
}

export default function* rootSaga() {
  yield all([fork(watchGetScripts), fork(watchGetScriptsByType), fork(watchGetScript)])
}
