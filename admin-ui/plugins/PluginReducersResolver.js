import plugins from '../plugins.config.json'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'

async function process() {
  const metadataFilePath = plugins.map((item) => item.metadataFile)
  let pluginReducers = []

  for (const path of metadataFilePath) {
    const pluginName = path?.match(/\.\/([^/]+)\/plugin-metadata/)?.[1]
    if (pluginName) {
      const metadata = await import(
        /* webpackChunkName: "plugin-[request]" */
        /* webpackMode: "lazy" */
        /* webpackExclude: /\.test\.(js|jsx|ts|tsx)$/ */
        `./${pluginName}/plugin-metadata`
      )
      const reducers = metadata.default.reducers || []
      pluginReducers = [...pluginReducers, ...reducers]

      reducers.forEach((element) => {
        reducerRegistry.register(element.name, element.reducer)
      })
    }
  }
}
export default process
