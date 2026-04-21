import plugins from '../plugins.config.json'
import { loadPluginMetadata } from './internal'
import type { CalledSaga } from './internal/types/PluginMetadataTypes'

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
