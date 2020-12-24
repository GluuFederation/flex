/**
 * OAuth Scopes Sagas
 */
import { call, all, put, fork, takeEvery } from "redux-saga/effects";
import { deleteScope, getAllScopes, getScope } from "../api/scope-api";
const JansConfigApi = require("jans_config_api");
const defaultClient = JansConfigApi.ApiClient.instance;
defaultClient.timeout = 80000;
defaultClient.basePath = "https://gluu.gasmyr.com".replace(/\/+$/, "");
defaultClient.defaultHeaders = "{'Access-Control-Allow-Origin', '*'}";
const jansauth = defaultClient.authentications["jans-auth"];
jansauth.accessToken = "f1e08391-47be-4c51-9ce3-1013b1badad7";

export function* getScopeByInum() {
  const data = yield call(getScope);
  yield put({
    type: "GET_SCOPE_BY_INUM_SUCCESS_ACTION",
    payload: data
  });
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
