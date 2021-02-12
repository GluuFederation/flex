/**
 * Custom Script Sagas
 */
import {
  call,
  all,
  put,
  fork,
  takeLatest
} from "redux-saga/effects";
import {
  getAllCustomScript,
  addCustomScript,
  editCustomScript,
  deleteCustomScript
  } from "../api/custom-script-api";
import {
  getCustomScriptsResponse,
  addCustomScriptResponse,
  editCustomScriptResponse,
  deleteCustomScriptResponse,
  setApiError
} from "../actions/CustomScriptActions";
import { 
  GET_CUSTOM_SCRIPT,
  ADD_CUSTOM_SCRIPT,
  EDIT_CUSTOM_SCRIPT,
  DELETE_CUSTOM_SCRIPT
  } from "../actions/types";

  //get-all-scripts
export function* getCustomScripts() {
  try {
    const data = yield call(getAllCustomScript);
    yield put(getCustomScriptsResponse(data));
  } catch (e) {
    yield put(setApiError(e));
  }
}

//add
export function* addScript({ payload }) {
  try {
    const data = yield call(addCustomScript, payload.data);
    yield put(addCustomScriptResponse(data));
  } catch (error) {
    yield put(setApiError(error));
  }
}

//edit
export function* editScript({ payload }) {
  try {
    const data = yield call(editCustomScript, payload.data);
    yield put(editCustomScriptResponse(data));
  } catch (error) {
    yield put(setApiError(error));
  }
}

//delete
export function* deleteScript({ payload }) {
  try {
    const data = yield call(deleteCustomScript, payload.data);
    yield put(deleteCustomScriptResponse(data));
  } catch (error) {
    yield put(setApiError(error));
  }
}

export function* watchGetAllCustomScripts() {
  yield takeLatest(GET_CUSTOM_SCRIPT, getCustomScripts);
}

export function* watchAddScript() {
  yield takeLatest(ADD_CUSTOM_SCRIPT, addScript);
}

export function* watchEditScript() {
  yield takeLatest(EDIT_CUSTOM_SCRIPT, editScript);
}
export function* watchDeleteScript() {
  yield takeLatest(DELETE_CUSTOM_SCRIPT, deleteScript);
}

export default function* rootSaga() {
  yield all([
    fork(watchGetAllCustomScripts),
    fork(watchAddScript),
    fork(watchEditScript),
    fork(watchDeleteScript)
  ]);
}
