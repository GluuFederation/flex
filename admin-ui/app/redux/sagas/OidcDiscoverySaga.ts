import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import { getOidcDiscoveryResponse } from '../actions'
import { isFourZeroThreeError } from 'Utils/TokenController'
import { redirectToLogout } from '../sagas/SagaUtils'
import type { HttpErrorLike } from './types'
import { getProperties } from 'JansConfigApi'
import type { OidcDiscoveryConfig } from 'Redux/types'

export function* getOidcDiscovery() {
  try {
    const raw = (yield call(getProperties)) as Record<string, string | number | boolean | null>
    const data: OidcDiscoveryConfig = Object.fromEntries(
      Object.entries(raw ?? {}).filter(
        (entry): entry is [string, string] => typeof entry[1] === 'string',
      ),
    )
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
