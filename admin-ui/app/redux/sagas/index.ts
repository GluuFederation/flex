/**
 * Root Sagas
 */
import { all } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'

// sagas
import healthSaga from './HealthSaga'
import authSagas from './AuthSaga'
import initSaga from './InitSaga'
import licenseSaga from './LicenseSaga'
import oidcDiscoverySaga from './OidcDiscoverySaga'
import process from 'Plugins/PluginSagasResolver'
import profileDetails from './ProfileDetailsSaga'
import lockSaga from './LockSaga'
import sessionSaga from './SessionSaga'

export default function* rootSaga() {
  const pluginSagaArr = process()
  const coreSagas = [
    authSagas(),
    initSaga(),
    licenseSaga(),
    oidcDiscoverySaga(),
    healthSaga(),
    profileDetails(),
    lockSaga(),
    sessionSaga(),
  ]
  yield all([...coreSagas, ...pluginSagaArr] as SagaIterator[])
}
