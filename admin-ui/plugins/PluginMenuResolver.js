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
          `./${pluginName}/plugin-metadata`
        )
        return metadata.default?.menus || []
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
      pluginMenus.push(...result.value)
    }
  })

  pluginMenus = sortParentMenu(pluginMenus)
  return pluginMenus
}

export async function processRoutes() {
  const pluginRoutes = []

  const pluginPromises = plugins.map(async (item) => {
    try {
      const pluginName = item.metadataFile?.match(/\.\/([^/]+)\/plugin-metadata/)?.[1]
      if (pluginName) {
        const metadata = await import(
          /* webpackChunkName: "plugin-[request]" */
          /* webpackMode: "lazy" */
          `./${pluginName}/plugin-metadata`
        )
        return metadata.default?.routes || []
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
      pluginRoutes.push(...result.value)
    }
  })

  return pluginRoutes
}

// Synchronous fallback for backward compatibility
export function processMenusSync() {
  let pluginMenus = []
  plugins.forEach((item) => {
    try {
      pluginMenus.push(...(require(`${item.metadataFile}`).default?.menus || []))
    } catch (error) {
      console.warn(`Failed to load plugin menus: ${item.metadataFile}`, error)
    }
  })
  pluginMenus = sortParentMenu(pluginMenus)
  return pluginMenus
}

export function processRoutesSync() {
  const pluginRoutes = []
  plugins.forEach((item) => {
    try {
      pluginRoutes.push(...(require(`${item.metadataFile}`).default?.routes || []))
    } catch (error) {
      console.warn(`Failed to load plugin routes: ${item.metadataFile}`, error)
    }
  })
  return pluginRoutes
}

const sortParentMenu = (menu) => {
  menu.sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))

  return menu
}
