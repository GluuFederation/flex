import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError, hasApiToken } from '../../utils/TokenController'
import { getFidoConfig, updateFidoConfig } from '../api/fido-api'
import { getFidoResponse, editFidoResponse } from '../actions/FidoActions'
import { getAPIAccessToken } from '../actions/AuthActions'
import { GET_FIDO, PUT_FIDO } from '../actions/types'
export function* getFido() {
  try {
    const data = yield call(getFidoConfig)
    //console.log("=========fido data "+JSON.stringify(data))
    yield put(getFidoResponse(data.fido2Configuration))
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
    const data = yield call(updateFidoConfig, payload.data)
    yield put(editFidoResponse(data))
  } catch (e) {
    if (isFourZeroOneError(e) && !hasApiToken()) {
      yield put(getAPIAccessToken())
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
