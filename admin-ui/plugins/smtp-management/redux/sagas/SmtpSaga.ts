import { call, all, put, fork, takeLatest, select, takeEvery } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import { PayloadAction } from '@reduxjs/toolkit'
import { getClient } from '../../../../app/redux/api/base'
import * as JansConfigApi from 'jans_config_api'
import { initAudit, handleSagaError } from '../../../../app/redux/sagas/SagaUtils'
import { updateToast } from 'Redux/features/toastSlice'
import { postUserAction } from '../../../../app/redux/api/backend-api'
import SmtpApi from '../api/SmtpApi'
import {
  getSmptResponse,
  getSmtps,
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
  SagaError,
} from '../types/SmtpApi.type'

function* createSmtpApiClient(): SagaIterator<SmtpApi> {
  const token: string = yield select((state: RootState) => state.authReducer.token.access_token)
  const issuer: string = yield select((state: RootState) => state.authReducer.issuer)
  const api: IConfigurationSMTPApi = new JansConfigApi.ConfigurationSMTPApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new SmtpApi(api)
}

export function* updateStmpSaga({
  payload,
}: PayloadAction<SmtpUpdatePayload>): SagaIterator<SmtpConfiguration | SagaError> {
  const audit = yield* initAudit()
  try {
    const stmpApi: SmtpApi = yield call(createSmtpApiClient)
    const data: SmtpConfiguration = yield call(stmpApi.updateSmtpConfig, {
      smtpConfiguration: payload.smtpConfiguration,
    })
    yield put(updateToast(true, 'success'))
    yield put(updateSmptResponse({ data }))
    yield put(getSmtps())
    yield call(postUserAction, audit)
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })
    return data
  } catch (e: unknown) {
    return (yield* handleSagaError(e as SagaError, {
      showToast: true,
      clearDataAction: updateSmptResponse({ data: undefined }),
    })) as SagaError
  }
}

export function* getSmtpsSaga(): SagaIterator<SmtpConfiguration | SagaError> {
  const audit = yield* initAudit()
  try {
    const stmpApi: SmtpApi = yield call(createSmtpApiClient)
    const data: SmtpConfiguration = yield call(stmpApi.getSmtpConfig)
    yield put(getSmptResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e: unknown) {
    return (yield* handleSagaError(e as SagaError, {
      showToast: false,
      clearDataAction: getSmptResponse({ data: undefined }),
    })) as SagaError
  }
}

export function* testSmtp({ payload }: PayloadAction<SmtpTestPayload>): SagaIterator<void> {
  try {
    const stmpApi: SmtpApi = yield call(createSmtpApiClient)
    const data: boolean = yield call(stmpApi.testSmtpConfig, payload.payload)
    yield put(testSmtpResponse({ data }))
  } catch (e: unknown) {
    yield* handleSagaError(e as SagaError, {
      showToast: true,
      clearDataAction: testSmtpResponseFails(),
    })
  }
}

export function* watchGetSmtps(): SagaIterator<void> {
  yield takeEvery('smtps/getSmtps', getSmtpsSaga)
}

export function* watchUpdateSmtp(): SagaIterator<void> {
  yield takeLatest('smtps/updateSmpt', updateStmpSaga)
}

export function* watchTestSmtpConfig(): SagaIterator<void> {
  yield takeLatest('smtps/testSmtp', testSmtp)
}

export default function* rootSaga(): SagaIterator<void> {
  yield all([fork(watchGetSmtps), fork(watchUpdateSmtp), fork(watchTestSmtpConfig)])
}
