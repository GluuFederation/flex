import {
  call,
  all,
  put,
  fork,
  takeLatest,
  select,
  takeEvery,
} from 'redux-saga/effects'
import { getAPIAccessToken } from '../../../../app/redux/actions/AuthActions'
import {
  isFourZeroOneError,
} from '../../../../app/utils/TokenController'
import {
  GET_SMTPS,
  TEST_SMTP_CONFIG,
  UPDATE_SMTP
} from '../actions/types'
import { getClient } from '../../../../app/redux/api/base'
const JansConfigApi = require('jans_config_api')
import { initAudit } from '../../../../app/redux/sagas/SagaUtils'
import { updateToast } from 'Redux/actions/ToastAction'
import { postUserAction } from '../../../../app/redux/api/backend-api'
import SmtpApi from '../api/SmtpApi'
import { getSmptResponse, getSmpts, testSmtpResponse, updateSmptResponse } from '../actions/SmtpActions'
function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.ConfigurationSMTPApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new SmtpApi(api)
}

export function* updateStmpSaga({ payload }) {
  const audit = yield* initAudit()
  try {
    const stmpApi = yield* newFunction()
    const data = yield call(stmpApi.updateSmtpConfig, payload)
    yield put(updateToast(true, 'success'))
    yield put(updateSmptResponse(data))
    yield put(getSmpts())
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(updateToast(true, 'error'))
    yield put(updateSmptResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* getSmtpsSaga() {
  const audit = yield* initAudit()
  try {
    const stmpApi = yield* newFunction()
    const data = yield call(stmpApi.getSmtpConfig);
    yield put(getSmptResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(getSmptResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* testSmtp(payload) {
  try {

    const stmpApi = yield* newFunction()
    const data = yield call(stmpApi.testSmtpConfig, payload.payload)
    console.log("dt",data)
    yield put(testSmtpResponse(data))
  } catch (e) {
    yield put(updateToast(true, 'error'))
    yield put(testSmtpResponse({}))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetUsers() {
  yield takeEvery(GET_SMTPS, getSmtpsSaga)
}

export function* watchUpdateUser() {
  yield takeLatest(UPDATE_SMTP, updateStmpSaga)
}

export function* watchTestSmtpConfig() {
  yield takeLatest(TEST_SMTP_CONFIG, testSmtp)
}



export default function* rootSaga() {
  yield all([
    fork(watchGetUsers),
    fork(watchUpdateUser),
    fork(watchTestSmtpConfig)
  ])
}
