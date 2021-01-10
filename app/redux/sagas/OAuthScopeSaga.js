/**
 * OAuth Scopes Sagas
 */
import { call, all, put, fork, takeEvery } from "redux-saga/effects";
import { getScope, getAllScopes } from "../api/scope-api";
import {
  deleteScopeResponse,
  getScopesResponse
} from "../actions/ScopeActions";
import { GET_SCOPES, GET_SCOPE_BY_INUM } from "../actions/types";
export function* getScopeByInum() {
  const data = yield call(getScope);
  yield put(deleteScopeResponse(data));
}

export function* getScopes() {
  console.log("***********calling the scopes list**********");
  const data = yield call(getAllScopes);
  yield put(getScopesResponse(data));
}

export function* watchGetScopeByInum() {
  yield takeEvery(GET_SCOPE_BY_INUM, getScopeByInum);
}
export function* watchGetScopes() {
  yield takeEvery(GET_SCOPES, getScopes);
}

export default function* rootSaga() {
  yield all([fork(watchGetScopeByInum), fork(watchGetScopes)]);
}
