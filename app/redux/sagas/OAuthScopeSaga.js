/**
 * OAuth Scopes Sagas
 */
import {
  call,
  all,
  put,
  fork,
  takeEvery,
  takeLatest,
  select,
} from 'redux-saga/effects'
import { deleteScopeResponse, getScopesResponse } from '../actions/ScopeActions'
import { GET_SCOPES, GET_SCOPE_BY_INUM } from '../actions/types'
import ScopeApi from '../api/ScopeApi'
import { getClient } from '../api/base'
import { isFourZeroOneError } from '../../utils/TokenController'

const JansConfigApi = require('jans_config_api')

export function* getScopeByInum() {
  try {
    const scopeApi = yield* newFunction()
    const data = yield call(scopeApi.getScope)
    yield put(deleteScopeResponse(data))
  } catch (e) {
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* getScopes() {
  try {
    const scopeApi = yield* newFunction()
    const data = yield call(scopeApi.getAllScopes)
    yield put(getScopesResponse(data))
  } catch (e) {
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}
function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.OAuthScopesApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new ScopeApi(api)
}

export function* watchGetScopeByInum() {
  yield takeEvery(GET_SCOPE_BY_INUM, getScopeByInum)
}
export function* watchGetScopes() {
  yield takeLatest(GET_SCOPES, getScopes)
}

export default function* rootSaga() {
  yield all([fork(watchGetScopeByInum), fork(watchGetScopes)])
}
