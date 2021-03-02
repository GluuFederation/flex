import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError, hasApiToken } from '../../utils/TokenController'
import {
  getSmtpConfig,
  addSmtpConfig,
  updateSmtpConfig,
  testSmtpConfig,
} from '../api/smtp-api'
import {
  getSmtpResponse,
  addSmtpResponse,
  editSmtpResponse,
  testSmtpResponse,
} from '../actions/SmtpActions'
import { getAPIAccessToken } from '../actions/AuthActions'
import { GET_SMTP, PUT_SMTP, SET_SMTP, TEST_SMTP } from '../actions/types'
export function* getSmtp() {
  try {
    const data = yield call(getSmtpConfig)
    yield put(getSmtpResponse(data))
  } catch (e) {
    yield put(getSmtpResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* addSmtp({ payload }) {
  try {
    const data = yield call(addSmtpConfig, payload.data)
    yield put(addSmtpResponse(data))
  } catch (e) {
    if (isFourZeroOneError(e) && !hasApiToken()) {
      yield put(getAPIAccessToken())
    }
  }
}

export function* editSmtp({ payload }) {
  try {
    const data = yield call(updateSmtpConfig, payload.data)
    yield put(editSmtpResponse(data))
  } catch (e) {
    if (isFourZeroOneError(e) && !hasApiToken()) {
      yield put(getAPIAccessToken())
    }
  }
}

export function* watchGetSmtpConfig() {
  yield takeLatest(GET_SMTP, getSmtp)
}

export function* watchAddSmtpConfig() {
  yield takeLatest(SET_SMTP, addSmtp)
}

export function* watchPutSmtpConfig() {
  yield takeLatest(PUT_SMTP, editSmtp)
}
export default function* rootSaga() {
  yield all([fork(watchGetSmtpConfig), fork(watchPutSmtpConfig)])
}
