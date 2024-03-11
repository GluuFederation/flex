import { initAudit } from 'Redux/sagas/SagaUtils'
import { getClient } from 'Redux/api/base'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import {
  call,
  all,
  put,
  fork,
  takeLatest,
  select,
  takeEvery,
} from 'redux-saga/effects'
import { postUserAction } from 'Redux/api/backend-api'
import { updateToast } from 'Redux/features/toastSlice'
import JansKcLinkApi from '../api/JansKcLinkApi'
import {
  getConfigurationResponse,
  toggleSavedFormFlag,
  setLoading
} from '../features/JansKcLinkSlice'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import { UPDATE, FETCH } from '../../../../app/audit/UserActionType'
import { triggerWebhook } from 'Plugins/admin/redux/sagas/WebhookSaga'

const JansConfigApi = require('jans_config_api')

export const JANS_KC_LINK = 'jans-kc-link'

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.KCLinkConfigurationApi(
    getClient(JansConfigApi, token, issuer)
  )
  return new JansKcLinkApi(api)
}

export function* getKcConfiguration() {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, JANS_KC_LINK, {})
    const jansKcApi = yield* newFunction()
    const data = yield call(jansKcApi.getKcLinkProperties)
    yield put(getConfigurationResponse(data))
    yield call(postUserAction, audit)
    yield put(toggleSavedFormFlag(false))
    return data
  } catch (e) {
    yield put(getConfigurationResponse(null))
    yield put(toggleSavedFormFlag(false))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* editJansKcLinkConfig({ payload }) {
  const audit = yield* initAudit()
  addAdditionalData(audit, UPDATE, JANS_KC_LINK, payload)
  try {
    const jansKcApi = yield* newFunction()
    const data = yield call(
      jansKcApi.updateKcLinkConfig,
      payload.action.action_data
    )
    yield put(updateToast(true, 'success'))
    yield put(getConfigurationResponse(data))
    yield put(toggleSavedFormFlag(true))
    yield call(postUserAction, audit)
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })
    return data
  } catch (e) {
    yield put(setLoading(false))
    yield put(toggleSavedFormFlag(false))
    yield put(updateToast(true, 'error'))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* watchGetJansKcConfig() {
  yield takeEvery('jansKcLink/getConfiguration', getKcConfiguration)
}

export function* watchPutJansKcConfig() {
  yield takeLatest('jansKcLink/putConfiguration', editJansKcLinkConfig)
}

export default function* rootSaga() {
  yield all([fork(watchGetJansKcConfig), fork(watchPutJansKcConfig)])
}
