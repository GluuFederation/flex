/**
 * Custom Script Sagas
 */
import {
  call,
  all,
  put,
  fork,
  takeEvery,
  takeLatest
} from "redux-saga/effects";
import { getAllCustomScripts } from "../api/custom-script-api";
import {
  getCustomScriptsResponse,
  setApiError
} from "../actions/CustomScriptActions";
import { GET_CUSTOM_SCRIPT } from "../actions/types";

export function* getCustomScripts() {
  try {
    const data = yield call(getAllCustomScripts);
    console.log("============== :::data = " + data+" ==============");
    yield put(getCustomScriptsResponse(data));
  } catch (e) {
    console.log("===============================:::error" + e);
    yield put(setApiError(e));
  }
}

export function* watchGetCustomScripts() {
  yield takeLatest(GET_CUSTOM_SCRIPT, getCustomScripts);
}

export default function* rootSaga() {
  yield all([fork(watchGetCustomScripts)]);
}
