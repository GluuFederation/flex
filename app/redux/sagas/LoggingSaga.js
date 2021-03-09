import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError, hasApiToken } from '../../utils/TokenController'
import {
  getLoggingResponse,
  editLoggingResponse,
} from '../actions/LoggingActions'
import { getAPIAccessToken } from '../actions/AuthActions'
import { GET_LOGGING, PUT_LOGGING } from '../actions/types'
import LoggingApi from '../api/LoggingApi'
import { getClient } from '../api/base'
const JansConfigApi = require('jans_config_api')

export function* getLogging() {
  try {
    const api = yield* newFunction()
    const data = yield call(api.getLoggingConfig)
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
    const api = yield* newFunction()
    const data = yield call(api.editLoggingConfig, payload.data)
    yield put(editLoggingResponse(data))
  } catch (e) {
    if (isFourZeroOneError(e) && !hasApiToken()) {
      yield put(getAPIAccessToken())
    }
  }
}

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.ConfigurationLoggingApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new LoggingApi(api)
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
