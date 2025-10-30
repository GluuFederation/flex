import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { API_CONFIG } from '../audit/Resources'
import { CREATE, UPDATE, DELETION, FETCH } from '../../../../app/audit/UserActionType'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import { updateToast } from 'Redux/features/toastSlice'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import ConfigApi from '../api/ConfigApi'
import { getClient } from 'Redux/api/base'
import { postUserAction } from 'Redux/api/backend-api'
const JansConfigApi = require('jans_config_api')
import { initAudit } from 'Redux/sagas/SagaUtils'
import { getConfigResponse } from '../features/apiConfigSlice'

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.AdminUIConfigurationApi(getClient(JansConfigApi, token, issuer))
  return new ConfigApi(api)
}

export function* getConfig({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, API_CONFIG, payload)
    const configApi = yield* newFunction()
    const data = yield call(configApi.getConfig)
    yield put(getConfigResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(getConfigResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* editConfig({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, UPDATE, API_CONFIG, payload)
    console.log(payload)
    const configApi = yield* newFunction()
    const data = yield call(configApi.editRole, payload.action.action_data)
    yield put(updateToast(true, 'success'))
    yield put(getConfig({}))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(updateToast(true, 'error'))
    yield put(getConfig({}))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* watchGetConfig() {
  yield takeLatest('apiConfig/getConfig', getConfig)
}

export function* watchEditConfig() {
  yield takeLatest('apiConfig/editConfig', editConfig)
}

export default function* rootSaga() {
  yield all([fork(watchGetConfig), fork(watchEditConfig)])
}
