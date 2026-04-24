import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import { getOidcDiscoveryResponse } from '../actions'
import { isFourZeroThreeError } from 'Utils/TokenController'
import { redirectToLogout } from '../sagas/SagaUtils'
import type { HttpErrorLike } from './types'
import { getProperties } from 'JansConfigApi'
import type { OidcDiscoveryConfig } from 'Redux/types'

export function* getOidcDiscovery() {
  try {
    const data = (yield call(getProperties)) as OidcDiscoveryConfig
    yield put(getOidcDiscoveryResponse({ configuration: data }))
  } catch (e) {
    yield put(getOidcDiscoveryResponse({ configuration: null }))
    if (isFourZeroThreeError(e as HttpErrorLike)) {
      yield* redirectToLogout()
      return
    }
  }
}

export function* watchGetFidoConfig() {
  yield takeLatest('oidcDiscovery/getOidcDiscovery', getOidcDiscovery)
}

export default function* rootSaga() {
  yield all([fork(watchGetFidoConfig)])
}
