import { call, all, put, fork, takeLatest, select } from "redux-saga/effects";
import { isFourZeroOneError, addAdditionalData } from "Utils/TokenController";
import { postUserAction } from "Redux/api/backend-api";
import { getAPIAccessToken } from "Redux/features/authSlice";
import { SESSION } from "../audit/Resources";
import { FETCH, DELETION } from "../../../../app/audit/UserActionType";
import SessionApi from "../api/SessionApi";
import { getClient } from "Redux/api/base";
const JansConfigApi = require("jans_config_api");
import { initAudit } from "Redux/sagas/SagaUtils";
import {
  handleRevokeSession,
  handleUpdateSessionsResponse,
  toggleLoader,
} from "../features/sessionSlice";

function* newFunction() {
  const wholeToken = yield select((state) => state.authReducer.token);
  let token = null;
  if (wholeToken) {
    token = yield select((state) => state.authReducer.token.access_token);
  }

  const issuer = yield select((state) => state.authReducer.issuer);
  const api = new JansConfigApi.AuthSessionManagementApi(
    getClient(JansConfigApi, token, issuer)
  );

  return new SessionApi(api);
}

export function* getSessions({ payload }) {
  const audit = yield* initAudit();
  try {
    payload = payload ? payload : { action: {} };
    addAdditionalData(audit, FETCH, SESSION, payload);
    const sessionApi = yield* newFunction();
    const data = yield call(sessionApi.getAllSessions);
    yield put(handleUpdateSessionsResponse({ data: data }));
    yield call(postUserAction, audit);
    return data;
  } catch (e) {
    yield put(handleUpdateSessionsResponse({ data: null }));
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt);
      yield put(getAPIAccessToken(jwt));
    }
    return e;
  }
}

export function* searchSessions({ payload }) {
  console.log("payload",payload)
  const audit = yield* initAudit();
  try {
    payload = payload ? payload : { action: {} };
    addAdditionalData(audit, FETCH, SESSION, payload);
    const sessionApi = yield* newFunction();
    const data = yield call(sessionApi.searchSession, payload);
    yield put(handleUpdateSessionsResponse({ data: data }));
    yield call(postUserAction, audit);
    return data;
  } catch (e) {
    yield put(handleUpdateSessionsResponse({ data: null }));
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt);
      yield put(getAPIAccessToken(jwt));
    }
    return e;
  }
}

export function* revokeSessionByUserDn({ payload }) {
  const audit = yield* initAudit();
  try {
    yield put(toggleLoader(true));
    addAdditionalData(audit, DELETION, SESSION, payload);
    const sessionApi = yield* newFunction();
    yield call(sessionApi.revokeSession, payload.userDn);
    yield put(handleRevokeSession({ data: payload.userDn }));
    yield call(postUserAction, audit);
  } catch (e) {
    yield put(handleRevokeSession({ data: null }));
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt);
      yield put(getAPIAccessToken(jwt));
    }
  } finally {
    yield put(toggleLoader(false));
  }
}

export function* getSessionsWatcher() {
  yield takeLatest("session/getSessions", getSessions);
}

export function* searchSessionsWatcher() {
  yield takeLatest("session/searchSessions", searchSessions);
}

export function* deleteSessionByUserDnWatcher() {
  yield takeLatest("session/revokeSession", revokeSessionByUserDn);
}

export default function* rootSaga() {
  yield all([
    fork(getSessionsWatcher),
    fork(deleteSessionByUserDnWatcher),
    fork(searchSessionsWatcher),
  ]);
}
