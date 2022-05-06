/**
 * License Sagas
 */
import { all, call, fork, put, take, takeEvery } from 'redux-saga/effects'
import {
  CHECK_FOR_VALID_LICENSE,
  ACTIVATE_CHECK_USER_API,
  ACTIVATE_CHECK_USER_LICENSE_KEY,
} from '../actions/types'
import { checkLicensePresentResponse } from '../actions'

import LicenseApi from '../api/LicenseApi'
import { getClient, getClientWithToken } from '../api/base'
import {
  checkUserApiKeyResponse,
  checkUserLicenseKeyResponse,
} from '../actions'
import {
  checkLicensePresent,
  activateLicense,
  fetchApiTokenWithDefaultScopes,
} from '../api/backend-api'

const JansConfigApi = require('jans_config_api')

function* getApiTokenWithDefaultScopes() {
  const response = yield call(fetchApiTokenWithDefaultScopes)
  const api = new JansConfigApi.AdminUILicenseApi(
    getClientWithToken(JansConfigApi, response.access_token),
  )
  return new LicenseApi(api)
}

function* checkLicensePresentWorker() {
  try {
    const licenseApi = yield* getApiTokenWithDefaultScopes()
    const response = yield call(licenseApi.getIsActive)
    if (response) {
      yield put(checkLicensePresentResponse(response.apiResult))
      return
    }
    yield put(checkLicensePresentResponse(false))
  } catch (error) {
    console.log('Error in checking License present.', error);
  }
  yield put(checkLicensePresentResponse());
}

function* activateCheckUserApi({ payload }) {
  try {
    const licenseApi = yield* getApiTokenWithDefaultScopes()
    const response = yield call(licenseApi.submitApiKey, payload)
    yield put(checkUserApiKeyResponse(response))
  } catch (error) {
    console.log(error)
  }
}
function* activateCheckUserLicenseKey({ payload }) {
  try {
    const licenseApi = yield* getApiTokenWithDefaultScopes()
    const response = yield call(licenseApi.submitLicenseKey, payload)
    yield put(checkUserLicenseKeyResponse(response))
  } catch (error) {
    console.log(error)
  }
}

//watcher sagas
export function* checkLicensePresentWatcher() {
  yield takeEvery(CHECK_FOR_VALID_LICENSE, checkLicensePresentWorker)
  yield takeEvery(ACTIVATE_CHECK_USER_LICENSE_KEY, activateCheckUserLicenseKey)
}

export function* activateCheckApiKeyWatcher() {
  yield takeEvery(ACTIVATE_CHECK_USER_API, activateCheckUserApi)
}
/**
 * License Root Saga
 */
export default function* rootSaga() {
  yield all([
    fork(checkLicensePresentWatcher),
    fork(activateCheckApiKeyWatcher),
  ])
}
