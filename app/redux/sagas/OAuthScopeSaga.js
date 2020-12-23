/**
 * OAuth Scopes Sagas
 */
import { call, put, takeEvery } from "redux-saga/effects";
const JansConfigApi = require("jans_config_api");
const defaultClient = JansConfigApi.ApiClient.instance;
defaultClient.timeout = 80000;
const jansauth = defaultClient.authentications["jans-auth"];
jansauth.accessToken = "f1e08391-47be-4c51-9ce3-1013b1badad7";
defaultClient.basePath = "https://gluu.gasmyr.com".replace(/\/+$/, "");
defaultClient.defaultHeaders = "{'Access-Control-Allow-Origin', '*'}";

export function* helloSaga() {
  yield 10;
  console.log("Hello Sagas!");
}

export function* getScopeByInum() {
  const api = new JansConfigApi.OAuthScopesApi();
  const inum = "43F1"; // {String} scope ID.
  const callback = function(error, data, res) {
    if (error) {
      console.error(error);
    } else {
      console.info("=======data ===>" + JSON.stringify(data));
    }
  };
  const data = yield call(api.getOauthScopesByInum(inum, callback));
  yield put({
    type: "GET_SCOPE_BY_INUM_SUCCESS_ACTION",
    payload: data
  });
}

export function* watchGetScopeByInum() {
  yield takeEvery("GET_SCOPE_BY_INUM_REQUEST_ACTION", getScopeByInum);
}
