import plugins from '../plugins.config.json'
export function processMenus() {
  let pluginMenus = []
  plugins
    .map(item => item.metadataFile)
    .forEach(path => {
      pluginMenus = pluginMenus.concat(require(`${path}`).default.menus)
    })

  pluginMenus = sortMenu(pluginMenus)

  return pluginMenus
}
export function processRoutes() {
  let pluginRoutes = []
  plugins
    .map(item => item.metadataFile)
    .forEach(path => {
      pluginRoutes = pluginRoutes.concat(require(`${path}`).default.routes)
    })
  return pluginRoutes
}

const sortMenu = menu => {
  menu = sortParentMenu(menu)
  return menu
}

const sortParentMenu = menu => {
  menu.sort((a, b) => a?.order - b?.order)

  return menu
}
