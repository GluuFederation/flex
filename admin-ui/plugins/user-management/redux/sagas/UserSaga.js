import { call, all, put, fork, takeLatest, select, takeEvery } from 'redux-saga/effects'
import { API_USERS } from '../audit/Resources'
import { FETCH, DELETION, UPDATE, CREATE } from '../../../../app/audit/UserActionType'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import UserApi from '../api/UserApi'
import { getClient } from '../../../../app/redux/api/base'
const JansConfigApi = require('jans_config_api')
import { initAudit } from 'Redux/sagas/SagaUtils'
import {
  getUserResponse,
  updateUserResponse,
  deleteUserResponse,
  changeUserPasswordResponse,
  createUserResponse,
  getUsers,
  setUser2FADetails,
  auditLogoutLogsResponse,
} from '../features/userSlice'
import { updateToast } from 'Redux/features/toastSlice'
import { postUserAction } from 'Redux/api/backend-api'
import { triggerWebhook } from 'Plugins/admin/redux/sagas/WebhookSaga'

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
    const userApi = yield* newFunction()
    const data = yield call(userApi.createUsers, payload)
    yield put(updateToast(true, 'success'))
    yield put(createUserResponse(data))
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })

    addAdditionalData(audit, CREATE, API_USERS, payload)
    audit.message = payload?.action_message || ``

    delete payload.userPassword
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    const errMsg = e?.response?.body?.description || e?.response?.body?.message || e?.response?.text
    yield* errorToast(errMsg)
    yield put(createUserResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* updateUserSaga({ payload }) {
  const audit = yield* initAudit()
  try {
    const userApi = yield* newFunction()
    const data = yield call(userApi.updateUsers, payload)
    yield put(updateToast(true, 'success'))
    yield put(updateUserResponse(data))
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })

    delete payload.customAttributes[0].values
    addAdditionalData(audit, UPDATE, API_USERS, payload)
    delete payload.customAttributes[0].values
    audit.message = payload.action_message || ``
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    const errMsg = e?.response?.body?.description || e?.response?.body?.message || e?.response?.text
    yield* errorToast(errMsg)
    yield put(updateUserResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* changeUserPasswordSaga({ payload }) {
  const audit = yield* initAudit()
  try {
    const userApi = yield* newFunction()
    const data = yield call(userApi.changeUserPassword, payload)
    yield put(updateToast(true, 'success'))
    yield put(changeUserPasswordResponse(data))

    addAdditionalData(audit, UPDATE, API_USERS, payload)
    delete payload.customAttributes[0].values
    audit.message = payload?.action_message || ``
    yield call(postUserAction, audit)
  } catch (e) {
    const errMsg = e?.response?.body?.description || e?.response?.body?.message || e?.response?.text
    yield* errorToast(errMsg)
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
    const userApi = yield* newFunction()
    const data = yield call(userApi.getUsers, payload)
    yield put(getUserResponse(data))

    addAdditionalData(audit, FETCH, API_USERS, payload)
    audit.message = `Fetched users`
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    const errMsg = e?.response?.body?.description || e?.response?.body?.message || e?.response?.text
    yield* errorToast(errMsg)
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* deleteUserSaga({ payload }) {
  const audit = yield* initAudit()
  try {
    const userApi = yield* newFunction()
    const data = yield call(userApi.deleteUser, payload.inum)
    yield put(updateToast(true, 'success'))
    yield put(getUsers({}))
    yield put(deleteUserResponse(data))
    yield* triggerWebhook({ payload: { createdFeatureValue: payload } })

    addAdditionalData(audit, DELETION, API_USERS, payload)
    audit.message = payload.action_message || ``
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    const errMsg = e?.response?.body?.description || e?.response?.body?.message || e?.response?.text
    yield* errorToast(errMsg)
    yield put(deleteUserResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* getUser2FADetailsSaga({ payload }) {
  try {
    const userApi = yield* newFunction()
    const data = yield call(userApi.getUser2FADetails, payload)
    yield put(setUser2FADetails(data))
    return data
  } catch (e) {
    const errMsg = e?.response?.body?.description || e?.response?.body?.message || e?.response?.text
    yield put(setUser2FADetails())
    yield* errorToast(errMsg)

    return e
  }
}

export function* auditLogoutLogsSaga({ payload }) {
  const audit = yield* initAudit()

  try {
    addAdditionalData(audit, CREATE, API_USERS, {})
    audit.message = payload.message
    const data = yield call(postUserAction, audit)
    if (data.status === 200) {
      yield put(auditLogoutLogsResponse(true))
    }
  } catch (e) {
    yield put(auditLogoutLogsResponse(false))
    return false
  }
}

function* errorToast(errMsg) {
  yield put(updateToast(true, 'error', errMsg))
}

export function* watchGetUsers() {
  yield takeEvery('user/getUsers', getUsersSaga)
}

export function* watchGetUser2FADetails() {
  yield takeEvery('user/getUser2FADetails', getUser2FADetailsSaga)
}

export function* watchCreateUser() {
  yield takeLatest('user/createUser', createUserSaga)
}
export function* watchUpdateUser() {
  yield takeLatest('user/updateUser', updateUserSaga)
}
export function* deleteUser() {
  yield takeLatest('user/deleteUser', deleteUserSaga)
}

export function* changeUserPassword() {
  yield takeLatest('user/changeUserPassword', changeUserPasswordSaga)
}

export function* auditLogoutLogs() {
  yield takeLatest('user/auditLogoutLogs', auditLogoutLogsSaga)
}

export default function* rootSaga() {
  yield all([
    fork(watchGetUsers),
    fork(watchGetUser2FADetails),
    fork(watchCreateUser),
    fork(watchUpdateUser),
    fork(deleteUser),
    fork(changeUserPassword),
    fork(auditLogoutLogs),
  ])
}
