import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError } from 'Utils/TokenController'
import { getAPIAccessToken } from 'Redux/actions/AuthActions'
import AcrApi from '../api/AcrApi'
import { getClient } from 'Redux/api/base'
import {
  setSimpleAuthAcrResponse,
  setLDAPAuthAcrResponse,
  setScriptAuthAcrResponse,
  setSuccess,
} from '../actions/AuthnActions'
import LdapApi from '../../../services/redux/api/LdapApi'
import ScriptApi from '../../../admin/redux/api/ScriptApi'
import {
  PUT_SIMPLE_AUTH_ACR,
  PUT_LDAP_AUTH_ACR,
  PUT_SCRIPT_ACR,
} from '../actions/types'
import {updateToast} from 'Redux/actions/ToastAction'
const JansConfigApi = require('jans_config_api')

function* newACRFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.DefaultAuthenticationMethodApi(
    getClient(JansConfigApi, token, issuer)
  )
  return new AcrApi(api)
}

function* newLDAPFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.DatabaseLDAPConfigurationApi(
    getClient(JansConfigApi, token, issuer)
  )
  return new LdapApi(api)
}

function* newScriptFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.CustomScriptsApi(
    getClient(JansConfigApi, token, issuer)
  )
  return new ScriptApi(api)
}

export function* editSimpleAuthAcr({ payload }) {
  try {
    const api = yield* newACRFunction()
    const data = yield call(api.updateAcrsConfig, payload.data)
    yield put(setSimpleAuthAcrResponse(data))
    yield put(setSuccess(true))
  } catch (e) {
    yield put(setSimpleAuthAcrResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    yield put(setSuccess(false))
  }
}

export function* editLDAPAuthAcr({ payload }) {
  try {
    const api = yield* newLDAPFunction()
    const data = yield call(api.updateLdapConfig, payload.data)
    yield put(setLDAPAuthAcrResponse(data))
    yield put(setSuccess(true))
  } catch (e) {
    yield put(setLDAPAuthAcrResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    yield put(setSuccess(false))
  }
}

export function* editScriptAuthAcr({ payload }) {
  try {
    const api = yield* newScriptFunction()
    const data = yield call(api.editCustomScript, payload.data)
    yield put(setScriptAuthAcrResponse(data))
    yield put(setSuccess(true))
  } catch (e) {
    yield put(setScriptAuthAcrResponse(null))
    yield put(setSuccess(false))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchPutSimpleAcrsConfig() {
  yield takeLatest(PUT_SIMPLE_AUTH_ACR, editSimpleAuthAcr)
}

export function* watchPutLDAPAcrsConfig() {
  yield takeLatest(PUT_LDAP_AUTH_ACR, editLDAPAuthAcr)
}

export function* watchPutScriptAcrsConfig() {
  yield takeLatest(PUT_SCRIPT_ACR, editScriptAuthAcr)
}
export default function* rootSaga() {
  yield all([
    fork(watchPutSimpleAcrsConfig),
    fork(watchPutLDAPAcrsConfig),
    fork(watchPutScriptAcrsConfig),
  ])
}
