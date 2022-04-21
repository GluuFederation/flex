import { all, call, fork, put, takeEvery, select } from 'redux-saga/effects';
import { GET_LICENSE_DETAILS, UPDATE_LICENSE_DETAILS } from '../actions/types';
import {
  getLicenseDetailsResponse,
  updateLicenseDetailsResponse,
} from '../actions/LicenseDetailsActions';
import { getClient } from '../../redux/api/base';
import LicenseDetailsApi from '../api/LicenseDetailsApi';
const JansConfigApi = require('jans_config_api');
import { initAudit } from '../../redux/sagas/SagaUtils';
import { postUserAction } from '../../redux/api/backend-api';
import {
  isFourZeroOneError,
  addAdditionalData,
} from '../../utils/TokenController';
import { getAPIAccessToken } from '../../redux/actions/AuthActions';

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token);
  const issuer = yield select((state) => state.authReducer.issuer);
  const api = new JansConfigApi.AdminUILicenseApi(
    getClient(JansConfigApi, token, issuer),
  );
  return new LicenseDetailsApi(api);
}

export function* getLicenseDetailsWorker({ payload }) {
  const audit = yield* initAudit();
  try {
    //addAdditionalData(audit, FETCH, GET_LICENSE_DETAILS, payload)
    const licenseApi = yield* newFunction();
    const data = yield call(licenseApi.getLicenseDetails);
    yield put(getLicenseDetailsResponse(data));
    yield call(postUserAction, audit);
  } catch (e) {
    yield put(getLicenseDetailsResponse(null));
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt);
      yield put(getAPIAccessToken(jwt));
    }
  }
}

export function* updateLicenseDetailsWorker({ payload }) {
  const audit = yield* initAudit();
  try {
    //addAdditionalData(audit, UPDATE, UPDATE_LICENSE_DETAILS, payload)
    const roleApi = yield* newFunction();
    const data = yield call(roleApi.updateLicenseDetails, payload.action.action_data);
    yield put(updateLicenseDetailsResponse(data));
    yield call(postUserAction, audit);
  } catch (e) {
    yield put(updateLicenseDetailsResponse(null));
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt);
      yield put(getAPIAccessToken(jwt));
    }
  }
}

export function* getLicenseWatcher() {

  yield takeEvery(GET_LICENSE_DETAILS, getLicenseDetailsWorker);
}

export function* updateLicenseWatcher() {
  yield takeEvery(UPDATE_LICENSE_DETAILS, updateLicenseDetailsWorker);
}

export default function* rootSaga() {
  yield all([fork(getLicenseWatcher), fork(updateLicenseWatcher)]);
}