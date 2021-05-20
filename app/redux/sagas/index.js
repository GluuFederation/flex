/**
 * Root Sagas
 */
import { all } from 'redux-saga/effects'

// sagas
import authSagas from './AuthSaga'
import attributeSaga from './AttributeSaga'
import fidoSaga from './FidoSaga'
import loggingSaga from './LoggingSaga'
import initSaga from './InitSaga'
import process from '../../../plugins/PluginSagasResolver'

export default function* rootSaga() {
  let pluginSagaArr = process()
  yield all(
    [].concat(
      [authSagas(), attributeSaga(), fidoSaga(), loggingSaga(), initSaga()],
      pluginSagaArr,
    ),
  )
}
