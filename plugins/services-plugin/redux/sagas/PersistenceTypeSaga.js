import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError } from '../../../../app/utils/TokenController'
import {
  getPersistenceTypeResponse,
} from '../actions/PersistenceActions'
import { getAPIAccessToken } from '../../../../app/redux/actions/AuthActions'
import { GET_PERSISTENCE_TYPE } from '../actions/types'
import PersistenceConfigApi from '../api/PersistenceConfigApi'
import { getClient } from '../../../../app/redux/api/base'
const JansConfigApi = require('jans_config_api')

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.ConfigurationPropertiesApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new PersistenceConfigApi(api)
}

export function* getPersistenceType() {
  try {
    const api = yield* newFunction()
    const data = yield call(api.getPersistenceType)
    console.log('sql saga data: ', data)
    yield put(getPersistenceTypeResponse(data.persistenceType))
  } catch (e) {
    yield put(getPersistenceTypeResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetPersistenceType() {
  yield takeLatest(GET_PERSISTENCE_TYPE, getPersistenceType)
}
export default function* rootSaga() {
  yield all([fork(watchGetPersistenceType)])
}
