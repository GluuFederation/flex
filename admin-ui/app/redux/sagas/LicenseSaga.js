/**
 * License Sagas
 */
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { CHECK_FOR_VALID_LICENSE, ACTIVATE_LICENSE } from '../actions/types';
import {
  checkLicensePresentResponse,
  activateLicenseResponse,
} from '../actions';

import { checkLicensePresent, activateLicense, fetchApiTokenWithDefaultScopes } from '../api/backend-api';

function* getApiTokenWithDefaultScopes() {
  const response = yield call(fetchApiTokenWithDefaultScopes);
  return response.access_token;
}

function* checkLicensePresentWorker() {
  try {
    const token = yield* getApiTokenWithDefaultScopes();
    const response = yield call(checkLicensePresent, token);
    if (response) {
      yield put(checkLicensePresentResponse(response));
      return;
    }
  } catch (error) {
    console.log('Error in checking License present.', error);
  }
  yield put(checkLicensePresentResponse());
}

function* activateLicenseWorker({ payload }) {
  try {
    const token = yield* getApiTokenWithDefaultScopes();
    const response = yield call(activateLicense, payload.licenseKey, token);
    if (response) {
      yield put(activateLicenseResponse(response));
      return;
    }
  } catch (error) {
    console.log('Error in activating license.', error);
  }
  yield put(activateLicenseResponse());
}

//watcher sagas
export function* checkLicensePresentWatcher() {
  yield takeEvery(CHECK_FOR_VALID_LICENSE, checkLicensePresentWorker);
}

export function* activateLicenseWatcher() {
  yield takeEvery(ACTIVATE_LICENSE, activateLicenseWorker);
}

/**
 * License Root Saga
 */
export default function* rootSaga() {
  yield all([fork(checkLicensePresentWatcher), fork(activateLicenseWatcher)]);
}
