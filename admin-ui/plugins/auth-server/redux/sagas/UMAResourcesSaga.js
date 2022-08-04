import {
  call,
  all,
  put,
  fork,
  takeEvery,
  takeLatest,
  select,
} from 'redux-saga/effects'
import { getAPIAccessToken } from '../actions/AuthActions'
import {
  getScopesResponse,
  getScopeByPatternResponse,
  addScopeResponse,
  editScopeResponse,
  deleteScopeResponse,
  getUMAResourcesResponse,
} from '../actions/ScopeActions'
import {
  GET_SCOPES,
  SEARCH_SCOPES,
  GET_SCOPE_BY_INUM,
  ADD_SCOPE,
  EDIT_SCOPE,
  DELETE_SCOPE,
  GET_SCOPE_BY_PATTERN,
  GET_UMA_RESOURCES,
} from '../actions/types'
import { SCOPE } from '../audit/Resources'
import {
  CREATE,
  UPDATE,
  DELETION,
  FETCH,
} from '../../../../app/audit/UserActionType'
import UMAResourcesApi from '../api/UMAResourcesApi'
import { getClient } from 'Redux/api/base'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import { postUserAction } from 'Redux/api/backend-api'

const JansConfigApi = require('jans_config_api')
import { initAudit } from 'Redux/sagas/SagaUtils'

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.OAuthUMAResourcesApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new UMAResourcesApi(api)
}

export function* getUmaResources({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, SCOPE, payload)
    const umaResourcesApi = yield* newFunction()
    const data = yield call(umaResourcesApi.getUmaResources, payload.item)
    yield put(getUMAResourcesResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetUmaResources() {
  yield takeLatest(GET_UMA_RESOURCES, getUmaResources)
}

export default function* rootSaga() {
  yield all([fork(watchGetUmaResources)])
}
