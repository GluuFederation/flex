import {
  call,
  all,
  put,
  fork,
  takeLatest,
  select,
  takeEvery,
} from 'redux-saga/effects'
import { API_USERS } from '../audit/Resources'
import { FETCH } from '../../../../app/audit/UserActionType'
import { getAPIAccessToken } from '../../../../app/redux/actions/AuthActions'
import {
  isFourZeroOneError,
  addAdditionalData,
} from '../../../../app/utils/TokenController'
import {
  UM_GET_USERS,
  UM_CREATE_NEW_USER,
  UM_UPDATE_EXISTING_USER,
  UM_DELETE_EXISTING_USER,
  UM_UPDATE_PASSWORD,
} from '../actions/types'
import UserApi from '../api/UserApi'
import { getClient } from '../../../../app/redux/api/base'
const JansConfigApi = require('jans_config_api')
import { initAudit } from '../../../../app/redux/sagas/SagaUtils'
import {
  updateUserResponse,
  UMupdateUserLoading,
  redirectToListPage,
  getUsers,
} from '../actions/UserActions'
import { postUserAction } from '../../../../app/redux/api/backend-api'
function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.ConfigurationUserManagementApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new UserApi(api)
}

export function* createNewUserSaga({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, API_USERS, payload)
    const userApi = yield* newFunction()
    const data = yield call(userApi.createUsers, payload)
    if (data) {
      yield put(redirectToListPage(true))
    }
    yield put(UMupdateUserLoading(false))
  } catch (e) {
    yield put(UMupdateUserLoading(false))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}
export function* updateExistingUserSaga({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, API_USERS, payload)
    const userApi = yield* newFunction()
    const data = yield call(userApi.updateUsers, payload)
    if (data) {
      yield put(redirectToListPage(true))
    }
    yield put(UMupdateUserLoading(false))
  } catch (e) {
    yield put(UMupdateUserLoading(false))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* updateUserPasswordSaga({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, API_USERS, payload)
    const userApi = yield* newFunction()
    yield call(userApi.updateUserPassword, payload)
    yield put(UMupdateUserLoading(false))
  } catch (e) {
    yield put(UMupdateUserLoading(false))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* getUsersSaga({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, API_USERS, payload)
    const userApi = yield* newFunction()
    const data = yield call(userApi.getUsers)
    yield put(updateUserResponse(data))
    yield put(UMupdateUserLoading(false))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(UMupdateUserLoading(false))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* deleteUserSaga({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, API_USERS, payload)
    const userApi = yield* newFunction()
    yield call(userApi.deleteUser, payload)
    yield put(getUsers({}))
    yield put(UMupdateUserLoading(false))
  } catch (e) {
    yield put(UMupdateUserLoading(false))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetUsers() {
  yield takeEvery(UM_GET_USERS, getUsersSaga)
}

export function* watchCreateUser() {
  yield takeLatest(UM_CREATE_NEW_USER, createNewUserSaga)
}
export function* watchUpdateUser() {
  yield takeLatest(UM_UPDATE_EXISTING_USER, updateExistingUserSaga)
}
export function* deleteUser() {
  yield takeLatest(UM_DELETE_EXISTING_USER, deleteUserSaga)
}
export function* updateUserPassword() {
  yield takeLatest(UM_UPDATE_PASSWORD, updateUserPasswordSaga)
}

export default function* rootSaga() {
  yield all([
    fork(watchGetUsers),
    fork(watchCreateUser),
    fork(watchUpdateUser),
    fork(deleteUser),
    fork(updateUserPassword),
  ])
}
