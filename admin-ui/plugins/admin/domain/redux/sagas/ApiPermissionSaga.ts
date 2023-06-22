import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import { API_PERMISSION } from '../../../utils/Resources'
import PermissionApi from '../../../infrastructure/api/PermissionApi'
import { getClient } from 'Redux/api/base'
import { postUserAction } from 'Redux/api/backend-api'
import {
  getPermissionResponse,
  addPermissionResponse,
  editPermissionResponse,
  deletePermissionResponse,
} from 'Plugins/admin/domain/redux/features/ApiPermissionSlice'
import {
  CREATE,
  UPDATE,
  DELETION,
  FETCH,
} from '../../../../../app/audit/UserActionType'
import {
  isFourZeroOneError,
  addAdditionalData,
} from 'Utils/TokenController'
import {updateToast} from 'Redux/features/toastSlice'

const JansConfigApi = require('jans_config_api')
import { initAudit } from 'Redux/sagas/SagaUtils'
import { PayloadAction } from '@reduxjs/toolkit'

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.AdminUIPermissionApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new PermissionApi(api)
}

export function* getPermissions({ payload } : PayloadAction<any>) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, API_PERMISSION, payload)
    const permApi = yield* newFunction()
    const data = yield call(permApi.getPermissions)
    yield put(getPermissionResponse({ data }))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(getPermissionResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* addPermission({ payload } : PayloadAction<any>) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, CREATE, API_PERMISSION, payload)
    const permApi = yield* newFunction()
    const data = yield call(permApi.addPermission, payload.action.action_data)
    yield put(updateToast(true, 'success'))
    yield put(addPermissionResponse({ data }))
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
export function* editPermission({ payload } : PayloadAction<any>) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, UPDATE, API_PERMISSION, payload)
    const permApi = yield* newFunction()
    const data = yield call(permApi.editPermission, payload.action.action_data)
    yield put(updateToast(true, 'success'))
    yield put(editPermissionResponse({ data }))
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

export function* deletePermission({ payload } : PayloadAction<any>) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, DELETION, API_PERMISSION, payload)
    const permApi = yield* newFunction()
    yield call(permApi.deletePermission, payload.action.action_data)
    yield put(updateToast(true, 'success'))
    yield put(deletePermissionResponse({ inum: payload.action.action_data }))
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
  yield takeLatest('apiPermission/getPermissions', getPermissions)
}

export function* watchAddPermission() {
  yield takeLatest('apiPermission/addPermission', addPermission)
}

export function* watchEditPermission() {
  yield takeLatest('apiPermission/editPermission', editPermission)
}
export function* watchDeletePermission() {
  yield takeLatest('apiPermission/deletePermission', deletePermission)
}

export default function* rootSaga() {
  yield all([
    fork(watchGetPermissions),
    fork(watchAddPermission),
    fork(watchEditPermission),
    fork(watchDeletePermission),
  ])
}
