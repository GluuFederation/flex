import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import {
  isFourZeroOneError,
  addAdditionalData,
} from 'Utils/TokenController'
import { postUserAction } from 'Redux/api/backend-api'
import { getUMAResourcesByClientResponse } from '../actions/UMAResourceActions'
import { getAPIAccessToken } from '../actions/AuthActions'
import { UMA } from '../audit/Resources'
import { FETCH } from '../../../../app/audit/UserActionType'
import { GET_UMA_RESOURCES } from '../actions/types'
import UMAResourceApi from '../api/UMAResourceApi'
import { getClient } from 'Redux/api/base'
const JansConfigApi = require('jans_config_api')
import { initAudit } from 'Redux/sagas/SagaUtils'

function* newFunction() {
  const wholeToken = yield select((state) => state.authReducer.token)
  let token = null
  if (wholeToken) {
    token = yield select((state) => state.authReducer.token.access_token)
  }

  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.OAuthUMAResourcesApi(
    getClient(JansConfigApi, token, issuer),
  )

  return new UMAResourceApi(api)
}

export function* getUMAResourcesByClient({ payload }) {
  const audit = yield* initAudit()
  try {
    payload = payload ? payload : {}
    addAdditionalData(audit, FETCH, UMA, payload)
    const openIdApi = yield* newFunction()
    const data = yield call(
      openIdApi.getUMAResources,
      payload.inum,
    )
    yield put(getUMAResourcesByClientResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    console.log(e)
    yield put(getUMAResourcesByClientResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* getUMAResourcesByClientWatcher() {
  yield takeLatest(GET_UMA_RESOURCES, getUMAResourcesByClient)
}

export default function* rootSaga() {
  yield all([
    fork(getUMAResourcesByClientWatcher),
  ])
}
