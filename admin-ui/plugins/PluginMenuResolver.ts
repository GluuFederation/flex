import plugins from '../plugins.config.json'
import { loadPluginMetadata, type PluginMenu, type PluginRoute } from './internal'
import { REGEX_PLUGIN_NAME_FROM_PATH } from '@/utils/regex'
import { devLogger } from '@/utils/devLogger'

export const processMenus = async (): Promise<PluginMenu[]> => {
  let pluginMenus: PluginMenu[] = []

  const pluginPromises = plugins.map(async (item) => {
    try {
      const pluginName = item.metadataFile?.match(REGEX_PLUGIN_NAME_FROM_PATH)?.[1]
      if (pluginName) {
        const metadata = await import(`./${pluginName}/plugin-metadata`)
        return (metadata.default?.menus || []) as PluginMenu[]
      }
      const metadata = await import(`${item.metadataFile}`)
      return (metadata.default?.menus || []) as PluginMenu[]
    } catch (error) {
      devLogger.warn(
        `Failed to load plugin menus: ${item.metadataFile}`,
        error instanceof Error ? error : String(error),
      )
      return [] as PluginMenu[]
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

export const processRoutes = async (): Promise<PluginRoute[]> => {
  const pluginRoutes: PluginRoute[] = []

  const pluginPromises = plugins.map(async (item) => {
    try {
      const pluginName = item.metadataFile?.match(REGEX_PLUGIN_NAME_FROM_PATH)?.[1]
      if (pluginName) {
        const metadata = await import(`./${pluginName}/plugin-metadata`)
        return (metadata.default?.routes || []) as PluginRoute[]
      }
      const metadata = await import(`${item.metadataFile}`)
      return (metadata.default?.routes || []) as PluginRoute[]
    } catch (error) {
      devLogger.warn(
        `Failed to load plugin routes: ${item.metadataFile}`,
        error instanceof Error ? error : String(error),
      )
      return [] as PluginRoute[]
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

export const processMenusSync = (): PluginMenu[] => {
  let pluginMenus: PluginMenu[] = []
  plugins.forEach((item) => {
    try {
      pluginMenus.push(...(loadPluginMetadata(item.metadataFile).default?.menus || []))
    } catch (error) {
      devLogger.warn(
        `Failed to load plugin menus: ${item.metadataFile}`,
        error instanceof Error ? error : String(error),
      )
    }
  })
  pluginMenus = sortParentMenu(pluginMenus)
  return pluginMenus
}

export const processRoutesSync = (): PluginRoute[] => {
  const pluginRoutes: PluginRoute[] = []
  plugins.forEach((item) => {
    try {
      pluginRoutes.push(...(loadPluginMetadata(item.metadataFile).default?.routes || []))
    } catch (error) {
      devLogger.warn(
        `Failed to load plugin routes: ${item.metadataFile}`,
        error instanceof Error ? error : String(error),
      )
    }
  })
  return pluginRoutes
}

const sortParentMenu = (menu: PluginMenu[]): PluginMenu[] => {
  menu.sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
  return menu
}
