// @ts-nocheck
import { all, call, fork, put, takeEvery, select } from 'redux-saga/effects'
import {
  getLicenseDetailsResponse,
  updateLicenseDetailsResponse,
} from '../features/licenseDetailsSlice'
import { getClient } from 'Redux/api/base'
import LicenseDetailsApi from '../api/LicenseDetailsApi'
const JansConfigApi = require('jans_config_api')
import { initAudit } from 'Redux/sagas/SagaUtils'
import { postUserAction } from 'Redux/api/backend-api'
import { isFourZeroOneError } from 'Utils/TokenController'
import { getAPIAccessToken } from 'Redux/features/authSlice'

function* newFunction() {
  const token = yield select((state) => state.authReducer.token?.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.AdminUILicenseApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new LicenseDetailsApi(api)
}

export function* getLicenseDetailsWorker({ payload }) {
  const audit = yield* initAudit()
  try {
    //addAdditionalData(audit, FETCH, GET_LICENSE_DETAILS, payload)
    const licenseApi = yield* newFunction()
    const data = yield call(licenseApi.getLicenseDetails)
    yield put(getLicenseDetailsResponse({ data }))
    yield call(postUserAction, audit)
  } catch (e) {
    console.log('error in getting license details: ', e)
    yield put(getLicenseDetailsResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* updateLicenseDetailsWorker({ payload }) {
  const audit = yield* initAudit()
  try {
    //addAdditionalData(audit, UPDATE, UPDATE_LICENSE_DETAILS, payload)
    const roleApi = yield* newFunction()
    const data = yield call(roleApi.updateLicenseDetails, payload.action.action_data)
    yield put(updateLicenseDetailsResponse({ data }))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(updateLicenseDetailsResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* getLicenseWatcher() {

  yield takeEvery('licenseDetails/getLicenseDetails', getLicenseDetailsWorker)
}

export function* updateLicenseWatcher() {
  yield takeEvery('licenseDetails/updateLicenseDetails', updateLicenseDetailsWorker)
}

export default function* rootSaga() {
  yield all([fork(getLicenseWatcher), fork(updateLicenseWatcher)])
}