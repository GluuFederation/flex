import { all, call, fork, put, select, takeLatest } from 'redux-saga/effects'
import { initAudit } from 'Redux/sagas/SagaUtils'
const JansConfigApi = require('jans_config_api')
import { getClient } from 'Redux/api/base'
import ConfigurationApi from 'Plugins/auth-server/redux/api/ConfigurationApi.js'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import { FETCH, PATCH } from '../../../../app/audit/UserActionType'
import { getConfigApiConfigurationResponse } from 'Plugins/auth-server/redux/features/configApiSlice.js'
import { postUserAction } from 'Redux/api/backend-api'
import { updateToast } from 'Redux/features/toastSlice'
import { getAPIAccessToken } from 'Redux/features/authSlice'

function* newFunction() {
  const { token = null, issuer = '' } = yield select(
    (state) => state.authReducer
  )
  const api = new JansConfigApi.ConfigurationConfigAPIApi(
    getClient(JansConfigApi, token?.access_token, issuer)
  )
  return new ConfigurationApi(api)
}

export function* getConfigApiConfiguration() {
  const audit = yield* initAudit()

  try {
    addAdditionalData(audit, FETCH, 'Config API configuration', {})
    const configApiApi = yield* newFunction()
    const data = yield call(configApiApi.getConfigApiConfiguration)
    yield put(getConfigApiConfigurationResponse(data))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(
      updateToast(
        true,
        'error',
        e?.response?.body?.responseMessage || e.message
      )
    )
    yield put(getConfigApiConfigurationResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* patchApiConfigConfiguration({ payload }) {
  const audit = yield* initAudit()

  try {
    addAdditionalData(audit, PATCH, 'Config API configuration', payload)
    const configApiApi = yield* newFunction()
    const data = yield call(
      configApiApi.patchApiConfigConfiguration,
      payload.action.action_data
    )
    yield put(getConfigApiConfigurationResponse(data))
    yield call(postUserAction, audit)
    return data
  } catch (e) { 
    yield put(
      updateToast(
        true,
        'error',
        e?.response?.body?.responseMessage || e.message
      )
    )
    yield put(getConfigApiConfigurationResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* watchGetConfigApiConfiguration() {
  yield takeLatest(
    'config_api/getConfigApiConfiguration',
    getConfigApiConfiguration
  )
}

export function* watchPatchApiConfigConfiguration() {
  yield takeLatest(
    'config_api/patchApiConfigConfiguration',
    patchApiConfigConfiguration
  )
}

export default function* rootSaga() {
  yield all([
    fork(watchGetConfigApiConfiguration),
    fork(watchPatchApiConfigConfiguration),
  ])
}
