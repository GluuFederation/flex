/**
 * License Sagas
 */
import { all, call, fork, put, takeEvery } from 'redux-saga/effects'
import {
  checkLicenseConfigValidResponse,
  checkLicensePresentResponse,
  checkLicensePresent,
  getOAuth2Config,
  uploadNewSsaTokenResponse,
  generateTrialLicenseResponse,
  checkUserLicenseKeyResponse,
  retrieveLicenseKeyResponse,
  checkThresholdLimit,
  setValidatingFlow,
} from '../actions'
import LicenseApi from 'Redux/api/LicenseApi'
import { getClientWithToken, getClient } from 'Redux/api/base'
import { fetchApiTokenWithDefaultScopes } from 'Redux/api/backend-api'
import MauApi from 'Redux/api/MauApi'
import LicenseDetailsApi from 'Redux/api/LicenseDetailsApi'
import { getYearMonth } from '../../utils/Util'

const JansConfigApi = require('jans_config_api')

function* getApiTokenWithDefaultScopes() {
  const response = yield call(fetchApiTokenWithDefaultScopes)
  const api = new JansConfigApi.AdminUILicenseApi(
    getClientWithToken(JansConfigApi, response.access_token),
  )
  return new LicenseApi(api)
}

function* newFunction() {
  const { access_token, issuer } = yield call(fetchApiTokenWithDefaultScopes)
  const api = new JansConfigApi.StatisticsUserApi(
    getClient(JansConfigApi, access_token, issuer)
  )
  return new MauApi(api)
}

function* newLicenseDetailsFunction() {
  const { access_token, issuer } = yield call(fetchApiTokenWithDefaultScopes)
  const api = new JansConfigApi.AdminUILicenseApi(
    getClient(JansConfigApi, access_token, issuer)
  )
  return new LicenseDetailsApi(api)
}

function* checkLicensePresentWorker() {
  try {
    const licenseApi = yield* getApiTokenWithDefaultScopes()
    const response = yield call(licenseApi.getIsActive)
    if(!response?.success) {
      yield* retrieveLicenseKey()
    } else {
      yield* checkMauThreshold()
    }
  } catch (error) {
    console.log('Error in checking License present.', error)
    yield* retrieveLicenseKey()
  } 
}

function* retrieveLicenseKey() {
  try {
    const licenseApi = yield* getApiTokenWithDefaultScopes()
    const response = yield call(licenseApi.retrieveLicense)

    if (response?.['license_key']) {
      try {
        const activateLicense = yield call(licenseApi.submitLicenseKey, {
          payload: {
            licenseKey: response['license_key']
          }
        })

        yield put(generateTrialLicenseResponse(activateLicense))
        yield put(setValidatingFlow({ isValidatingFlow: true }))
        yield put(checkUserLicenseKeyResponse(activateLicense))


        yield* checkMauThreshold()
      } catch (error) {
        console.log(error)
        yield put(
          retrieveLicenseKeyResponse({ isNoValidLicenseKeyFound: true })
        )
        yield put(checkLicensePresentResponse({ isLicenseValid: false }))
        yield put(generateTrialLicenseResponse(null))
      }
    }
  } catch (error) {
    console.log('Error in generating key.', error)
    yield put(retrieveLicenseKeyResponse({ isNoValidLicenseKeyFound: true }))
  }
}

function* checkMauThreshold() {
  const mauApi = yield* newFunction()
  const licenseApi = yield* newLicenseDetailsFunction()
  try {
    const [license, data] = yield all([
      call(licenseApi.getLicenseDetails),
      call(mauApi.getMau, { month: getYearMonth(new Date()) })
    ]);

    const limit = (license.maxActivations * 15) / 100 + license.maxActivations
    if(limit > data?.[0]?.monthly_active_users) {
      // under MAU limit
      yield put(
        checkLicensePresentResponse({
          isLicenseValid: true,
        })
      )
      yield put(checkThresholdLimit({ isUnderThresholdLimit: true }))
    } else {
      yield put(checkThresholdLimit({ isUnderThresholdLimit: false }))
      yield put(
        checkLicensePresentResponse({
          isLicenseValid: false,
        })
      )
    }
  } catch (error) {
    console.log(error)
  } finally {
    yield put(setValidatingFlow({ isValidatingFlow: false }))
  }
}

function* generateTrailLicenseKey() {
  try {
    const licenseApi = yield* getApiTokenWithDefaultScopes()
    const response = yield call(licenseApi.getTrialLicense)

    if (response?.responseObject?.['license-key']) {
      try {
        const activateLicense = yield call(licenseApi.submitLicenseKey, {
          payload: {
            licenseKey: response.responseObject['license-key']
          }
        })
        yield put(generateTrialLicenseResponse(activateLicense))
        yield put(
          checkLicensePresentResponse({
            isLicenseValid: activateLicense?.success,
          })
        )
        yield put(checkUserLicenseKeyResponse(activateLicense))
      } catch (error) {
        yield put(checkLicensePresentResponse({ isLicenseValid: false }))
        yield put(generateTrialLicenseResponse(null))
      }
    }
  } catch (error) {
    console.log('Error in generating key.', error)
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
function* uploadNewSsaToken({ payload }) {
  try {
    const licenseApi = yield* getApiTokenWithDefaultScopes()
    const response = yield call(licenseApi.uploadSSAtoken, payload)
    if (!response?.success) {
      yield put(
        uploadNewSsaTokenResponse(
          "Invalid SSA. Please contact Gluu's team to verify if SSA is correct."
        )
      )
    }
    yield put(checkLicenseConfigValidResponse(response?.success))
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
    yield put(checkLicenseConfigValidResponse(response?.success))
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
  yield takeEvery('license/generateTrialLicense', generateTrailLicenseKey)
  yield takeEvery('license/retrieveLicenseKey', retrieveLicenseKey)
}

/**
 * License Root Saga
 */
export default function* rootSaga() {
  yield all([fork(checkLicensePresentWatcher)])
}
