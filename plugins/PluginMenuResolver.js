import plugins from '../plugins.config'

//get all metadata path
let pluginMenus = [];

export function processMenus() {
    const metadataFilePath = plugins.map((item) => (item.metadataFile))
    metadataFilePath.forEach((path) => {
        pluginMenus = pluginMenus.concat((require(`${path}`)).default.menus)//[...pluginMenus, ...(require(`${path}`)).default.menus]
    })
    console.log(pluginMenus)
    return pluginMenus;
}
export function processRoutes() {
    const metadataFilePath = plugins.map((item) => (item.metadataFile))
    let pluginRoutes = [];
    metadataFilePath.forEach((path) => {
        pluginRoutes = pluginRoutes.concat((require(`${path}`)).default.routes)//[...pluginMenus, ...(require(`${path}`)).default.menus]
    })
    return pluginRoutes;
}

