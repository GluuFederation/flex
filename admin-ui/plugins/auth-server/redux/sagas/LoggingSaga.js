import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError } from 'Utils/TokenController'
import {
  getLoggingResponse,
  editLoggingResponse,
} from '../features/loggingSlice'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import {updateToast} from 'Redux/features/toastSlice'
import LoggingApi from '../api/LoggingApi'
import { getClient } from 'Redux/api/base'
const JansConfigApi = require('jans_config_api')

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.ConfigurationLoggingApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new LoggingApi(api)
}

export function* getLogging() {
  try {
    const api = yield* newFunction()
    const data = yield call(api.getLoggingConfig)
    yield put(getLoggingResponse({ data }))
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
    yield put(updateToast(true, 'success'))
    yield put(editLoggingResponse({ data }))
  } catch (e) {
    yield put(updateToast(true, 'error'))
    yield put(editLoggingResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetLoggingConfig() {
  yield takeLatest('logging/getLoggingConfig', getLogging)
}

export function* watchEditLoggingConfig() {
  yield takeLatest('logging/editLoggingConfig', editLogging)
}
export default function* rootSaga() {
  yield all([fork(watchGetLoggingConfig), fork(watchEditLoggingConfig)])
}
