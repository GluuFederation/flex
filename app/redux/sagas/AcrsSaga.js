import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError, hasApiToken } from '../../utils/TokenController'
import {
  getAcrsConfig,
  updateAcrsConfig,
} from '../api/acrs-api'
import {
  getAcrsResponse,
  editAcrsResponse,
} from '../actions/AcrsActions'
import { getAPIAccessToken } from '../actions/AuthActions'
import { GET_ACRS, PUT_ACRS } from '../actions/types'
export function* getAcrs() {
  try {
    const data = yield call(getAcrsConfig)
    yield put(getAcrsResponse(data))
  } catch (e) {
    yield put(getAcrsResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* editAcrs({ payload }) {
  try {
    const data = yield call(updateAcrsConfig, payload.data)
    yield put(editAcrsResponse(data))
  } catch (e) {
    if (isFourZeroOneError(e) && !hasApiToken()) {
      yield put(getAPIAccessToken())
    }
  }
}

export function* watchGetAcrsConfig() {
  yield takeLatest(GET_ACRS, getAcrs)
}

export function* watchPutAcrsConfig() {
  yield takeLatest(PUT_ACRS, editAcrs)
}
export default function* rootSaga() {
  yield all([fork(watchGetAcrsConfig), fork(watchPutAcrsConfig)])
}
