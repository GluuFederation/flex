import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError, hasApiToken } from '../../utils/TokenController'
import { getLoggingConfig, editLoggingConfig } from '../api/logging-api'
import {
  getLoggingResponse,
  editLoggingResponse,
} from '../actions/LoggingActions'
import { getAPIAccessToken } from '../actions/AuthActions'
import { GET_LOGGING, PUT_LOGGING } from '../actions/types'
export function* getLogging() {
  try {
    const data = yield call(getLoggingConfig)
    yield put(getLoggingResponse(data))
  } catch (e) {
    yield put(getLoggingResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* editLogging({ payload }) {
  try {
    const data = yield call(editLoggingConfig, payload.data)
    yield put(editLoggingResponse(data))
  } catch (e) {
    if (isFourZeroOneError(e) && !hasApiToken()) {
      yield put(getAPIAccessToken())
    }
  }
}

export function* watchGetLoggingConfig() {
  yield takeLatest(GET_LOGGING, getLogging)
}

export function* watchEditLoggingConfig() {
  yield takeLatest(PUT_LOGGING, editLogging)
}
export default function* rootSaga() {
  yield all([fork(watchGetLoggingConfig), fork(watchEditLoggingConfig)])
}
