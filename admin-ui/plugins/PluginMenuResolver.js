import plugins from '../plugins.config.json'

// Dynamic plugin loading with code splitting
export async function processMenus() {
  let pluginMenus = []

  const pluginPromises = plugins.map(async (item) => {
    try {
      const pluginName = item.metadataFile?.match(/\.\/([^/]+)\/plugin-metadata/)?.[1]
      if (pluginName) {
        const metadata = await import(
          /* webpackChunkName: "plugin-[request]" */
          /* webpackMode: "lazy" */
          /* webpackExclude: /\.test\.(js|jsx|ts|tsx)$/ */
          `./${pluginName}/plugin-metadata`
        )
        return metadata.default.menus || []
      }
      // Fallback if path doesn't match expected pattern
      const metadata = await import(/* webpackIgnore: true */ `${item.metadataFile}`)
      return metadata.default?.menus || []
    } catch (error) {
      console.warn(`Failed to load plugin menus: ${item.metadataFile}`, error)
      return []
    }
  })

  const results = await Promise.allSettled(pluginPromises)
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      pluginMenus = pluginMenus.concat(result.value)
    }
  })

  pluginMenus = sortMenu(pluginMenus)
  return pluginMenus
}

export async function processRoutes() {
  let pluginRoutes = []

  const pluginPromises = plugins.map(async (item) => {
    try {
      const pluginName = item.metadataFile?.match(/\.\/([^/]+)\/plugin-metadata/)?.[1]
      if (pluginName) {
        const metadata = await import(
          /* webpackChunkName: "plugin-[request]" */
          /* webpackMode: "lazy" */
          /* webpackExclude: /\.test\.(js|jsx|ts|tsx)$/ */
          `./${pluginName}/plugin-metadata`
        )
        return metadata.default.routes || []
      }
      const metadata = await import(/* webpackIgnore: true */ `${item.metadataFile}`)
      return metadata.default?.routes || []
    } catch (error) {
      console.warn(`Failed to load plugin routes: ${item.metadataFile}`, error)
      return []
    }
  })

  const results = await Promise.allSettled(pluginPromises)
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      pluginRoutes = pluginRoutes.concat(result.value)
    }
  })

  return pluginRoutes
}

const sortMenu = (menu) => {
  menu = sortParentMenu(menu)
  return menu
}

const sortParentMenu = (menu) => {
  menu.sort((a, b) => a?.order - b?.order)

  return menu
}
