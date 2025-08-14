import { call, all, put, fork, takeLatest, select, takeEvery } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import { PayloadAction } from '@reduxjs/toolkit'
import { getAPIAccessToken } from '../../../../app/redux/features/authSlice'
import { isFourZeroOneError } from '../../../../app/utils/TokenController'
import { getClient } from '../../../../app/redux/api/base'
import * as JansConfigApi from 'jans_config_api'
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
import {
  SmtpConfiguration,
  SmtpUpdatePayload,
  SmtpTestPayload,
  RootState,
  IConfigurationSMTPApi,
} from '../types/SmtpApi.type'

function* newFunction(): SagaIterator<SmtpApi> {
  const token: string = yield select((state: RootState) => state.authReducer.token.access_token)
  const issuer: string = yield select((state: RootState) => state.authReducer.issuer)
  const api: IConfigurationSMTPApi = new JansConfigApi.ConfigurationSMTPApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new SmtpApi(api)
}

export function* updateStmpSaga({
  payload,
}: PayloadAction<SmtpUpdatePayload>): SagaIterator<SmtpConfiguration | unknown> {
  const audit = yield* initAudit()
  try {
    const stmpApi: SmtpApi = yield call(newFunction)
    const data: SmtpConfiguration = yield call(stmpApi.updateSmtpConfig, {
      smtpConfiguration: payload.smtpConfiguration,
    })
    yield put(updateToast(true, 'success'))
    yield put(updateSmptResponse({ data }))
    yield put(getSmpts())
    yield call(postUserAction, audit)
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })
    return data
  } catch (e: unknown) {
    yield put(updateToast(true, 'error'))
    yield put(updateSmptResponse({ data: undefined }))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* getSmtpsSaga(): SagaIterator<SmtpConfiguration | unknown> {
  const audit = yield* initAudit()
  try {
    const stmpApi: SmtpApi = yield call(newFunction)
    const data: SmtpConfiguration = yield call(stmpApi.getSmtpConfig)
    yield put(getSmptResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e: unknown) {
    yield put(getSmptResponse({ data: undefined }))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* testSmtp({ payload }: PayloadAction<SmtpTestPayload>): SagaIterator<void> {
  try {
    const stmpApi: SmtpApi = yield call(newFunction)
    const data: boolean = yield call(stmpApi.testSmtpConfig, payload.payload)
    yield put(testSmtpResponse({ data }))
  } catch (e: unknown) {
    yield put(updateToast(true, 'error'))
    yield put(testSmtpResponseFails())
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetUsers(): SagaIterator<void> {
  yield takeEvery('smtps/getSmpts', getSmtpsSaga)
}

export function* watchUpdateUser(): SagaIterator<void> {
  yield takeLatest('smtps/updateSmpt', updateStmpSaga)
}

export function* watchTestSmtpConfig(): SagaIterator<void> {
  yield takeLatest('smtps/testSmtp', testSmtp)
}

export default function* rootSaga(): SagaIterator<void> {
  yield all([fork(watchGetUsers), fork(watchUpdateUser), fork(watchTestSmtpConfig)])
}
