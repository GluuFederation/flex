/**
 * OAuth Scopes Sagas
 */
import {
  call,
  all,
  put,
  fork,
  takeEvery,
  takeLatest
} from "redux-saga/effects";
import { getScope, getAllScopes, deleteScope } from "../api/scope-api";
import {
  deleteScopeResponse,
  getScopesResponse,
  setApiError
} from "../actions/ScopeActions";
import { GET_SCOPES, GET_SCOPE_BY_INUM } from "../actions/types";

export function* getScopeByInum() {
  try {
    const data = yield call(getScope);
    yield put(deleteScopeResponse(data));
  } catch (e) {
    yield put(setApiError(e));
  }
}

export function* getScopes() {
  try {
    const data = yield call(getAllScopes);
    yield put(getScopesResponse(data));
  } catch (e) {
    console.log("===============================error" + e);
    yield put(setApiError(e));
  }
}

export function* watchGetScopeByInum() {
  yield takeEvery(GET_SCOPE_BY_INUM, getScopeByInum);
}
export function* watchGetScopes() {
  yield takeLatest(GET_SCOPES, getScopes);
}

export default function* rootSaga() {
  yield all([fork(watchGetScopeByInum), fork(watchGetScopes)]);
}
