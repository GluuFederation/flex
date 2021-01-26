/**
 * Attribute Sagas
 */
import { call, all, put, fork, takeLatest } from "redux-saga/effects";
import { getAllAttributes, addNewAttribute } from "../api/attribute-api";
import {
  getAttributesResponse,
  addAttributeResponse,
  setApiError
} from "../actions/AttributeActions";
import { GET_ATTRIBUTES, ADD_ATTRIBUTE } from "../actions/types";

export function* getAttributes() {
  try {
    const data = yield call(getAllAttributes);
    yield put(getAttributesResponse(data));
  } catch (e) {
    yield put(setApiError(e));
  }
}

export function* addAttribute({ payload }) {
  try {
    const data = yield call(addNewAttribute, payload.data);
    yield put(addAttributeResponse(data));
  } catch (error) {
    yield put(setApiError(error));
  }
}

export function* watchGetAttributes() {
  console.log("============dispacth received for attributes");
  yield takeLatest(GET_ATTRIBUTES, getAttributes);
}

export function* watchAddAttribute() {
  console.log("============dispacth received for attribute add");
  yield takeLatest(ADD_ATTRIBUTE, addAttribute);
}

export default function* rootSaga() {
  yield all([fork(watchGetAttributes), fork(watchAddAttribute)]);
}
