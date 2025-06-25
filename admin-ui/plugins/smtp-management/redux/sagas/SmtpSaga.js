import { call, all, put, fork, takeLatest, select, takeEvery } from 'redux-saga/effects'
import { getAPIAccessToken } from '../../../../app/redux/features/authSlice'
import { isFourZeroOneError } from '../../../../app/utils/TokenController'
import { getClient } from '../../../../app/redux/api/base'
const JansConfigApi = require('jans_config_api')
import { initAudit } from '../../../../app/redux/sagas/SagaUtils'
import { updateToast } from 'Redux/features/toastSlice'
import { postUserAction } from '../../../../app/redux/api/backend-api'
import SmtpApi from '../api/SmtpApi'
import {
  getSmptResponse,
  getSmpts,
  testSmtpResponse,
  testSmtpResponseFails,
  updateSmptResponse,
} from '../features/smtpSlice'
import { triggerWebhook } from 'Plugins/admin/redux/sagas/WebhookSaga'

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.ConfigurationSMTPApi(getClient(JansConfigApi, token, issuer))
  return new SmtpApi(api)
}

export function* updateStmpSaga({ payload }) {
  const audit = yield* initAudit()
  try {
    const stmpApi = yield* newFunction()
    const data = yield call(stmpApi.updateSmtpConfig, payload)
    yield put(updateToast(true, 'success'))
    yield put(updateSmptResponse({ data }))
    yield put(getSmpts())
    yield call(postUserAction, audit)
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })
    return data
  } catch (e) {
    yield put(updateToast(true, 'error'))
    yield put(updateSmptResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* getSmtpsSaga() {
  const audit = yield* initAudit()
  try {
    const stmpApi = yield* newFunction()
    const data = yield call(stmpApi.getSmtpConfig)
    yield put(getSmptResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(getSmptResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* testSmtp({ payload }) {
  try {
    const stmpApi = yield* newFunction()
    const data = yield call(stmpApi.testSmtpConfig, payload.payload)
    yield put(testSmtpResponse({ data }))
  } catch (e) {
    yield put(updateToast(true, 'error'))
    yield put(testSmtpResponseFails())
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetUsers() {
  yield takeEvery('smtps/getSmpts', getSmtpsSaga)
}

export function* watchUpdateUser() {
  yield takeLatest('smtps/updateSmpt', updateStmpSaga)
}

export function* watchTestSmtpConfig() {
  yield takeLatest('smtps/testSmtp', testSmtp)
}

export default function* rootSaga() {
  yield all([fork(watchGetUsers), fork(watchUpdateUser), fork(watchTestSmtpConfig)])
}
