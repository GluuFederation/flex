/**
 * Root Sagas
 */
import { all } from 'redux-saga/effects'

// sagas
import healthSaga from './HealthSaga'
import authSagas from './AuthSaga'
import initSaga from './InitSaga'
import licenseSaga from './LicenseSaga'
import oidcDiscoverySaga from './OidcDiscoverySaga'
import process from 'Plugins/PluginSagasResolver'
import attributes from './AttributesSaga'
import profileDetails from './ProfileDetailsSaga'
import lockSaga from './LockSaga'
import sessionSaga from './SessionSaga'
import appInitSaga from './AppInitSaga'

export default function* rootSaga() {
  const pluginSagaArr = process()
  yield all([
    authSagas(),
    initSaga(),
    licenseSaga(),
    oidcDiscoverySaga(),
    healthSaga(),
    attributes(),
    profileDetails(),
    lockSaga(),
    sessionSaga(),
    appInitSaga(),

    ...(pluginSagaArr as unknown[]),
  ] as unknown[])
}
