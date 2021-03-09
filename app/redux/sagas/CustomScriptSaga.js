/**
 * Custom Script Sagas
 */
import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import {
  getCustomScriptsResponse,
  addCustomScriptResponse,
  editCustomScriptResponse,
  deleteCustomScriptResponse,
  setApiError,
} from '../actions/CustomScriptActions'
import {
  GET_CUSTOM_SCRIPT,
  ADD_CUSTOM_SCRIPT,
  EDIT_CUSTOM_SCRIPT,
  DELETE_CUSTOM_SCRIPT,
} from '../actions/types'
import ScriptApi from '../api/ScriptApi'
import { getClient } from '../api/base'
const JansConfigApi = require('jans_config_api')

//get-all-scripts
export function* getCustomScripts() {
  try {
    const scriptApi = yield* newFunction()
    const data = yield call(scriptApi.getAllCustomScript)
    yield put(getCustomScriptsResponse(data))
  } catch (e) {
    yield put(setApiError(e))
  }
}

//add
export function* addScript({ payload }) {
  try {
    const scriptApi = yield* newFunction()
    const data = yield call(scriptApi.addCustomScript, payload.data)
    yield put(addCustomScriptResponse(data))
  } catch (error) {
    yield put(setApiError(error))
  }
}

//edit
export function* editScript({ payload }) {
  try {
    const scriptApi = yield* newFunction()
    const data = yield call(scriptApi.editCustomScript, payload.data)
    yield put(editCustomScriptResponse(data))
  } catch (error) {
    yield put(setApiError(error))
  }
}

//delete
export function* deleteScript({ payload }) {
  try {
    const scriptApi = yield* newFunction()
    const data = yield call(scriptApi.deleteCustomScript, payload.data)
    yield put(deleteCustomScriptResponse(data))
  } catch (error) {
    yield put(setApiError(error))
  }
}

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.CustomScriptsApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new ScriptApi(api)
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
