import { all, call, fork, put, takeEvery, select } from 'redux-saga/effects'
import {
  getLicenseDetailsResponse,
  setLicenseReset,
  setLicenseResetFailure,
  setLicenseResetResponse,
  updateLicenseDetailsResponse,
} from '../features/licenseDetailsSlice'
import { getClient } from 'Redux/api/base'
import LicenseDetailsApi from '../api/LicenseDetailsApi'
import { initAudit } from 'Redux/sagas/SagaUtils'
import { postUserAction } from 'Redux/api/backend-api'
import { addAdditionalData, isFourZeroOneError } from 'Utils/TokenController'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import { API_LICENSE } from '../../audit/Resources'
import { DELETION } from '@/audit/UserActionType'
const JansConfigApi = require('jans_config_api')

type ResetLicenseAction = {
  type: 'license/resetConfig'
  message: string
}

function* newFunction() {
  const token = yield select((state) => state.authReducer.token?.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.AdminUILicenseApi(getClient(JansConfigApi, token, issuer))
  return new LicenseDetailsApi(api)
}

export function* resetLicenseConfigWorker(action: ResetLicenseAction) {
  const audit = yield* initAudit()
  try {
    yield put(setLicenseReset())
    addAdditionalData(audit, DELETION, API_LICENSE, {})
    audit.message = action?.message
    const roleApi = yield* newFunction()
    const data = yield call(roleApi.deleteLicense)
    const { success, responseCode } = data
    if (success && responseCode === 200) {
      yield put(setLicenseResetResponse(data))
      yield call(postUserAction, audit)
    } else {
      yield put(setLicenseResetFailure())
    }
  } catch (error) {
    if (isFourZeroOneError(error)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* getLicenseDetailsWorker() {
  try {
    const audit = yield* initAudit()
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
export function* resetLicenseWatcher() {
  yield takeEvery('license/resetConfig', resetLicenseConfigWorker)
}

export default function* rootSaga() {
  yield all([fork(getLicenseWatcher), fork(updateLicenseWatcher), fork(resetLicenseWatcher)])
}
