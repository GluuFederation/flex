import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError } from '../../utils/TokenController'
import { getFidoResponse, editFidoResponse } from '../actions/FidoActions'
import { getAPIAccessToken } from '../actions/AuthActions'
import { GET_FIDO, PUT_FIDO } from '../actions/types'
import FidoApi from '../api/FidoApi'
import { getClient } from '../api/base'
const JansConfigApi = require('jans_config_api')

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.ConfigurationFido2Api(
    getClient(JansConfigApi, token, issuer),
  )
  return new FidoApi(api)
}

export function* getFido() {
  try {
    const api = yield* newFunction()
    const data = yield call(api.getFidoConfig)
    yield put(getFidoResponse(data))
  } catch (e) {
    yield put(getFidoResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* editFido({ payload }) {
  try {
    console.log(
      '*********************** Fido2 Saga  payload.data =' +
        JSON.stringify(payload.data),
    )
    const api = yield* newFunction()
    const data = yield call(api.updateFidoConfig, payload.data)
    console.log('Fido2 Saga -  response =' + JSON.stringify(data))
    yield put(editFidoResponse(data))
  } catch (e) {
    yield put(editFidoResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetFidoConfig() {
  yield takeLatest(GET_FIDO, getFido)
}

export function* watchPutFidoConfig() {
  yield takeLatest(PUT_FIDO, editFido)
}
export default function* rootSaga() {
  yield all([fork(watchGetFidoConfig), fork(watchPutFidoConfig)])
}
