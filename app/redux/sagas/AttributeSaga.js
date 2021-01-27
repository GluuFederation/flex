/**
 * Attribute Sagas
 */
import { call, all, put, fork, takeLatest } from "redux-saga/effects";
import { isFourZeroOneError, hasApiToken } from "../../utils/TokenController";
import {
  getAllAttributes,
  addNewAttribute,
  editAnAttribute,
  deleteAnAttribute
} from "../api/attribute-api";
import {
  getAttributesResponse,
  addAttributeResponse,
  editAttributeResponse,
  deleteAttributeResponse,
  setApiError
} from "../actions/AttributeActions";
import { getAPIAccessToken } from "../actions/AuthActions";
import {
  GET_ATTRIBUTES,
  ADD_ATTRIBUTE,
  EDIT_ATTRIBUTE,
  DELETE_ATTRIBUTE
} from "../actions/types";

export function* getAttributes() {
  try {
    const data = yield call(getAllAttributes);
    yield put(getAttributesResponse(data));
  } catch (e) {
    if (isFourZeroOneError(e) && !hasApiToken()) {
      yield put(getAPIAccessToken());
    }
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

export function* editAttribute({ payload }) {
  try {
    const data = yield call(editAnAttribute, payload.data);
    yield put(editAttributeResponse(data));
  } catch (error) {
    yield put(setApiError(error));
  }
}

export function* deleteAttribute({ payload }) {
  try {
    const data = yield call(deleteAnAttribute, payload.data);
    yield put(deleteAttributeResponse(data));
  } catch (error) {
    yield put(setApiError(error));
  }
}

export function* watchGetAttributes() {
  yield takeLatest(GET_ATTRIBUTES, getAttributes);
}

export function* watchAddAttribute() {
  yield takeLatest(ADD_ATTRIBUTE, addAttribute);
}

export function* watchEditAttribute() {
  yield takeLatest(EDIT_ATTRIBUTE, editAttribute);
}
export function* watchDeleteAttribute() {
  yield takeLatest(DELETE_ATTRIBUTE, deleteAttribute);
}

export default function* rootSaga() {
  yield all([
    fork(watchGetAttributes),
    fork(watchAddAttribute),
    fork(watchEditAttribute),
    fork(watchDeleteAttribute)
  ]);
}
