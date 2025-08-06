import { call, all, put, fork, takeLatest, select, takeEvery } from 'redux-saga/effects'
import type { PutEffect, SelectEffect } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import { PayloadAction } from '@reduxjs/toolkit'
import { API_USERS } from '../audit/Resources'
import { FETCH, DELETION, UPDATE, CREATE } from '../../../../app/audit/UserActionType'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import UserApi from '../api/UserApi'
import { getClient } from '../../../../app/redux/api/base'
import * as JansConfigApi from 'jans_config_api'
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
  UserTableRowData,
} from '../features/userSlice'
import { updateToast } from 'Redux/features/toastSlice'
import { postUserAction } from 'Redux/api/backend-api'
import { triggerWebhook } from 'Plugins/admin/redux/sagas/WebhookSaga'
import {
  CustomUser,
  UserPagedResult,
  GetUserOptions,
  RootState,
  User2FAPayload,
  FidoRegistrationEntry,
  UserPatchRequest,
  ApiResponse,
  SagaError,
  CustomAttribute,
} from '../../types/UserApiTypes'

// Type guard function to check if error is SagaError
function isSagaError(error: unknown): error is SagaError {
  return typeof error === 'object' && error !== null && ('response' in error || 'message' in error)
}

// Helper function to safely extract error message
function getErrorMessage(error: unknown): string {
  if (isSagaError(error)) {
    return (
      error?.response?.body?.description ||
      error?.response?.body?.message ||
      error?.response?.text ||
      error?.message ||
      'Unknown error'
    )
  }
  return 'Unknown error'
}

// Helper function to create UserApi instance
function* newFunction(): Generator<SelectEffect, UserApi, string> {
  const token: string = yield select((state: RootState) => state.authReducer.token.access_token)
  const issuer: string = yield select((state: RootState) => state.authReducer.issuer)
  const api = new JansConfigApi.ConfigurationUserManagementApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new UserApi(api)
}

export function* createUserSaga({
  payload,
}: PayloadAction<CustomUser>): SagaIterator<CustomUser | unknown> {
  const audit = yield* initAudit()
  try {
    const userApi: UserApi = yield* newFunction()
    const data: CustomUser = yield call(userApi.createUsers, payload)
    yield put(updateToast(true, 'success'))
    yield put(createUserResponse(true))
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })
    addAdditionalData(audit, CREATE, API_USERS, payload)
    delete payload.userPassword
    yield call(postUserAction, audit)
    return data
  } catch (e: unknown) {
    const errMsg = getErrorMessage(e)
    yield* errorToast(errMsg)
    yield put(createUserResponse(false))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* updateUserSaga({
  payload,
}: PayloadAction<CustomUser>): SagaIterator<CustomUser | unknown> {
  const audit = yield* initAudit()
  try {
    const userApi: UserApi = yield* newFunction()
    const data: CustomUser = yield call(userApi.updateUsers, payload)
    yield put(updateToast(true, 'success'))
    yield put(updateUserResponse(true))
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })

    if (payload.customAttributes && payload.customAttributes[0]) {
      delete payload.customAttributes[0].values
    }
    addAdditionalData(audit, UPDATE, API_USERS, payload)
    yield call(postUserAction, audit)
    return data
  } catch (e: unknown) {
    const errMsg = getErrorMessage(e)
    yield* errorToast(errMsg)
    yield put(updateUserResponse(false))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* changeUserPasswordSaga({
  payload,
}: PayloadAction<
  UserPatchRequest & { inum: string; action_message?: string; customAttributes: CustomAttribute[] }
>): SagaIterator<void> {
  const audit = yield* initAudit()
  try {
    const userApi: UserApi = yield* newFunction()
    const data: CustomUser = yield call(userApi.changeUserPassword, payload)
    yield put(updateToast(true, 'success'))
    yield put(changeUserPasswordResponse(data))
    if (payload.customAttributes && payload.customAttributes[0]) {
      delete payload.customAttributes[0].values
    }
    addAdditionalData(audit, UPDATE, API_USERS, payload)
    yield call(postUserAction, audit)
  } catch (e: unknown) {
    const errMsg = getErrorMessage(e)
    yield* errorToast(errMsg)
    yield put(changeUserPasswordResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* getUsersSaga({
  payload,
}: PayloadAction<GetUserOptions>): SagaIterator<UserPagedResult | unknown> {
  const audit = yield* initAudit()
  try {
    const userApi: UserApi = yield* newFunction()
    const data: UserPagedResult = yield call(userApi.getUsers, { action: payload })
    yield put(getUserResponse(data))
    addAdditionalData(audit, FETCH, API_USERS, payload)
    audit.message = `Fetched users`
    yield call(postUserAction, audit)
    return data
  } catch (e: unknown) {
    const errMsg = getErrorMessage(e)
    yield* errorToast(errMsg)
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* deleteUserSaga({
  payload,
}: PayloadAction<UserTableRowData>): SagaIterator<void | unknown> {
  const audit = yield* initAudit()
  try {
    const userApi: UserApi = yield* newFunction()
    yield call(userApi.deleteUser, payload.inum as string)
    yield put(updateToast(true, 'success'))
    yield put(getUsers({}))
    yield put(deleteUserResponse())
    yield* triggerWebhook({ payload: { createdFeatureValue: payload } })
    addAdditionalData(audit, DELETION, API_USERS, payload)
    yield call(postUserAction, audit)
  } catch (e: unknown) {
    const errMsg = getErrorMessage(e)
    yield* errorToast(errMsg)
    yield put(deleteUserResponse())
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* getUser2FADetailsSaga({
  payload,
}: PayloadAction<User2FAPayload>): SagaIterator<FidoRegistrationEntry[] | unknown> {
  try {
    const userApi: UserApi = yield* newFunction()
    const data: FidoRegistrationEntry[] = yield call(userApi.getUser2FADetails, payload)
    yield put(setUser2FADetails({ data }))
    return data
  } catch (e: unknown) {
    const errMsg = getErrorMessage(e)
    yield put(setUser2FADetails({}))
    yield* errorToast(errMsg)

    return e
  }
}

export function* auditLogoutLogsSaga({
  payload,
}: PayloadAction<{ message: string }>): SagaIterator<boolean> {
  const audit = yield* initAudit()

  try {
    addAdditionalData(audit, CREATE, API_USERS, {})
    audit.message = payload.message
    const data: ApiResponse = yield call(postUserAction, audit)
    if (data.status === 200) {
      yield put(auditLogoutLogsResponse(true))
    }
    return true
  } catch (e: unknown) {
    yield put(auditLogoutLogsResponse(false))
    return false
  }
}

// Helper function to show error toast
function* errorToast(errMsg: string): Generator<PutEffect, void, void> {
  yield put(updateToast(true, 'error', errMsg))
}

export function* watchGetUsers(): SagaIterator<void> {
  yield takeEvery('user/getUsers', getUsersSaga)
}

export function* watchGetUser2FADetails(): SagaIterator<void> {
  yield takeEvery('user/getUser2FADetails', getUser2FADetailsSaga)
}

export function* watchCreateUser(): SagaIterator<void> {
  yield takeLatest('user/createUser', createUserSaga)
}

export function* watchUpdateUser(): SagaIterator<void> {
  yield takeLatest('user/updateUser', updateUserSaga)
}

export function* watchDeleteUser(): SagaIterator<void> {
  yield takeLatest('user/deleteUser', deleteUserSaga)
}

export function* watchChangeUserPassword(): SagaIterator<void> {
  yield takeLatest('user/changeUserPassword', changeUserPasswordSaga)
}

export function* watchAuditLogoutLogs(): SagaIterator<void> {
  yield takeLatest('user/auditLogoutLogs', auditLogoutLogsSaga)
}

export default function* rootSaga(): SagaIterator<void> {
  yield all([
    fork(watchGetUsers),
    fork(watchGetUser2FADetails),
    fork(watchCreateUser),
    fork(watchUpdateUser),
    fork(watchDeleteUser),
    fork(watchChangeUserPassword),
    fork(watchAuditLogoutLogs),
  ])
}
