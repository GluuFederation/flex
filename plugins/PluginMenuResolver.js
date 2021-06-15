import plugins from '../plugins.config'

//get all metadata path

export function processMenus() {
  let pluginMenus = []
  plugins
    .map((item) => item.metadataFile)
    .forEach((path) => {
      pluginMenus = pluginMenus.concat(require(`${path}`).default.menus)
    })

    pluginMenus= sortMenu(pluginMenus)

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

const sortMenu= (menu) => {
  menu= sortParentMenu(menu)
  menu= sortChildMenu(menu)

  return menu
}

const sortParentMenu= (menu) => {

  menu.sort( (a, b) => {
    var titleA = a.title.toUpperCase();
    var titleB = b.title.toUpperCase();
    if (titleA < titleB) {
      return -1;
    }
    if (titleA > titleB) {
      return 1;
    }
    return 0;
  });

  return menu

}

const sortChildMenu= (menu) => {
  
  menu.map( item => {
    if(item.children){
      item.children= sortParentMenu(item.children)
    }
    item.children.map( subItem => {
      if(subItem.children){
        subItem.children= sortParentMenu(subItem.children)
      }
    })
  })

  return menu
}
