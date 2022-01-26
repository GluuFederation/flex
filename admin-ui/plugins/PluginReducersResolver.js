import plugins from '../plugins.config'
import reducerRegistry from '../app/redux/reducers/ReducerRegistry'

async function process() {
  const metadataFilePath = plugins
  .map((item) => item.metadataFile)
  let pluginReducers = []
  await metadataFilePath.forEach(async (path) => {
    pluginReducers = await [
      ...pluginReducers,
      ...require(`${path}`).default.reducers,
    ]

    pluginReducers.forEach(async (element) => {
      await reducerRegistry.register(element.name, element.reducer)
    })
  })
}
export default process
