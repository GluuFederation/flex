/**
 * License Sagas
 */
import { all, call, fork, put, take, takeEvery } from 'redux-saga/effects'
import { checkLicenseConfigValidResponse, checkLicensePresentResponse, checkLicensePresent, getOAuth2Config, uploadNewSsaTokenResponse } from '../actions'
import { updateToast } from 'Redux/features/toastSlice'

import LicenseApi from '../api/LicenseApi'
import { getClient, getClientWithToken } from '../api/base'
import {
  checkUserLicenseKeyResponse,
} from '../actions'
import {
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
      yield put(checkLicensePresentResponse({ isLicenseValid: response.apiResult }))
      return
    }
    yield put(checkLicensePresentResponse({ isLicenseValid: false }))
  } catch (error) {
    console.log('Error in checking License present.', error)
  }
  yield put(checkLicensePresentResponse())
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
function* uploadNewSsaToken({ payload }) {
  try {
    const licenseApi = yield* getApiTokenWithDefaultScopes()
    const response = yield call(licenseApi.uploadSSAtoken, payload)
    if(!response?.apiResult){
      yield put(uploadNewSsaTokenResponse("Invalid SSA. Please contact Gluu's team to verify if SSA is correct."))
    }
    yield put(checkLicenseConfigValidResponse(response?.apiResult))
    yield put(getOAuth2Config())
    yield put(checkLicensePresent())
    // window.location.reload()
  } catch (error) {
    console.log(error)
  }
}

function* checkAdminuiLicenseConfig() {
  try {
    const licenseApi = yield* getApiTokenWithDefaultScopes()
    const response = yield call(licenseApi.checkAdminuiLicenseConfig)
    yield put(checkLicenseConfigValidResponse(response?.apiResult))
  } catch (error) {
    console.log(error)
  }
}

//watcher sagas
export function* checkLicensePresentWatcher() {
  yield takeEvery('license/checkLicensePresent', checkLicensePresentWorker)
  yield takeEvery('license/checkUserLicenceKey', activateCheckUserLicenseKey)
  yield takeEvery('license/checkLicenseConfigValid', checkAdminuiLicenseConfig)
  yield takeEvery('license/uploadNewSsaToken', uploadNewSsaToken)
  
}

/**
 * License Root Saga
 */
export default function* rootSaga() {
  yield all([
    fork(checkLicensePresentWatcher),
  ])
}
