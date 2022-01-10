import plugins from '../plugins.config'
export function processMenus() {
  let pluginMenus = []
  plugins
    .filter(item => item.enabled)
    .map((item) => item.metadataFile)
    .forEach((path) => {
      pluginMenus = pluginMenus.concat(require(`${path}`).default.menus)
    })

  pluginMenus = sortMenu(pluginMenus)

  return pluginMenus
}
export function processRoutes() {
  let pluginRoutes = []
  plugins
    .filter(item => item.enabled)
    .map((item) => item.metadataFile)
    .forEach((path) => {
      pluginRoutes = pluginRoutes.concat(require(`${path}`).default.routes)
    })
  return pluginRoutes
}

const sortMenu = (menu) => {
  menu = sortParentMenu(menu)
  return menu
}

const sortParentMenu = (menu) => {
  menu.sort((a, b) => {
    var titleA = a.title.toUpperCase()
    var titleB = b.title.toUpperCase()
    if (titleA < titleB) {
      return -1
    }
    if (titleA > titleB) {
      return 1
    }
    return 0
  })

  return menu
}
