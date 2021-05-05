import plugins from '../plugins.config'

//get all metadata path
let pluginMenus = [];

function process() {
    const metadataFilePath = plugins.map((item) => (item.metadataFile))
    metadataFilePath.forEach((path) => {
        console.log(pluginMenus)
        pluginMenus = pluginMenus.concat((require(`${path}`)).default.menus)//[...pluginMenus, ...(require(`${path}`)).default.menus]
        console.log(pluginMenus)
    })
    console.log(pluginMenus)
    return pluginMenus;
}
//process();
export default process;
