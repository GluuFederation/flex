import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError } from '../../../../app/utils/TokenController'
import {
  getSmtpResponse,
  editSmtpResponse,
  testSmtpResponse,
} from '../actions/SmtpActions'
import { getAPIAccessToken } from 'Redux/actions/AuthActions'
import { GET_SMTP, PUT_SMTP, TEST_SMTP } from '../actions/types'
import SmtpApi from '../api/SmtpApi'
import { getClient } from 'Redux/api/base'
const JansConfigApi = require('jans_config_api')

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.ConfigurationSMTPApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new SmtpApi(api)
}

export function* getSmtp() {
  try {
    const api = yield* newFunction()
    const data = yield call(api.getSmtpConfig)
    yield put(getSmtpResponse(data))
  } catch (e) {
    yield put(getSmtpResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* testSmtp() {
  try {
    const api = yield* newFunction()
    const data = yield call(api.testSmtpConfig)
    yield put(testSmtpResponse(data))
  } catch (e) {
    yield put(testSmtpResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* editSmtp({ payload }) {
  try {
    const api = yield* newFunction()
    const data = yield call(api.updateSmtpConfig, payload.data)
    yield put(editSmtpResponse(data))
  } catch (e) {
    yield put(editSmtpResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetSmtpConfig() {
  yield takeLatest(GET_SMTP, getSmtp)
}

export function* watchTestSmtpConfig() {
  yield takeLatest(TEST_SMTP, testSmtp)
}

export function* watchPutSmtpConfig() {
  yield takeLatest(PUT_SMTP, editSmtp)
}
export default function* rootSaga() {
  yield all([
    fork(watchGetSmtpConfig),
    fork(watchPutSmtpConfig),
    fork(watchTestSmtpConfig),
  ])
}
