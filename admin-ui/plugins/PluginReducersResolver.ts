import plugins from '../plugins.config.json'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { loadPluginMetadata, type PluginReducer } from './internal'

const process = (): void => {
  const seen = new Set<string>()
  for (const { metadataFile } of plugins) {
    const reducers = (loadPluginMetadata(metadataFile).default?.reducers ?? []) as PluginReducer[]
    for (const element of reducers) {
      if (seen.has(element.name)) continue
      seen.add(element.name)
      reducerRegistry.register(element.name, element.reducer)
    }
  }
}
export default process
