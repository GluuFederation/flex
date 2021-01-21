/**
 * Attribute Sagas
 */
import {
  call,
  all,
  put,
  fork,
  takeEvery,
  takeLatest
} from "redux-saga/effects";
import { getAllAttributes } from "../api/attribute-api";
import {
  getAttributesResponse,
  setApiError
} from "../actions/AttributeActions";
import { GET_ATTRIBUTES } from "../actions/types";



export function* getAttributes() {
  try {
    const data = yield call(getAllAttributes);
    yield put(getAttributesResponse(data));
  } catch (e) {
    console.log("===============================error" + e);
    yield put(setApiError(e));
  }
}


export function* watchGetAttributes() {
  yield takeLatest(GET_ATTRIBUTES, getAttributes);
}

export default function* rootSaga() {
  yield all([fork(watchGetAttributes)]);
}
