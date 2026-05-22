/**
 * Root Sagas
 */
import { all } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'

// sagas
import authSagas from './AuthSaga'
import initSaga from './InitSaga'
import licenseSaga from './LicenseSaga'
import process from 'Plugins/PluginSagasResolver'
import profileDetails from './ProfileDetailsSaga'
import sessionSaga from './SessionSaga'

export default function* rootSaga() {
  const pluginSagaArr = process()
  const coreSagas = [authSagas(), initSaga(), licenseSaga(), profileDetails(), sessionSaga()]
  yield all([...coreSagas, ...pluginSagaArr] as SagaIterator[])
}
