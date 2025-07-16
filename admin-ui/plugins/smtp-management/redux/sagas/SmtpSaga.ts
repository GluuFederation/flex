import {
  call,
  all,
  put,
  fork,
  takeLatest,
  select,
  takeEvery,
  CallEffect,
  PutEffect,
  SelectEffect,
  ForkEffect,
  AllEffect,
} from 'redux-saga/effects'
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

// Define interfaces
interface RootState {
  authReducer: {
    token: {
      access_token: string
    }
    issuer: string
    userinfo_jwt: string
  }
}

interface SmtpConfiguration {
  host?: string
  port?: number
  connect_protection?: string
  from_name?: string
  from_email_address?: string
  requires_authentication?: boolean
  smtp_authentication_account_username?: string
  smtp_authentication_account_password?: string
  trust_host?: boolean
  key_store?: string
  key_store_password?: string
  key_store_alias?: string
  signing_algorithm?: string
}

interface TestSmtpOptions {
  smtpTest: {
    sign: boolean
    subject: string
    message: string
  }
}

interface SmtpActionPayload {
  payload: SmtpConfiguration
}

interface TestSmtpActionPayload {
  payload: {
    payload: TestSmtpOptions
  }
}

interface AuditLog {
  headers: {
    Authorization?: string
    [key: string]: any
  }
  client_id?: string
  ip_address?: string
  status?: string
  performedBy?: {
    user_inum: string
    userId: string
  }
  [key: string]: any
}

interface ApiError {
  response?: {
    body?: {
      responseMessage?: string
    }
  }
  message?: string
}

function* newFunction(): Generator<SelectEffect, SmtpApi, any> {
  const token: string = yield select((state: RootState) => state.authReducer.token.access_token)
  const issuer: string = yield select((state: RootState) => state.authReducer.issuer)
  const api = new JansConfigApi.ConfigurationSMTPApi(getClient(JansConfigApi, token, issuer))
  return new SmtpApi(api)
}

export function* updateStmpSaga({
  payload,
}: SmtpActionPayload): Generator<CallEffect | PutEffect | SelectEffect, any, any> {
  const audit: AuditLog = yield* initAudit()
  try {
    const stmpApi: SmtpApi = yield* newFunction()
    const data: any = yield call(stmpApi.updateSmtpConfig, payload)
    yield put(updateToast(true, 'success'))
    yield put(updateSmptResponse({ data }))
    yield put(getSmpts({}))
    yield call(postUserAction, audit)
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })
    return data
  } catch (e: unknown) {
    const error = e as ApiError
    yield put(updateToast(true, 'error'))
    yield put(updateSmptResponse(null))
    if (isFourZeroOneError(error)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return error
  }
}

export function* getSmtpsSaga(): Generator<CallEffect | PutEffect | SelectEffect, any, any> {
  const audit: AuditLog = yield* initAudit()
  try {
    const stmpApi: SmtpApi = yield* newFunction()
    const data: any = yield call(stmpApi.getSmtpConfig)
    yield put(getSmptResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e: unknown) {
    const error = e as ApiError
    yield put(getSmptResponse(null))
    if (isFourZeroOneError(error)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return error
  }
}

export function* testSmtp({
  payload,
}: TestSmtpActionPayload): Generator<CallEffect | PutEffect | SelectEffect, any, any> {
  try {
    const stmpApi: SmtpApi = yield* newFunction()
    const data: any = yield call(stmpApi.testSmtpConfig, payload.payload)
    yield put(testSmtpResponse({ data }))
  } catch (e: unknown) {
    const error = e as ApiError
    yield put(updateToast(true, 'error'))
    yield put(testSmtpResponseFails())
    if (isFourZeroOneError(error)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetUsers(): Generator<ForkEffect<never>, void, unknown> {
  yield takeEvery('smtps/getSmpts' as any, getSmtpsSaga)
}

export function* watchUpdateUser(): Generator<ForkEffect<never>, void, unknown> {
  yield takeLatest('smtps/updateSmpt' as any, updateStmpSaga)
}

export function* watchTestSmtpConfig(): Generator<ForkEffect<never>, void, unknown> {
  yield takeLatest('smtps/testSmtp' as any, testSmtp)
}

export default function* rootSaga(): Generator<AllEffect<ForkEffect<void>>, void, unknown> {
  yield all([fork(watchGetUsers), fork(watchUpdateUser), fork(watchTestSmtpConfig)])
}
