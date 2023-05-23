import {
  GET_CACHE_REFRESH_CONFIGURATION,
  PUT_CACHE_REFRESH_CONFIGURATION,
} from "../actions/types";
import { initAudit } from "../../../../app/redux/sagas/SagaUtils";
import { getClient } from "../../../../app/redux/api/base";
import { isFourZeroOneError } from "Utils/TokenController";
import {
  call,
  all,
  put,
  fork,
  takeLatest,
  select,
  takeEvery,
} from "redux-saga/effects";
import { postUserAction } from "../../../../app/redux/api/backend-api";
import { updateToast } from "Redux/actions/ToastAction";
import CacheRefreshApi from "../api/CacheRefreshApi";
import {
  getCacheRefreshConfiguration,
  getCacheRefreshConfigurationResponse,
} from "../actions/CacheRefreshActions";
import { getAPIAccessToken } from "../../../../app/redux/actions/AuthActions";

const JansConfigApi = require("jans_config_api");

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token);
  const issuer = yield select((state) => state.authReducer.issuer);
  const api = new JansConfigApi.CacheRefreshConfigurationApi(
    getClient(JansConfigApi, token, issuer)
  );
  return new CacheRefreshApi(api);
}

export function* getCacheRefreshSaga() {
  const audit = yield* initAudit();
  try {
    const cacheRefreshApi = yield* newFunction();
    const data = yield call(cacheRefreshApi.getPropertiesCacheRefresh);
    yield put(getCacheRefreshConfigurationResponse(data));
    yield call(postUserAction, audit);
  } catch (e) {
    yield put(getCacheRefreshConfigurationResponse(null));
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt);
      yield put(getAPIAccessToken(jwt));
    }
  }
}

export function* editCacheConfig({ payload }) {
  const audit = yield* initAudit();
  try {
    const cacheRefreshApi = yield* newFunction();
    const data = yield call(cacheRefreshApi.updateCacheRefreshConfig, payload);
    yield put(updateToast(true, "success"));
    yield put(getCacheRefreshConfiguration());
    yield call(postUserAction, audit);
  } catch (e) {
    yield put(updateToast(true, "error"));
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt);
      yield put(getAPIAccessToken(jwt));
    }
  }
}

export function* watchGetCacheRefresh() {
  yield takeEvery(GET_CACHE_REFRESH_CONFIGURATION, getCacheRefreshSaga);
}

export function* watchPutCacheRefreshConfig() {
  yield takeLatest(PUT_CACHE_REFRESH_CONFIGURATION, editCacheConfig);
}

export default function* rootSaga() {
  yield all([fork(watchGetCacheRefresh), fork(watchPutCacheRefreshConfig)]);
}
