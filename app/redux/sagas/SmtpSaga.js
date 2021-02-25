import { call, all, put, fork, takeLatest } from 'redux-saga/effects'
import { isFourZeroOneError } from '../../utils/TokenController'
import {
  getSmtpConfig,
  addSmtpConfig,
  updateSmtpConfig,
  testSmtpConfig,
} from '../api/smtp-api'
import { GET_SMTP, PUT_SMTP, SET_SMTP, TEST_SMTP } from '../actions/types'

export function* getSmtp() {
  try {
    const data = yield call(getSmtpConfig)
   // yield put(getSmtpResponse(data))
  } catch (e) {
    if (isFourZeroOneError(e) && !hasApiToken()) {
      yield put(getAPIAccessToken())
    }
  }
}

export function* watchGetSmtpConfig() {
  yield takeLatest(GET_SMTP, getSmtp)
}
export default function* rootSaga() {
  yield all([fork(watchGetSmtpConfig)])
}
