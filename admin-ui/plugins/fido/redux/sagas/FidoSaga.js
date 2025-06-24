import { call, all, put, fork, takeLatest, select, takeEvery } from 'redux-saga/effects'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import { isFourZeroOneError } from 'Utils/TokenController'
import { getClient } from 'Redux/api/base'
import { initAudit } from 'Redux/sagas/SagaUtils'
import { updateToast } from 'Redux/features/toastSlice'
import { postUserAction } from 'Redux/api/backend-api'
import FidoApi from '../api/FidoApi'
import {
  deleteFido2DeviceDataResponse,
  getFidoConfiguration,
  getFidoConfigurationResponse,
} from '../features/fidoSlice'
import { triggerWebhook } from 'Plugins/admin/redux/sagas/WebhookSaga'

const JansConfigApi = require('jans_config_api')
function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.Fido2ConfigurationApi(getClient(JansConfigApi, token, issuer))
  return new FidoApi(api)
}

function* newFidoFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.Fido2RegistrationApi(getClient(JansConfigApi, token, issuer))
  return new FidoApi(api)
}

function* errorToast({ error }) {
  yield put(
    updateToast(
      true,
      'error',
      error?.response?.data?.description || error?.response?.data?.message || error.message,
    ),
  )
}

export function* updateFidoSaga({ payload }) {
  const audit = yield* initAudit()
  try {
    const fidoApi = yield* newFunction()
    const data = yield call(fidoApi.putPropertiesFido2, payload)
    yield put(updateToast(true, 'success'))
    yield put(getFidoConfiguration())
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

export function* getFidoSaga() {
  const audit = yield* initAudit()
  try {
    const fidoApi = yield* newFunction()
    const data = yield call(fidoApi.getPropertiesFido2)
    yield put(getFidoConfigurationResponse(data))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(getFidoConfigurationResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* deleteFido2DeviceData({ payload }) {
  const audit = yield* initAudit()
  try {
    const fidoApi = yield* newFidoFunction()
    const data = yield call(fidoApi.deleteFido2DeviceData, payload)
    yield put(updateToast(true, 'success'))
    yield put(deleteFido2DeviceDataResponse())
    return data
  } catch (error) {
    yield* errorToast({ error })
    yield put(deleteFido2DeviceDataResponse())
    return error
  }
}

export function* watchGetFido() {
  yield takeEvery('fido2/getFidoConfiguration', getFidoSaga)
}

export function* watchUpdateFido() {
  yield takeLatest('fido2/putFidoConfiguration', updateFidoSaga)
}

export function* watchDeleteFido2DeviceData() {
  yield takeLatest('fido2/deleteFido2DeviceData', deleteFido2DeviceData)
}

export default function* rootSaga() {
  yield all([fork(watchGetFido), fork(watchUpdateFido), fork(watchDeleteFido2DeviceData)])
}
