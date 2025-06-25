import { call, all, put, fork, takeLatest, select, takeEvery } from 'redux-saga/effects'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import { getClient } from 'Redux/api/base'
import { initAudit } from 'Redux/sagas/SagaUtils'
import { updateToast } from 'Redux/features/toastSlice'
import { postUserAction } from 'Redux/api/backend-api'
import ScimApi from '../api/ScimApi'
import { getScimConfigurationResponse } from '../features/ScimSlice'
import { PATCH, FETCH } from '../../../../app/audit/UserActionType'
import { triggerWebhook } from 'Plugins/admin/redux/sagas/WebhookSaga'

const UPDATE_SCIM_CONFIG = 'update_scim_config'
const GET_SCIM_CONFIG = 'get_scim_config'

const JansConfigApi = require('jans_config_api')
function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.SCIMConfigManagementApi(getClient(JansConfigApi, token, issuer))
  return new ScimApi(api)
}

export function* updateScimSaga({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, PATCH, UPDATE_SCIM_CONFIG, payload)
    const scimApi = yield* newFunction()
    const data = yield call(scimApi.updateScimConfig, payload.action.action_data)
    yield put(updateToast(true, 'success'))
    yield put(getScimConfigurationResponse(data))
    yield call(postUserAction, audit)
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })
    return data
  } catch (e) {
    yield put(updateToast(true, 'error'))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* getScimSaga() {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, GET_SCIM_CONFIG, {})
    const scimApi = yield* newFunction()
    const data = yield call(scimApi.getScimConfig)
    yield put(getScimConfigurationResponse(data))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(getScimConfigurationResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* watchGetScim() {
  yield takeEvery('scim/getScimConfiguration', getScimSaga)
}

export function* watchUpdateScim() {
  yield takeLatest('scim/putScimConfiguration', updateScimSaga)
}

export default function* rootSaga() {
  yield all([fork(watchGetScim), fork(watchUpdateScim)])
}
