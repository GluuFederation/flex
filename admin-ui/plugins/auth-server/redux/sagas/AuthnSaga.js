import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError } from 'Utils/TokenController'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import AcrApi from '../api/AcrApi'
import { getClient } from 'Redux/api/base'
import {
  setSimpleAuthAcrResponse,
  setLDAPAuthAcrResponse,
  setScriptAuthAcrResponse,
  setSuccess,
} from '../features/authNSlice'
import LdapApi from '../../../services/redux/api/LdapApi'
import * as JansConfigApi from 'jans_config_api'

function* newACRFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.DefaultAuthenticationMethodApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new AcrApi(api)
}

function* newLDAPFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.DatabaseLDAPConfigurationApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new LdapApi(api)
}

export function* editSimpleAuthAcr({ payload }) {
  try {
    const api = yield* newACRFunction()
    const data = yield call(api.updateAcrsConfig, payload.data)
    yield put(setSimpleAuthAcrResponse({ data }))
    yield put(setSuccess({ data: true }))
    return data
  } catch (e) {
    yield put(setSimpleAuthAcrResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    yield put(setSuccess({ data: false }))
    return e
  }
}

export function* editLDAPAuthAcr({ payload }) {
  try {
    const api = yield* newLDAPFunction()
    const data = yield call(api.updateLdapConfig, payload.data)
    yield put(setLDAPAuthAcrResponse({ data }))
    yield put(setSuccess({ data: true }))
  } catch (e) {
    yield put(setLDAPAuthAcrResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    yield put(setSuccess({ data: false }))
  }
}

export function* editScriptAuthAcr({ payload }) {
  try {
    // Use JansConfigApi directly instead of ScriptApi wrapper
    const token = yield select((state) => state.authReducer.token.access_token)
    const issuer = yield select((state) => state.authReducer.issuer)
    const scriptApi = new JansConfigApi.CustomScriptsApi(getClient(JansConfigApi, token, issuer))

    // Call putConfigScripts directly (orval-compatible method)
    const data = yield call([scriptApi, scriptApi.putConfigScripts], payload.data)
    yield put(setScriptAuthAcrResponse({ data }))
    yield put(setSuccess({ data: true }))
  } catch (e) {
    yield put(setScriptAuthAcrResponse(null))
    yield put(setSuccess({ data: false }))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchPutSimpleAcrsConfig() {
  yield takeLatest('authN/editSimpleAuthAcr', editSimpleAuthAcr)
}

export function* watchPutLDAPAcrsConfig() {
  yield takeLatest('authN/editLDAPAuthAcr', editLDAPAuthAcr)
}

export function* watchPutScriptAcrsConfig() {
  yield takeLatest('authN/editScriptAuthAcr', editScriptAuthAcr)
}
export default function* rootSaga() {
  yield all([
    fork(watchPutSimpleAcrsConfig),
    fork(watchPutLDAPAcrsConfig),
    fork(watchPutScriptAcrsConfig),
  ])
}
