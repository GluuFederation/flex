import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError } from '../../utils/TokenController'
import { getAuthScriptResponse } from '../actions/InitActions'
import { getAPIAccessToken } from '../actions/AuthActions'
import { GET_ACR_AUTH_SCRIPT } from '../actions/types'
import InitApi from '../api/InitApi'
import { getClient } from '../api/base'
const JansConfigApi = require('jans_config_api')

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.CustomScriptsApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new InitApi(api)
}

export function* getPersonAuthScript({ payload }) {
  try {
    const api = yield* newFunction()
    const data = yield call(api.getPersonScripts, payload.action.action_data)
    yield put(getAuthScriptResponse(data))
  } catch (e) {
    yield put(getAuthScriptResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetPersonScript() {
  yield takeLatest(GET_ACR_AUTH_SCRIPT, getPersonAuthScript)
}

export default function* rootSaga() {
  yield all([fork(watchGetPersonScript)])
}
