import { all, call, fork, put, takeLatest, select } from 'redux-saga/effects'
import type { SelectEffect } from 'redux-saga/effects'
import { getOidcDiscoveryResponse } from '../actions'
import { isFourZeroThreeError } from 'Utils/TokenController'
import OidcDiscoveryApi from '../api/OidcDiscoveryApi'
import { getClient } from '../api/base'
import { redirectToLogout } from '../sagas/SagaUtils'
import type { HttpErrorLike } from './types'
import * as JansConfigApi from 'jans_config_api'

function* newFunction(): Generator<SelectEffect, OidcDiscoveryApi, string> {
  const issuer = (yield select(
    (state: { authReducer: { issuer: string } }) => state.authReducer.issuer,
  )) as string
  const api = new JansConfigApi.ConfigurationPropertiesApi(getClient(JansConfigApi, null, issuer))
  return new OidcDiscoveryApi(api)
}

export function* getOidcDiscovery() {
  try {
    const api: OidcDiscoveryApi = yield* newFunction()
    const data = (yield call([api, api.getOidcDiscovery])) as Awaited<
      ReturnType<OidcDiscoveryApi['getOidcDiscovery']>
    >
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
