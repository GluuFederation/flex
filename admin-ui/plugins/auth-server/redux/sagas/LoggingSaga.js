import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { addAdditionalData, isFourZeroOneError } from 'Utils/TokenController'
import { getLoggingResponse, editLoggingResponse } from '../features/loggingSlice'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import { updateToast } from 'Redux/features/toastSlice'
import LoggingApi from '../api/LoggingApi'
import { getClient } from 'Redux/api/base'
import { UPDATE } from '@/audit/UserActionType'
import { API_LOGGING } from '../../../../app/audit/Resources'
import { initAudit } from '@/redux/sagas/SagaUtils'
import { postUserAction } from '@/redux/api/backend-api'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const JansConfigApi = require('jans_config_api')

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.ConfigurationLoggingApi(getClient(JansConfigApi, token, issuer))
  return new LoggingApi(api)
}

export function* getLogging() {
  try {
    const api = yield* newFunction()
    const data = yield call(api.getLoggingConfig)
    yield put(getLoggingResponse({ data }))
    return data
  } catch (e) {
    yield put(getLoggingResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* editLogging({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, UPDATE, API_LOGGING, {
      omitPayload: true,
      action: {
        action_message: payload?.otherFields?.userMessage,
        action_data: {
          modifiedFields: payload?.otherFields?.changedFields,
        },
      },
    })
    const api = yield* newFunction()
    const data = yield call(api.editLoggingConfig, payload.data)

    yield put(updateToast(true, 'success'))
    yield put(editLoggingResponse({ data }))
    yield call(postUserAction, audit)

    return data
  } catch (e) {
    yield put(updateToast(true, 'error'))
    yield put(editLoggingResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
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
