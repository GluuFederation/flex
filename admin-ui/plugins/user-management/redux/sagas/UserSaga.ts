import { call, all, put, fork, takeLatest, select, takeEvery } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'
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

// Type definitions
interface CustomUser {
  userId?: string
  mail?: string
  displayName?: string
  status?: string
  userPassword?: string
  givenName?: string
  customAttributes?: CustomAttribute[]
  inum?: string
  dn?: string
  action_message?: string
  [key: string]: any
}

interface CustomAttribute {
  name: string
  multiValued: boolean
  values?: string[]
}

interface UserAction {
  action?: string
  limit?: number
  pattern?: string
  startIndex?: number
  [key: string]: any
}

interface UserPatchRequest {
  inum: string
  jsonPatchString?: string
  customAttributes?: CustomAttribute[]
  action_message?: string
  [key: string]: any
}

interface User2FAPayload {
  username: string
  token: string
}

interface DeleteUserPayload {
  inum: string
  action_message?: string
  [key: string]: any
}

interface AuditLogoutPayload {
  message: string
  [key: string]: any
}

interface RootState {
  authReducer: {
    token: {
      access_token: string
    }
    issuer: string
    userinfo_jwt: string
  }
}

// API Error interface
interface ApiError {
  response?: {
    body?: {
      description?: string
      message?: string
    }
    text?: string
    status?: number
  }
  message?: string
  name?: string
}

function* newFunction(): Generator<any, UserApi, any> {
  const token: string = yield select((state: RootState) => state.authReducer.token.access_token)
  const issuer: string = yield select((state: RootState) => state.authReducer.issuer)
  const api = new JansConfigApi.ConfigurationUserManagementApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new UserApi(api)
}

export function* createUserSaga({ payload }: PayloadAction<CustomUser>): Generator<any, any, any> {
  const audit = yield* initAudit()
  try {
    const userApi: UserApi = yield* newFunction()
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
    const error = e as ApiError
    const errMsg =
      error?.response?.body?.description ||
      error?.response?.body?.message ||
      error?.response?.text ||
      'An error occurred'
    yield* errorToast(errMsg)
    yield put(createUserResponse(null))
    if (isFourZeroOneError(error)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return error
  }
}

export function* updateUserSaga({ payload }: PayloadAction<CustomUser>): Generator<any, any, any> {
  const audit = yield* initAudit()
  try {
    const userApi: UserApi = yield* newFunction()
    const data = yield call(userApi.updateUsers, payload)
    yield put(updateToast(true, 'success'))
    yield put(updateUserResponse(data))
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })

    if (payload.customAttributes?.[0]?.values) {
      delete payload.customAttributes[0].values
    }
    addAdditionalData(audit, UPDATE, API_USERS, payload)
    audit.message = payload.action_message || ``
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    const error = e as ApiError
    const errMsg =
      error?.response?.body?.description ||
      error?.response?.body?.message ||
      error?.response?.text ||
      'An error occurred'
    yield* errorToast(errMsg)
    yield put(updateUserResponse(null))
    if (isFourZeroOneError(error)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return error
  }
}

export function* changeUserPasswordSaga({
  payload,
}: PayloadAction<UserPatchRequest>): Generator<any, any, any> {
  const audit = yield* initAudit()
  try {
    const userApi: UserApi = yield* newFunction()
    const data = yield call(userApi.changeUserPassword, payload)
    yield put(updateToast(true, 'success'))
    yield put(changeUserPasswordResponse(data))

    addAdditionalData(audit, UPDATE, API_USERS, payload)
    delete payload.customAttributes?.[0]?.values
    audit.message = payload?.action_message || ``
    yield call(postUserAction, audit)
  } catch (e) {
    const error = e as ApiError
    const errMsg =
      error?.response?.body?.description ||
      error?.response?.body?.message ||
      error?.response?.text ||
      'An error occurred'
    yield* errorToast(errMsg)
    yield put(changeUserPasswordResponse(null))
    if (isFourZeroOneError(error)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* getUsersSaga({ payload }: PayloadAction<UserAction>): Generator<any, any, any> {
  const audit = yield* initAudit()
  try {
    const userApi: UserApi = yield* newFunction()
    const data = yield call(userApi.getUsers, payload)
    yield put(getUserResponse(data))

    addAdditionalData(audit, FETCH, API_USERS, payload)
    audit.message = `Fetched users`
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    const error = e as ApiError
    const errMsg =
      error?.response?.body?.description ||
      error?.response?.body?.message ||
      error?.response?.text ||
      'An error occurred'
    yield* errorToast(errMsg)
    if (isFourZeroOneError(error)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return error
  }
}

export function* deleteUserSaga({
  payload,
}: PayloadAction<DeleteUserPayload>): Generator<any, any, any> {
  const audit = yield* initAudit()
  try {
    const userApi: UserApi = yield* newFunction()
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
    const error = e as ApiError
    const errMsg =
      error?.response?.body?.description ||
      error?.response?.body?.message ||
      error?.response?.text ||
      'An error occurred'
    yield* errorToast(errMsg)
    yield put(deleteUserResponse(null))
    if (isFourZeroOneError(error)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return error
  }
}

export function* getUser2FADetailsSaga({
  payload,
}: PayloadAction<User2FAPayload>): Generator<any, any, any> {
  try {
    const userApi: UserApi = yield* newFunction()
    const data = yield call(userApi.getUser2FADetails, payload)
    yield put(setUser2FADetails(data))
    return data
  } catch (e) {
    const error = e as ApiError
    const errMsg =
      error?.response?.body?.description ||
      error?.response?.body?.message ||
      error?.response?.text ||
      'An error occurred'
    yield put(setUser2FADetails(null))
    yield* errorToast(errMsg)

    return error
  }
}

export function* auditLogoutLogsSaga({
  payload,
}: PayloadAction<AuditLogoutPayload>): Generator<any, any, any> {
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

function* errorToast(errMsg: string): Generator<any, void, any> {
  yield put(updateToast(true, 'error', errMsg))
}

export function* watchGetUsers(): Generator<any, void, any> {
  yield takeEvery('user/getUsers', getUsersSaga)
}

export function* watchGetUser2FADetails(): Generator<any, void, any> {
  yield takeEvery('user/getUser2FADetails', getUser2FADetailsSaga)
}

export function* watchCreateUser(): Generator<any, void, any> {
  yield takeLatest('user/createUser', createUserSaga)
}

export function* watchUpdateUser(): Generator<any, void, any> {
  yield takeLatest('user/updateUser', updateUserSaga)
}

export function* deleteUser(): Generator<any, void, any> {
  yield takeLatest('user/deleteUser', deleteUserSaga)
}

export function* changeUserPassword(): Generator<any, void, any> {
  yield takeLatest('user/changeUserPassword', changeUserPasswordSaga)
}

export function* auditLogoutLogs(): Generator<any, void, any> {
  yield takeLatest('user/auditLogoutLogs', auditLogoutLogsSaga)
}

export default function* rootSaga(): Generator<any, void, any> {
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
