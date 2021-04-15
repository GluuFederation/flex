/**
 * Custom Script Sagas
 */
import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import {
  getCustomScriptsResponse,
  addCustomScriptResponse,
  editCustomScriptResponse,
  deleteCustomScriptResponse,
} from '../actions/CustomScriptActions'
import { getAPIAccessToken } from '../actions/AuthActions'
import { isFourZeroOneError } from '../../utils/TokenController'
import {
  GET_CUSTOM_SCRIPT,
  GET_CUSTOM_SCRIPT_BY_TYPE,
  ADD_CUSTOM_SCRIPT,
  EDIT_CUSTOM_SCRIPT,
  DELETE_CUSTOM_SCRIPT,
} from '../actions/types'
import ScriptApi from '../api/ScriptApi'
import { getClient } from '../api/base'
import { options } from 'numeral'
const JansConfigApi = require('jans_config_api')

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.CustomScriptsApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new ScriptApi(api)
}

//get-all-scripts
export function* getCustomScripts() {
  try {
    const scriptApi = yield* newFunction()
    const data = yield call(scriptApi.getAllCustomScript)
    yield put(getCustomScriptsResponse(data))
  } catch (e) {
    yield put(getCustomScriptsResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

//search scripts by type
export function* getScriptsByType({ payload }) {
  try {
    const scriptApi = yield* newFunction()
    const data = yield call(scriptApi.getScriptsByType, payload.options)
    yield put(getCustomScriptsResponse(data))
  } catch (e) {
    yield put(getCustomScriptsResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

//add
export function* addScript({ payload }) {
  try {
    const scriptApi = yield* newFunction()
    const data = yield call(scriptApi.addCustomScript, payload.data)
    yield put(addCustomScriptResponse(data))
  } catch (e) {
    yield put(addCustomScriptResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

//edit
export function* editScript({ payload }) {
  try {
    const scriptApi = yield* newFunction()
    const data = yield call(scriptApi.editCustomScript, payload.data)
    yield put(editCustomScriptResponse(data))
  } catch (e) {
    yield put(editCustomScriptResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

//delete
export function* deleteScript({ payload }) {
  try {
    const scriptApi = yield* newFunction()
    const data = yield call(scriptApi.deleteCustomScript, payload.inum)
    yield put(deleteCustomScriptResponse(payload.inum))
  } catch (e) {
    yield put(deleteCustomScriptResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetAllCustomScripts() {
  yield takeLatest(GET_CUSTOM_SCRIPT, getCustomScripts)
}

export function* watchAddScript() {
  yield takeLatest(ADD_CUSTOM_SCRIPT, addScript)
}

export function* watchEditScript() {
  yield takeLatest(EDIT_CUSTOM_SCRIPT, editScript)
}
export function* watchDeleteScript() {
  yield takeLatest(DELETE_CUSTOM_SCRIPT, deleteScript)
}

export default function* rootSaga() {
  yield all([
    fork(watchGetAllCustomScripts),
    fork(watchAddScript),
    fork(watchEditScript),
    fork(watchDeleteScript),
  ])
}
