import plugins from '../plugins.config'

//get all metadata path
let pluginMenus = []
let pluginRoutes = []

export function processMenus() {
  plugins
    .map((item) => item.metadataFile)
    .forEach((path) => {
      pluginMenus = pluginMenus.concat(require(`${path}`).default.menus)
    })
  return pluginMenus
}
export function processRoutes() {
  plugins
    .map((item) => item.metadataFile)
    .forEach((path) => {
      pluginRoutes = pluginRoutes.concat(require(`${path}`).default.routes)
    })
  return pluginRoutes
}
