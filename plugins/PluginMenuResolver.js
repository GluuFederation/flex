import plugins from '../plugins.config'

//get all metadata path

export function processMenus() {
  let pluginMenus = []
  plugins
    .map((item) => item.metadataFile)
    .forEach((path) => {
      pluginMenus = pluginMenus.concat(require(`${path}`).default.menus)
    })
  return pluginMenus
}
export function processRoutes() {
  let pluginRoutes = []
  plugins
    .map((item) => item.metadataFile)
    .forEach((path) => {
      pluginRoutes = pluginRoutes.concat(require(`${path}`).default.routes)
    })
  return pluginRoutes
}
