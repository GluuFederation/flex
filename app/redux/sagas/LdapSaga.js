import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError, hasApiToken } from '../../utils/TokenController'
import { getLdapResponse, editLdapResponse } from '../actions/LdapActions'
import { getAPIAccessToken } from '../actions/AuthActions'
import { GET_LDAP, PUT_LDAP } from '../actions/types'
import LdapApi from '../api/LdapApi'
import { getClient } from '../api/base'
const JansConfigApi = require('jans_config_api')

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.DatabaseLDAPConfigurationApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new LdapApi(api)
}

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

export function* editLdap({ payload }) {
  try {
    const api = yield* newFunction()
    const data = yield call(api.updateLdapConfig, payload.data)
    yield put(editLdapResponse(data))
  } catch (e) {
    yield put(editLdapResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetLdapConfig() {
  yield takeLatest(GET_LDAP, getLdap)
}

export function* watchPutLdapConfig() {
  yield takeLatest(PUT_LDAP, editLdap)
}
export default function* rootSaga() {
  yield all([fork(watchGetLdapConfig), fork(watchPutLdapConfig)])
}
