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
  setCurrentItem,
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
import { getClient } from 'Redux/api/base'
import {
  isFourZeroOneError,
  addAdditionalData,
} from 'Utils/TokenController'
import { postUserAction } from 'Redux/api/backend-api'

const JansConfigApi = require('jans_config_api')
import { initAudit } from 'Redux/sagas/SagaUtils'

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.OAuthScopesApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new ScopeApi(api)
}

export function* getScopeByInum({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, SCOPE, {})
    const scopeApi = yield* newFunction()
    const data = yield call(scopeApi.getScope, payload.action)
    yield put(setCurrentItem(data))
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
