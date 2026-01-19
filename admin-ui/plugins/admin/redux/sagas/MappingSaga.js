import { call, all, put, fork, takeLatest, select, takeEvery } from 'redux-saga/effects'
import {
  getMappingResponse,
  updatePermissionsServerResponse,
  updatePermissionsLoading,
  getMapping,
} from 'Plugins/admin/redux/features/mappingSlice'
import { API_MAPPING } from '../audit/Resources'
import { FETCH } from '../../../../app/audit/UserActionType'
import { updateToast } from 'Redux/features/toastSlice'
import { isFourZeroThreeError, addAdditionalData } from 'Utils/TokenController'
import MappingApi from '../api/MappingApi'
import { getClient } from 'Redux/api/base'
import { postUserAction } from 'Redux/api/backend-api'
const JansConfigApi = require('jans_config_api')
import { initAudit, redirectToLogout } from 'Redux/sagas/SagaUtils'

function* newFunction() {
  const issuer = yield select((state) => state.authReducer.issuer)
  // Use null for token - HttpOnly session cookie handles auth
  const api = new JansConfigApi.AdminUIRolePermissionsMappingApi(
    getClient(JansConfigApi, null, issuer),
  )
  return new MappingApi(api)
}

export function* fetchMapping({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, API_MAPPING, payload)
    const mappingApi = yield* newFunction()
    const data = yield call(mappingApi.getMappings)
    yield put(getMappingResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(getMappingResponse({ data: null }))
    if (isFourZeroThreeError(e)) {
      // Session expired - redirect to login
      yield* redirectToLogout()
      return
    }
    return e
  }
}

export function* updateMapping({ payload }) {
  yield put(updatePermissionsLoading({ data: true }))
  try {
    const mappingApi = yield* newFunction()
    const data = yield call(mappingApi.updateMapping, payload.data)
    yield put(updateToast(true, 'success'))
    yield put(updatePermissionsServerResponse({ data }))
    return data
  } catch (e) {
    yield put(updateToast(true, 'error'))
    yield put(updatePermissionsLoading({ data: false }))
    yield put(getMappingResponse({ data: null }))
    if (isFourZeroThreeError(e)) {
      // Session expired - redirect to login
      yield* redirectToLogout()
      return
    }
    return e
  }
}
export function* addMapping({ payload }) {
  yield put(updatePermissionsLoading({ data: true }))
  try {
    const mappingApi = yield* newFunction()
    const data = yield call(mappingApi.addMapping, payload.data)
    yield put(updateToast(true, 'success'))
    yield put(getMapping({}))
    return data
  } catch (e) {
    yield put(updateToast(true, 'error'))
    yield put(updatePermissionsLoading({ data: false }))
    // yield put(getMappingResponse(null))
    if (isFourZeroThreeError(e)) {
      // Session expired - redirect to login
      yield* redirectToLogout()
      return
    }
    return e
  }
}

export function* deleteMapping({ payload }) {
  yield put(updatePermissionsLoading({ data: true }))
  try {
    const mappingApi = yield* newFunction()
    const data = yield call(mappingApi.deleteMapping, payload.data)
    yield put(updateToast(true, 'success'))
    yield put(getMapping({}))
    return data
  } catch (e) {
    yield put(updateToast(true, 'error'))
    yield put(updatePermissionsLoading({ data: false }))
    // yield put(getMappingResponse(null))
    if (isFourZeroThreeError(e)) {
      // Session expired - redirect to login
      yield* redirectToLogout()
      return
    }
    return e
  }
}

export function* watchGetMapping() {
  yield takeLatest('mapping/getMapping', fetchMapping)
  yield takeEvery('mapping/updatePermissionsToServer', updateMapping)
  yield takeEvery('mapping/addNewRolePermissions', addMapping)
  yield takeEvery('mapping/deleteMapping', deleteMapping)
}

export default function* rootSaga() {
  yield all([fork(watchGetMapping)])
}
