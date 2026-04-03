import type { Saga } from 'redux-saga'
import plugins from '../plugins.config.json'

const process = (): Saga[] => {
  let pluginSagas: Saga[] = []
  plugins
    .map((item) => item.metadataFile)
    .forEach((path) => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      pluginSagas = [...pluginSagas, ...require(`${path}`).default.sagas]
    })
  return pluginSagas
}
export default process
