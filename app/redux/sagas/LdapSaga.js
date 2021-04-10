import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError, hasApiToken } from '../../utils/TokenController'
import {
  getLdapResponse,
  editLdapResponse,
  deleteLdapResponse,
  testLdapResponse,
} from '../actions/LdapActions'
import { getAPIAccessToken } from '../actions/AuthActions'
import {
  GET_LDAP,
  PUT_LDAP,
  ADD_LDAP,
  DELETE_LDAP,
  TEST_LDAP,
} from '../actions/types'
import LdapApi from '../api/LdapApi'
import { getClient } from '../api/base'
const JansConfigApi = require('jans_config_api')

export function* getLdap() {
  try {
    const api = yield* newFunction()
    const data = yield call(api.getLdapConfig)
    yield put(getLdapResponse(data))
  } catch (e) {
    yield put(getLdapResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* addLdap({ payload }) {
  try {
    const api = yield* newFunction()
    const data = yield call(api.addLdapConfig, payload.data)
    yield put(addLdapResponse(data))
  } catch (e) {
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* editLdap({ payload }) {
  try {
    const api = yield* newFunction()
    const data = yield call(api.updateLdapConfig, payload.data)
    yield put(editLdapResponse(data))
  } catch (e) {
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

//delete
export function* deleteLdap({ payload }) {
  try {
    const api = yield* newFunction()
    const data = yield call(api.deleteLdapConfig, payload.configId)
    yield put(deleteLdapResponse(payload.configId))
  } catch (e) {
    yield put(deleteLdapResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* testLdap({ payload }) {
  try {
    const api = yield* newFunction()
    const data = yield call(api.testLdapConfig, payload.data)
    yield put(testLdapResponse(data))
  } catch (e) {
    yield put(testLdapResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.DatabaseLDAPConfigurationApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new LdapApi(api)
}

export function* watchGetLdapConfig() {
  yield takeLatest(GET_LDAP, getLdap)
}

export function* watchPutLdapConfig() {
  yield takeLatest(PUT_LDAP, editLdap)
}

export function* watchAddLdapConfig() {
  yield takeLatest(ADD_LDAP, addLdap)
}

export function* watchDeleteLdap() {
  yield takeLatest(DELETE_LDAP, deleteLdap)
}

export function* watchTestLdapConfig() {
  yield takeLatest(TEST_LDAP, testLdap)
}

export default function* rootSaga() {
  yield all([
    fork(watchGetLdapConfig),
    fork(watchPutLdapConfig),
    fork(watchAddLdapConfig),
    fork(watchDeleteLdap),
    fork(watchTestLdapConfig),
  ])
}
