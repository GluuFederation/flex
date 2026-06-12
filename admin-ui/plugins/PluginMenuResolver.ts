import plugins from '../plugins.config.json'
import {
  loadPluginMetadata,
  loadPluginMetadataAsync,
  type PluginMenu,
  type PluginRoute,
} from './internal'
import { logger } from '@/utils/logger'

export const processMenus = async (): Promise<PluginMenu[]> => {
  let pluginMenus: PluginMenu[] = []

  const pluginPromises = plugins.map(async (item) => {
    try {
      const metadata = await loadPluginMetadataAsync(item.metadataFile)
      return (metadata.default?.menus || []) as PluginMenu[]
    } catch (error) {
      logger(
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
      const metadata = await loadPluginMetadataAsync(item.metadataFile)
      return (metadata.default?.routes || []) as PluginRoute[]
    } catch (error) {
      logger(
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

export const processRoutesSync = (): PluginRoute[] => {
  const pluginRoutes: PluginRoute[] = []
  plugins.forEach((item) => {
    try {
      pluginRoutes.push(...(loadPluginMetadata(item.metadataFile).default?.routes || []))
    } catch (error) {
      logger(
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
