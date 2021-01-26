/**
 * Openid Client Sagas
 */
import {
  call,
  all,
  put,
  fork,
  takeEvery,
  takeLatest
} from "redux-saga/effects";
import { getAllOpenidClients } from "../api/openid-client-api.js";
import {
  getOpenidClientsResponse,
  setApiError
} from "../actions/OpenidClientActions";
import { GET_OPENID_CLIENTS } from "../actions/types";

export function* getOauthOpenidClients() {
  try {
    const data = yield call(getAllOpenidClients);
    yield put(getOpenidClientsResponse(data));
  } catch (e) {
    yield put(setApiError(e));
  }
}

export function* watchGetOpenidClients() {
  yield takeLatest(GET_OPENID_CLIENTS, getOauthOpenidClients);
}

export default function* rootSaga() {
  yield all([fork(watchGetOpenidClients)]);
}
