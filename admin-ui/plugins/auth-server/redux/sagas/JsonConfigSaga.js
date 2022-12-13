import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { getAPIAccessToken } from '../actions/AuthActions'
import { GET_JSON_CONFIG, PATCH_JSON_CONFIG } from '../actions/types'
import JsonConfigApi from '../api/JsonConfigApi'
import { getClient } from 'Redux/api/base'
import { JSON_CONFIG } from '../audit/Resources'
import { PATCH, FETCH } from '../../../../app/audit/UserActionType'
import { postUserAction } from 'Redux/api/backend-api'
import {updateToast} from 'Redux/actions/ToastAction'
import {
  isFourZeroOneError,
  addAdditionalData,
} from 'Utils/TokenController'
import {
  getJsonConfigResponse,
  patchJsonConfigResponse,
} from '../actions/JsonConfigActions'
import {} from '../../common/Constants'

const JansConfigApi = require('jans_config_api')
import { initAudit } from 'Redux/sagas/SagaUtils'

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.ConfigurationPropertiesApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new JsonConfigApi(api)
}

export function* getJsonConfig({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, JSON_CONFIG, payload)
    const configApi = yield* newFunction()
    const data = yield call(configApi.fetchJsonConfig)
    yield put(getJsonConfigResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    console.log(e)
    yield put(getJsonConfigResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* patchJsonConfig({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, PATCH, JSON_CONFIG, payload)
    const configApi = yield* newFunction()
    const data = yield call(
      configApi.patchJsonConfig,
      payload.action.action_data,
    )
    yield put(updateToast(true, 'success'))
    yield put(patchJsonConfigResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(updateToast(true, 'error'))
    yield put(patchJsonConfigResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetJsonConfig() {
  yield takeLatest(GET_JSON_CONFIG, getJsonConfig)
}
export function* watchPatchJsonConfig() {
  yield takeLatest(PATCH_JSON_CONFIG, patchJsonConfig)
}

export default function* rootSaga() {
  yield all([fork(watchGetJsonConfig), fork(watchPatchJsonConfig)])
}
