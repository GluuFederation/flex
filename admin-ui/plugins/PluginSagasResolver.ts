import type { Saga } from 'redux-saga'
import plugins from '../plugins.config.json'
import { loadPluginMetadata } from './internal'

const process = (): Saga[] => {
  let pluginSagas: Saga[] = []
  plugins
    .map((item) => item.metadataFile)
    .forEach((path) => {
      pluginSagas = [...pluginSagas, ...(loadPluginMetadata(path).default?.sagas ?? [])]
    })
  return pluginSagas
}
export default process
