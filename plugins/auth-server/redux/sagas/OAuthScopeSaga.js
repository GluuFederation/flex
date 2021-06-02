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
import { getAPIAccessToken } from '../actions/AuthActions'
import {
  getScopesResponse,
  getScopeByPatternResponse,
  addScopeResponse,
  editScopeResponse,
  deleteScopeResponse,
} from '../actions/ScopeActions'
import {
  GET_SCOPES,
  SEARCH_SCOPES,
  GET_SCOPE_BY_INUM,
  ADD_SCOPE,
  EDIT_SCOPE,
  DELETE_SCOPE,
  GET_SCOPE_BY_PATTERN,
} from '../actions/types'
import { SCOPE } from '../audit/Resources'
import {
  CREATE,
  UPDATE,
  DELETION,
  FETCH,
} from '../../../../app/audit/UserActionType'
import ScopeApi from '../api/ScopeApi'
import { getClient } from '../../../../app/redux/api/base'
import {
  isFourZeroOneError,
  addAdditionalData,
} from '../../../../app/utils/TokenController'
import { postUserAction } from '../../../../app/redux/api/backend-api'

const JansConfigApi = require('jans_config_api')

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.OAuthScopesApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new ScopeApi(api)
}
function* initAudit() {
  const auditlog = {}
  const client_id = yield select((state) => state.authReducer.config.clientId)
  const ip_address = yield select((state) => state.authReducer.location.IPv4)
  const userinfo = yield select((state) => state.authReducer.userinfo)
  const author = userinfo ? userinfo.family_name || userinfo.name : '-'
  auditlog['client_id'] = client_id
  auditlog['ip_address'] = ip_address
  auditlog['author'] = author
  auditlog['status'] = 'succeed'
  return auditlog
}

export function* getScopeByInum() {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, SCOPE, {})
    const scopeApi = yield* newFunction()
    const data = yield call(scopeApi.getScope)
    yield put(deleteScopeResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(deleteScopeResponse(null))
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
    const scopeApi = yield* newFunction()
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
export function* getScopeBasedOnOpts({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, SCOPE, payload)
    const scopeApi = yield* newFunction()
    const data = yield call(scopeApi.getScopeByOpts, payload.action.action_data)
    yield put(getScopeByPatternResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(getScopeByPatternResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* addAScope({ payload }) {
  console.log('======================= add' + JSON.stringify(payload))
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, CREATE, SCOPE, payload)
    const scopeApi = yield* newFunction()
    const data = yield call(scopeApi.addNewScope, payload.action.action_data)
    yield put(addScopeResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(addScopeResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* editAnScope({ payload }) {
  console.log('=======================edit ' + JSON.stringify(payload))
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, UPDATE, SCOPE, payload)
    const scopeApi = yield* newFunction()
    const data = yield call(scopeApi.editAScope, payload.action.action_data)
    yield put(editScopeResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(editScopeResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* deleteAnScope({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, DELETION, SCOPE, payload)
    const scopeApi = yield* newFunction()
    yield call(scopeApi.deleteAScope, payload.action.action_data)
    yield put(deleteScopeResponse(payload.action.action_data))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(deleteScopeResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.s.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetScopeByInum() {
  yield takeEvery(GET_SCOPE_BY_INUM, getScopeByInum)
}
export function* watchGetScopes() {
  yield takeLatest(GET_SCOPES, getScopes)
}
export function* watchSearchScopes() {
  yield takeLatest(SEARCH_SCOPES, getScopes)
}
export function* watchGetScopeByOpts() {
  yield takeLatest(GET_SCOPE_BY_PATTERN, getScopeBasedOnOpts)
}
export function* watchAddScope() {
  yield takeLatest(ADD_SCOPE, addAScope)
}
export function* watchEditScope() {
  yield takeLatest(EDIT_SCOPE, editAnScope)
}
export function* watchDeleteScope() {
  yield takeLatest(DELETE_SCOPE, deleteAnScope)
}

export default function* rootSaga() {
  yield all([
    fork(watchGetScopeByInum),
    fork(watchGetScopes),
    fork(watchSearchScopes),
    fork(watchGetScopeByOpts),
    fork(watchAddScope),
    fork(watchEditScope),
    fork(watchDeleteScope),
  ])
}
