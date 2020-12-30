/**
 * OAuth Scopes Sagas
 */
import { call, all, put, fork, takeEvery } from "redux-saga/effects";
import { getScope } from "../api/scope-api";
import { deleteScopeResponse } from "../actions/ScopeActions";

export function* getScopeByInum() {
  const data = yield call(getScope);
  yield put(deleteScopeResponse(data));
}

export function* getScopes() {
  yield put({
    type: "GET_SCOPE_BY_INUM_SUCCESS_ACTION"
  });
}

export function* watchGetScopeByInum() {
  yield takeEvery("GET_SCOPE_BY_INUM_REQUEST_ACTION", getScopeByInum);
}
export function* watchGetScopes() {
  yield takeEvery("GET_SCOPES_REQUEST_ACTION", getScopes);
}

export default function* rootSaga() {
  yield all([fork(watchGetScopeByInum), fork(watchGetScopes)]);
}
