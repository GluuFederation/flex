import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import {
  getAttributesResponseRoot
} from '../actions/AttributesActions'
import { getAPIAccessToken } from 'Redux/actions/AuthActions'
import { postUserAction } from 'Redux/api/backend-api'
import {
  GET_ATTRIBUTES_FOR_USER_MANAGEMENT,
} from '../actions/types'
import {
  FETCH,
} from '../../audit/UserActionType'
// } from '../../../../app/audit/UserActionType'
import AttributeApi from '../api/AttributeApi'
import { getClient } from 'Redux/api/base'
import { initAudit } from 'Redux/sagas/SagaUtils'

const PERSON_SCHEMA = 'person schema'

const JansConfigApi = require('jans_config_api')

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.AttributeApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new AttributeApi(api)
}

export function* getAttributesRoot({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, PERSON_SCHEMA, payload)
    const attributeApi = yield* newFunction()
    const data = yield call(attributeApi.getAllAttributes, payload.options)
    yield put(getAttributesResponseRoot(data))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(getAttributesResponseRoot([]))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetAttributesRoot() {
  yield takeLatest(GET_ATTRIBUTES_FOR_USER_MANAGEMENT, getAttributesRoot)
}

export default function* rootSaga() {
  yield all([
    fork(watchGetAttributesRoot),
  ])
}
