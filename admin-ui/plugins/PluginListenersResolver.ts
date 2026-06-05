import plugins from '../plugins.config.json'
import { loadPluginMetadata } from './internal'
import type { AppStartListening } from '@/redux/listeners'

const process = (startListening: AppStartListening): void => {
  plugins
    .map((item) => item.metadataFile)
    .forEach((path) => {
      const setups = loadPluginMetadata(path).default?.listeners ?? []
      setups.forEach((setup) => setup(startListening))
    })
}
export default process
