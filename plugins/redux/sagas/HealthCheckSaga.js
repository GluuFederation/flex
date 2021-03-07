/**
 * HealthCheck Sagas
 */

import { all, call, fork, put, takeEvery } from 'redux-saga/effects'
import {
  GET_HEALTH_CHECK,
  GET_HEALTH_CHECK_RESPONSE,
} from '../types'

import {
	getHealthCheckResponse,
} from '../actions/HealthCheckActions'

import {
  fetchHealthCheckComponents,
} from '../api/health-check'

function* getHealthCheckWorker() {
  try {
    const response = yield call(fetchHealthCheckComponents)
    if (response) {
      yield put(getHealthCheckResponse(response))
      return
    }
  } catch (error) {
    console.error('Problems getting health-check details.', error)
  }
  yield put(getHealthCheckResponse())
}


//watcher sagas
export function* getHealthCheckWatcher() {
  yield takeEvery(GET_HEALTH_CHECK, getHealthCheckWorker)
}


/**
 * Plugin Root Saga
 */
export default function* rootSaga() {
  yield all([
    fork(getHealthCheckWorker),
  ])
}