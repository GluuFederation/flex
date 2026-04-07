import plugins from '../plugins.config.json'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { loadPluginMetadata, type PluginReducer } from './internal'

const process = (): void => {
  const metadataFilePath = plugins.map((item) => item.metadataFile)
  let pluginReducers: PluginReducer[] = []
  metadataFilePath.forEach(async (path) => {
    pluginReducers = await [
      ...pluginReducers,
      ...(loadPluginMetadata(path).default?.reducers ?? []),
    ]

    pluginReducers.forEach((element) => {
      reducerRegistry.register(element.name, element.reducer)
    })
  })
}
export default process
