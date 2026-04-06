import type { Reducer } from '@reduxjs/toolkit'
import plugins from '../plugins.config.json'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'

type PluginReducer = {
  name: string
  reducer: Reducer
}

const process = (): void => {
  const metadataFilePath = plugins.map((item) => item.metadataFile)
  let pluginReducers: PluginReducer[] = []
  metadataFilePath.forEach(async (path) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    pluginReducers = await [...pluginReducers, ...require(`${path}`).default.reducers]

    pluginReducers.forEach((element) => {
      reducerRegistry.register(element.name, element.reducer)
    })
  })
}
export default process
