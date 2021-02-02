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
function* getAPIAccessTokenWorker() {
  try {
    const response = yield call(fetchApiAccessToken);
    if (response) {
      yield put(getAPIAccessTokenResponse(response.access_token));
      return;
    }
  } catch (error) {
    console.log("Problems getting API Access Token.", error);
  }
  yield put(getAPIAccessTokenResponse());
}

//watcher sagas
export function* getAPIAccessToken() {
  yield takeEvery(GET_API_ACCESS_TOKEN, getAPIAccessTokenWorker);
}

export function* userInfoWatcher() {
  yield takeEvery(USERINFO_REQUEST, getUserInformationWorker);
}

export function* getOAuth2Config() {
  yield takeEvery(GET_OAUTH2_CONFIG, getOAuth2ConfigWorker);
}

/**
 * Auth Root Saga
 */
export default function* rootSaga() {
  yield all([
    fork(getOAuth2Config),
    fork(userInfoWatcher),
    fork(getAPIAccessToken)
  ]);
}
