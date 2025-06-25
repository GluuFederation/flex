// @ts-nocheck
import { all, call, fork, put, select, takeLatest } from 'redux-saga/effects'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import { FETCH } from '../../audit/UserActionType'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import { API_USERS } from 'Plugins/user-management/redux/audit/Resources'
import UserApi from 'Plugins/user-management/redux/api/UserApi'
import { initAudit } from 'Redux/sagas/SagaUtils'
import { postUserAction } from 'Redux/api/backend-api'
import { setUserProfileDetails } from 'Redux/features/ProfileDetailsSlice'
import { getProfileDetails, checkIsLoadingDetails } from '../features/ProfileDetailsSlice'
const JansConfigApi = require('jans_config_api')
import { getClient } from 'Redux/api/base'

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.ConfigurationUserManagementApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new UserApi(api)
}

function* getProfileDetailsWorker({ payload }) {
  const audit = yield* initAudit()
  try {
    yield put(checkIsLoadingDetails(true))
    addAdditionalData(audit, FETCH, API_USERS, payload)
    const userApi = yield* newFunction()
    const data = yield call(userApi.getUsers, payload)
    yield put(setUserProfileDetails(data?.entries?.[0]))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(setUserProfileDetails(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  } finally {
    yield put(checkIsLoadingDetails(false))
  }
}

//watcher sagas
export function* getProfileDetailsWatcher() {
  yield takeLatest(getProfileDetails.toString(), getProfileDetailsWorker)
}

export default function* rootSaga() {
  yield all([fork(getProfileDetailsWatcher)])
}
