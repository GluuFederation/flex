import { all } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import initSaga from './InitSaga'
import process from 'Plugins/PluginSagasResolver'

export default function* rootSaga() {
  const pluginSagaArr = process()
  const coreSagas = [initSaga()]
  yield all([...coreSagas, ...pluginSagaArr] as SagaIterator[])
}
