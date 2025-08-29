import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError } from 'Utils/TokenController'
import { getAcrsResponse, editAcrsResponse } from '../features/acrSlice'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import AcrApi from '../api/AcrApi'
import { getClient } from 'Redux/api/base'
import { updateToast } from '@/redux/features/toastSlice'
const JansConfigApi = require('jans_config_api')
import { initAudit } from '@/redux/sagas/SagaUtils'
import { addAdditionalData } from '@/utils/TokenController'
import { UPDATE } from '@/audit/UserActionType'
import { postUserAction } from '@/redux/api/backend-api'
import { BASIC } from '@/utils/ApiResources'

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.DefaultAuthenticationMethodApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new AcrApi(api)
}

export function* getCurrentAcrs() {
  try {
    const api = yield* newFunction()
    const data = yield call(api.getAcrsConfig)
    yield put(getAcrsResponse({ data }))
  } catch (e) {
    yield put(getAcrsResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* editAcrs({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, UPDATE, BASIC, {})
    audit.message = payload?.data?.userMessage
    const api = yield* newFunction()
    const data = yield call(api.updateAcrsConfig, payload.data)
    yield put(updateToast(true, 'success'))
    yield put(editAcrsResponse({ data }))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(updateToast(true, 'error'))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetAcrsConfig() {
  yield takeLatest('acr/getAcrsConfig', getCurrentAcrs)
}

export function* watchPutAcrsConfig() {
  yield takeLatest('acr/editAcrs', editAcrs)
}
export default function* rootSaga() {
  yield all([fork(watchGetAcrsConfig), fork(watchPutAcrsConfig)])
}
