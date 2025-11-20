/**
 * Root Sagas
 */
import { all } from 'redux-saga/effects'

// sagas
import mauSaga from './MauSaga'
import healthSaga from './HealthSaga'
import authSagas from './AuthSaga'
import initSaga from './InitSaga'
import licenseSaga from './LicenseSaga'
import licenseDetailsSaga from './LicenseDetailsSaga'
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
    mauSaga(),
    healthSaga(),
    licenseDetailsSaga(),
    attributes(),
    profileDetails(),
    lockSaga(),
    sessionSaga(),
    appInitSaga(),

    ...(pluginSagaArr as unknown[]),
  ] as unknown[])
}
