import plugins from '../plugins.config.json'

//get all metadata path

async function process() {
  let pluginSagas = []

  const pluginPromises = plugins.map(async (item) => {
    const path = item.metadataFile
    const pluginName = path?.match(/\.\/([^/]+)\/plugin-metadata/)?.[1]
    if (pluginName) {
      const metadata = await import(
        /* webpackChunkName: "plugin-[request]" */
        /* webpackMode: "lazy" */
        /* webpackExclude: /\.test\.(js|jsx|ts|tsx)$/ */
        `./${pluginName}/plugin-metadata`
      )
      return metadata.default.sagas || []
    }
    return []
  })

  const results = await Promise.allSettled(pluginPromises)
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      pluginSagas = [...pluginSagas, ...result.value]
    }
  })

  return pluginSagas
}
export default process
