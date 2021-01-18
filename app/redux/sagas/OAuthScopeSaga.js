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
  try {
    const data = yield call(getAllScopes);
    console.log(
      "=======================received from backend " + JSON.stringify(data)
    );
    yield put(getScopesResponse(data));
    console.log(
      "=======================put in the store " + JSON.stringify(data)
    );
  } catch (e) {
    console.log("-------------------" + e);
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
