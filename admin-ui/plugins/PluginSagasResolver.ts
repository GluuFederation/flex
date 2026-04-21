import type { Saga } from 'redux-saga'
import plugins from '../plugins.config.json'
import { loadPluginMetadata } from './internal'

type CalledSaga = ReturnType<Saga>

const process = (): CalledSaga[] => {
  let pluginSagas: CalledSaga[] = []
  plugins
    .map((item) => item.metadataFile)
    .forEach((path) => {
      pluginSagas = [...pluginSagas, ...(loadPluginMetadata(path).default?.sagas ?? [])]
    })
  return pluginSagas
}
export default process
