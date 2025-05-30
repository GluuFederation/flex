// @ts-nocheck
import { call, all, put, fork, select, takeLatest } from "redux-saga/effects";
import { isFourZeroOneError } from "Utils/TokenController";

import { getAPIAccessToken } from "../features/authSlice";
import { getClient } from "../api/base";
import { initAudit } from "../sagas/SagaUtils";
import LockApi from "../api/LockApi";
import { getLockStatusResponse } from "../features/lockSlice";
const JansConfigApi = require("jans_config_api");

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token);
  const issuer = yield select((state) => state.authReducer.issuer);
  const api = new JansConfigApi.StatisticsApi(
    getClient(JansConfigApi, token, issuer)
  );
  return new LockApi(api);
}

export function* getLockMau({ payload }) {
  const audit = yield* initAudit();
  try {
    const lockapi = yield* newFunction();
    const data = yield call(lockapi.getLockMau,payload);
    yield put(getLockStatusResponse({ data }));
  } catch (e) {
    yield put(getLockStatusResponse(null));
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt);
      yield put(getAPIAccessToken(jwt));
    }
  }
}

export function* watchGetLockMau() {
  yield takeLatest("lock/getLockStatus", getLockMau);
}

export default function* rootSaga() {
  yield all([fork(watchGetLockMau)]);
}
