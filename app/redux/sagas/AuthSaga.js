/**
 * Auth Sagas
 */
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  GET_OAUTH2_CONFIG,
  GET_API_ACCESS_TOKEN,
  USERINFO_REQUEST
} from "../actions/types";
import {
  getOAuth2ConfigResponse,
  getUserInfoResponse,
  getAPIAccessTokenResponse
} from "../actions";

import {
  fetchServerConfiguration,
  fetchUserInformation,
  fetchApiAccessToken
} from "../api/backend-api";

function* getOAuth2ConfigWorker() {
  try {
    const response = yield call(fetchServerConfiguration);
    if (response) {
      yield put(getOAuth2ConfigResponse(response));
      return;
    }
  } catch (error) {
    console.log("Problems getting OAuth2 configuration.", error);
  }
  yield put(getOAuth2ConfigResponse());
}

function* getUserInformationWorker({ payload }) {
  try {
    const response = yield call(fetchUserInformation, payload.code);
    if (response) {
      yield put(getUserInfoResponse(response.claims, response.jwtUserInfo));
      return;
    }
  } catch (error) {
    console.log("Problems getting user information.", error);
  }
}
function* getAPIAccessTokenWorker({ payload }) {
  try {
    if (payload.jwt) {
      const response = yield call(fetchApiAccessToken, payload.jwt);
      if (response) {
        yield put(getAPIAccessTokenResponse(response));
        return;
      }
    }
  } catch (error) {
    console.log("Problems getting API Access Token.", error);
  }
}

//watcher sagas
export function* getApiTokenWatcher() {
  yield takeEvery(GET_API_ACCESS_TOKEN, getAPIAccessTokenWorker);
}

export function* userInfoWatcher() {
  yield takeEvery(USERINFO_REQUEST, getUserInformationWorker);
}

export function* getOAuth2ConfigWatcher() {
  yield takeEvery(GET_OAUTH2_CONFIG, getOAuth2ConfigWorker);
}

/**
 * Auth Root Saga
 */
export default function* rootSaga() {
  yield all([
    fork(getOAuth2ConfigWatcher),
    fork(userInfoWatcher),
    fork(getApiTokenWatcher)
  ]);
}
