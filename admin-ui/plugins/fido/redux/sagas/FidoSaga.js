import {
  call,
  all,
  put,
  fork,
  takeLatest,
  select,
  takeEvery,
} from 'redux-saga/effects'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import { isFourZeroOneError } from 'Utils/TokenController'
import { getClient } from 'Redux/api/base'
import { initAudit } from 'Redux/sagas/SagaUtils'
import { updateToast } from 'Redux/features/toastSlice'
import { postUserAction } from 'Redux/api/backend-api'
import FidoApi from '../api/FidoApi'
import { getFidoConfiguration, getFidoConfigurationResponse } from '../features/fidoSlice'

const JansConfigApi = require('jans_config_api')
function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.Fido2ConfigurationApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new FidoApi(api)
}

export function* updateFidoSaga({ payload }) {
  const audit = yield* initAudit()
  try {
    const fidoApi = yield* newFunction()
    yield call(fidoApi.putPropertiesFido2, payload)
    yield put(updateToast(true, 'success'))
    yield put(getFidoConfiguration())
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(updateToast(true, 'error'))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* getFidoSaga() {
  const audit = yield* initAudit()
  try {
    const fidoApi = yield* newFunction()
    const data = yield call(fidoApi.getPropertiesFido2);
    yield put(getFidoConfigurationResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(getFidoConfigurationResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}


export function* watchGetFido() {
  yield takeEvery('fido2/getFidoConfiguration', getFidoSaga)
}

export function* watchUpdateFido() {
  yield takeLatest('fido2/putFidoConfiguration', updateFidoSaga)
}


export default function* rootSaga() {
  yield all([
    fork(watchGetFido),
    fork(watchUpdateFido)
  ])
}
