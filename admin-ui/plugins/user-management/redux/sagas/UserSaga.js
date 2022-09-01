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
  GET_USERS,
  CREATE_NEW_USER,
  UPDATE_USER,
  DELETE_USER,
  CHANGE_USERS_PASSWORD,
} from '../actions/types'
import UserApi from '../api/UserApi'
import { getClient } from '../../../../app/redux/api/base'
const JansConfigApi = require('jans_config_api')
import { initAudit } from '../../../../app/redux/sagas/SagaUtils'
import {
  getUserResponse,
  updateUserResponse,
  deleteUserResponse,
  changeUserPasswordResponse,
  createUserResponse,
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

export function* createUserSaga({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, API_USERS, payload)
    const userApi = yield* newFunction()
    const data = yield call(userApi.createUsers, payload)
    yield put(createUserResponse(data))
  } catch (e) {
    yield put(createUserResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}
export function* updateUserSaga({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, API_USERS, payload)
    const userApi = yield* newFunction()
    const data = yield call(userApi.updateUsers, payload)
    yield put(updateUserResponse(data))
  } catch (e) {
    yield put(updateUserResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* changeUserPasswordSaga({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, API_USERS, payload)
    const userApi = yield* newFunction()
    const data = yield call(userApi.changeUserPassword, payload)
    yield put(changeUserPasswordResponse(data))
  } catch (e) {
    yield put(changeUserPasswordResponse(null))
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
    const data = yield call(userApi.getUsers, payload)
    yield put(getUserResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(getUserResponse(null))
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
    const data = yield call(userApi.deleteUser, payload)
    yield put(getUsers({}))
    yield put(deleteUserResponse(data))
  } catch (e) {
    yield put(deleteUserResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetUsers() {
  yield takeEvery(GET_USERS, getUsersSaga)
}

export function* watchCreateUser() {
  yield takeLatest(CREATE_NEW_USER, createUserSaga)
}
export function* watchUpdateUser() {
  yield takeLatest(UPDATE_USER, updateUserSaga)
}
export function* deleteUser() {
  yield takeLatest(DELETE_USER, deleteUserSaga)
}
export function* changeUserPassword() {
  yield takeLatest(CHANGE_USERS_PASSWORD, changeUserPasswordSaga)
}

export default function* rootSaga() {
  yield all([
    fork(watchGetUsers),
    fork(watchCreateUser),
    fork(watchUpdateUser),
    fork(deleteUser),
    fork(changeUserPassword),
  ])
}
