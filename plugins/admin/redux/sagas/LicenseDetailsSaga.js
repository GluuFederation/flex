/**
 * License Sagas
 */
import { all, call, fork, put, takeEvery } from 'redux-saga/effects'
import { GET_LICENSE_DETAILS, GET_LICENSE_DETAILS_RESPONSE } from '../actions/types'
import {
    getLicenseDetailsResponse,
} from '../actions/LicenseDetailsActions'

import {
    getLicenseDetails,
} from '../api/LicenseDetailsApi'

function* getLicenseDetailsPresentWorker() {
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

//watcher sagas
export function* getLicensePresentWatcher() {
  yield takeEvery(GET_LICENSE_DETAILS, getLicenseDetailsPresentWorker)
}


/**
 * License Root Saga
 */
export default function* rootSaga() {
  yield all([
    fork(getLicensePresentWatcher),
  ])
}
