import { all, call, fork, put, takeEvery } from 'redux-saga/effects'
import { GET_LICENSE_DETAILS, UPDATE_LICENSE_DETAILS } from '../actions/types'
import {
  getLicenseDetailsResponse,
  updateLicenseDetailsResponse,
} from '../actions/LicenseDetailsActions'

import {
  getLicenseDetails,
  updateLicenseDetails,
} from '../api/LicenseDetailsApi'

function* getLicenseDetailsWorker() {
  try {
    const response = yield call(getLicenseDetails)
    if (response) {
      yield put(getLicenseDetailsResponse(response))
      return
    }
  } catch (error) {
    console.log('Error in fetching License Details.', error)
  }
  yield put(getLicenseDetailsResponse())
}

function* updateLicenseDetailsWorker({ payload }) {
  try {
    const response = yield call(updateLicenseDetails, payload.data)
    if (response) {
      yield put(updateLicenseDetailsResponse(response))
      return
    }
  } catch (error) {
    console.log('Error in fetching License Details.', error)
  }
  yield put(updateLicenseDetailsResponse())
}

export function* getLicenseWatcher() {
  yield takeEvery(GET_LICENSE_DETAILS, getLicenseDetailsWorker)
}

export function* updateLicenseWatcher() {
  yield takeEvery(UPDATE_LICENSE_DETAILS, updateLicenseDetailsWorker)
}

export default function* rootSaga() {
  yield all([fork(getLicenseWatcher), fork(updateLicenseWatcher)])
}
