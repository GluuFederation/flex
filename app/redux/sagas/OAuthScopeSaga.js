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
	getScopeResponse,
	addScopeResponse,
	editScopeResponse,
	deleteScopeResponse,
    setApiError,
} from '../actions/ScopeActions'
import {
	  GET_SCOPES,
	  GET_SCOPE_BY_INUM,
	  ADD_SCOPE,
	  EDIT_SCOPE,
	  DELETE_SCOPE,
	} from "../actions/types";
import ScopeApi from '../api/ScopeApi'
import { getClient } from '../api/base'
import { isFourZeroOneError } from '../../utils/TokenController'

const JansConfigApi = require('jans_config_api')

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.OAuthScopesApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new ScopeApi(api)
}

export function* getScopeByInum() {
  try {
    const scopeApi = yield* newFunction()
    const data = yield call(scopeApi.getScope)
    yield put(deleteScopeResponse(data))
  } catch (e) {
    yield put(deleteScopeResponse(null))
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
    yield put(getScopesResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* addAScope({payload}) {
		console.log('Scope Saga -  addAScope payload.data ='+JSON.stringify(payload.data))
	  try {
	    const scopeApi = yield* newFunction()
	    const data = yield call(scopeApi.addNewScope,payload.data)
		console.log('Scope Saga -  addScope response ='+JSON.stringify(data))
	    yield put(addScopeResponse(data))
	  } catch (e) {
	    yield put(addScopeResponse(null))
	    if (isFourZeroOneError(e)) {
	      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
	      yield put(getAPIAccessToken(jwt))
	    }
	  }
	}

export function* editAnScope({payload}) {
	console.log('Scope Saga -  editAnScope payload.data ='+JSON.stringify(payload.data))
  try {
    const scopeApi = yield* newFunction()
    const opts = {}
     opts['scope'] = payload.data
    const data = yield call(scopeApi.editAScope,opts)
	console.log('Scope Saga -  editAnScope response ='+JSON.stringify(data))
    yield put(editScopeResponse(data))
  } catch (e) {
    yield put(editScopeResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* deleteAnScope({ payload }) {
	console.log('Scope Saga -  deleteAnScope payload ='+JSON.stringify(payload))
	  try {
	    const scopeApi = yield* newFunction()
	    const data = yield call(scopeApi.deleteAScope, payload.inum)
	    yield put(deleteScopeResponse(data))
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
	  fork(watchAddScope),
	  fork(watchEditScope),
	  fork(watchDeleteScope),
	  ])
}
