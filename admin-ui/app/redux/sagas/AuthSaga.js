/**
 * Auth Sagas
 */
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import {
  GET_OAUTH2_CONFIG,
  GET_API_ACCESS_TOKEN,
  USERINFO_REQUEST,
  GET_USER_LOCATION,
} from '../actions/types';
import {
  getOAuth2ConfigResponse,
  getUserInfoResponse,
  getAPIAccessTokenResponse,
  getUserLocationResponse,
} from '../actions';

import {
  fetchServerConfiguration,
  fetchUserInformation,
  fetchApiAccessToken,
  getUserIpAndLocation,
  fetchApiTokenWithDefaultScopes,
} from '../api/backend-api';

function* getApiTokenWithDefaultScopes() {
  const response = yield call(fetchApiTokenWithDefaultScopes);
  return response.access_token;
}

function* getOAuth2ConfigWorker() {
  try {
    const token = yield* getApiTokenWithDefaultScopes();
    const response = yield call(fetchServerConfiguration, token);
    if (response) {
      yield put(getOAuth2ConfigResponse(response));
      return;
    }
  } catch (error) {
    console.log('Problems getting OAuth2 configuration.', error);
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
    console.log('Problems getting user information.', error);
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
    console.log('Problems getting API Access Token.', error);
  }
}

function* getLocationWorker() {
  try {
    const response = yield call(getUserIpAndLocation);
    if (response) {
      yield put(getUserLocationResponse(response));
      return;
    }
  } catch (error) {
    console.log('Problem getting user location.', error);
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
export function* getLocationWatcher() {
  yield takeEvery(GET_USER_LOCATION, getLocationWorker);
}

/**
 * Auth Root Saga
 */
export default function* rootSaga() {
  yield all([
    fork(getOAuth2ConfigWatcher),
    fork(userInfoWatcher),
    fork(getApiTokenWatcher),
    fork(getLocationWatcher),
  ]);
}
