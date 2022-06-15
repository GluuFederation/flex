import {
  call,
  all,
  put,
  fork,
  takeLatest,
  select,
  takeEvery,
} from 'redux-saga/effects'
import {
  getMappingResponse,
  updatePermissionsServerResponse,
  updatePermissionsLoading,
  getMapping,
} from '../actions/MappingActions'
import { API_MAPPING } from '../audit/Resources'
import { FETCH } from '../../../../app/audit/UserActionType'
import { getAPIAccessToken } from 'Redux/actions/AuthActions'
import {
  isFourZeroOneError,
  addAdditionalData,
} from 'Utils/TokenController'
import {
  GET_MAPPING,
  UPDATE_PERMISSIONS_TO_SERVER,
  ADD_MAPPING_ROLE_PERMISSIONS,
  DELETE_MAPPING,
} from '../actions/types'
import MappingApi from '../api/MappingApi'
import { getClient } from 'Redux/api/base'
import { postUserAction } from 'Redux/api/backend-api'
const JansConfigApi = require('jans_config_api')
import { initAudit } from 'Redux/sagas/SagaUtils'

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.AdminUIRolePermissionsMappingApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new MappingApi(api)
}

export function* fetchMapping({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, API_MAPPING, payload)
    const mappingApi = yield* newFunction()
    const data = yield call(mappingApi.getMappings)
    yield put(getMappingResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(getMappingResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* updateMapping({ payload }) {
  yield put(updatePermissionsLoading(true))
  try {
    const mappingApi = yield* newFunction()
    const data = yield call(mappingApi.updateMapping, payload.data)
    yield put(updatePermissionsServerResponse(data))
  } catch (e) {
    yield put(updatePermissionsLoading(false))
    yield put(getMappingResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}
export function* addMapping({ payload }) {
  yield put(updatePermissionsLoading(true))
  try {
    const mappingApi = yield* newFunction()
    const data = yield call(mappingApi.addMapping, payload.data)
    yield put(getMapping({}))
  } catch (e) {
    yield put(updatePermissionsLoading(false))
    // yield put(getMappingResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* deleteMapping({ payload }) {
  yield put(updatePermissionsLoading(true))
  try {
    const mappingApi = yield* newFunction()
    const data = yield call(mappingApi.deleteMapping, payload.data)
    yield put(getMapping({}))
  } catch (e) {
    yield put(updatePermissionsLoading(false))
    // yield put(getMappingResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetMapping() {
  yield takeLatest(GET_MAPPING, fetchMapping)
  yield takeEvery(UPDATE_PERMISSIONS_TO_SERVER, updateMapping)
  yield takeEvery(ADD_MAPPING_ROLE_PERMISSIONS, addMapping)
  yield takeEvery(DELETE_MAPPING, deleteMapping)
}

export default function* rootSaga() {
  yield all([fork(watchGetMapping)])
}
