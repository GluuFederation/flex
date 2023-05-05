import {
  call,
  all,
  put,
  fork,
  takeLatest,
  select,
  takeEvery,
} from 'redux-saga/effects'
import { getAPIAccessToken } from '../../../../app/redux/actions/AuthActions'
import {
  isFourZeroOneError,
} from '../../../../app/utils/TokenController'
import {
  GET_FIDO_CONFIGURATION,
  PUT_FIDO_CONFIGURATION,
} from '../actions/types'
import { getClient } from '../../../../app/redux/api/base'
const JansConfigApi = require('jans_config_api')
import { initAudit } from '../../../../app/redux/sagas/SagaUtils'
import { updateToast } from 'Redux/actions/ToastAction'
import { postUserAction } from '../../../../app/redux/api/backend-api'
import FidoApi from '../api/FidoApi'
import { getFidoConfiguration, getFidoConfigurationResponse } from '../actions/FidoActions'
function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.ConfigurationSMTPApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new FidoApi(api)
}

export function* updateFidoSaga({ payload }) {
  const audit = yield* initAudit()
  try {
    const fidoApi = yield* newFunction()
    const data = yield call(fidoApi.updateSmtpConfig, payload)
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
    const data = yield call(fidoApi.getSmtpConfig);
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
  yield takeEvery(GET_FIDO_CONFIGURATION, getFidoSaga)
}

export function* watchUpdateFido() {
  yield takeLatest(PUT_FIDO_CONFIGURATION, updateFidoSaga)
}


export default function* rootSaga() {
  yield all([
    fork(watchGetFido),
    fork(watchUpdateFido)
  ])
}
