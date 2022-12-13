import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { getAPIAccessToken } from 'Redux/actions/AuthActions'
import { API_PERMISSION } from '../audit/Resources'
import PermissionApi from '../api/PermissionApi'
import { getClient } from 'Redux/api/base'
import { postUserAction } from 'Redux/api/backend-api'
import {
  getPermissionResponse,
  addPermissionResponse,
  editPermissionResponse,
  deletePermissionResponse,
} from '../actions/ApiPermissionActions'
import {
  CREATE,
  UPDATE,
  DELETION,
  FETCH,
} from '../../../../app/audit/UserActionType'
import {
  isFourZeroOneError,
  addAdditionalData,
} from 'Utils/TokenController'
import {updateToast} from 'Redux/actions/ToastAction'
import {
  GET_PERMISSIONS,
  ADD_PERMISSION,
  EDIT_PERMISSION,
  DELETE_PERMISSION,
  GET_PERMISSION,
} from '../actions/types'

const JansConfigApi = require('jans_config_api')
import { initAudit } from 'Redux/sagas/SagaUtils'

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.AdminUIPermissionApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new PermissionApi(api)
}

export function* getPermissions({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, API_PERMISSION, payload)
    const permApi = yield* newFunction()
    const data = yield call(permApi.getPermissions)
    yield put(getPermissionResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(getPermissionResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}
export function* getPermission({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, API_PERMISSION, payload)
    const permApi = yield* newFunction()
    const data = yield call(permApi.getPermission, payload.action.action_data)
    yield put(getPermissionResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(getPermissionResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}
export function* addPermission({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, CREATE, API_PERMISSION, payload)
    const permApi = yield* newFunction()
    const data = yield call(permApi.addPermission, payload.action.action_data)
    yield put(updateToast(true, 'success'))
    yield put(addPermissionResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(updateToast(true, 'error'))
    yield put(addPermissionResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}
export function* editPermission({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, UPDATE, API_PERMISSION, payload)
    const permApi = yield* newFunction()
    const data = yield call(permApi.editPermission, payload.action.action_data)
    yield put(updateToast(true, 'success'))
    yield put(editPermissionResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(updateToast(true, 'error'))
    yield put(editPermissionResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* deletePermission({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, DELETION, API_PERMISSION, payload)
    const permApi = yield* newFunction()
    yield call(permApi.deletePermission, payload.action.action_data)
    yield put(updateToast(true, 'success'))
    yield put(deletePermissionResponse(payload.action.action_data))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(updateToast(true, 'error'))
    yield put(deletePermissionResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetPermissions() {
  yield takeLatest(GET_PERMISSIONS, getPermissions)
}

export function* watchAddPermission() {
  yield takeLatest(ADD_PERMISSION, addPermission)
}

export function* watchEditPermission() {
  yield takeLatest(EDIT_PERMISSION, editPermission)
}
export function* watchDeletePermission() {
  yield takeLatest(DELETE_PERMISSION, deletePermission)
}
export function* watchGetPermission() {
  yield takeLatest(GET_PERMISSION, getPermission)
}
export default function* rootSaga() {
  yield all([
    fork(watchGetPermissions),
    fork(watchAddPermission),
    fork(watchEditPermission),
    fork(watchGetPermission),
    fork(watchDeletePermission),
  ])
}
