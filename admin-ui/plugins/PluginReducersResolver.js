import plugins from '../plugins.config.json'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'

function process() {
  const metadataFilePath = plugins.map((item) => item.metadataFile)
  let pluginReducers = []
  metadataFilePath.forEach(async (path) => {
    pluginReducers = await [...pluginReducers, ...require(`${path}`).default.reducers]

    pluginReducers.forEach((element) => {
      reducerRegistry.register(element.name, element.reducer)
    })
  })
}
export default process
