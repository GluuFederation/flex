import plugins from '../plugins.config'

//get all metadata path
let pluginMenus = [];

async function process() {
    const metadataFilePath = await plugins.map((item) => (item.metadataFile))
    
    await metadataFilePath.forEach(async (path) => {
        pluginMenus = await [...pluginMenus, ...(require(`${path}`)).default.menus]
    })
    console.log(pluginMenus)
    return pluginMenus;
}
//process();
export default process;
