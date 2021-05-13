import plugins from '../plugins.config'


//get all metadata path
let pluginSagas = [];
function process() {
    const metadataFilePath =  plugins.map((item) => (item.metadataFile))
    metadataFilePath.forEach(async (path) => {
        pluginSagas = [...pluginSagas, ...(require(`${path}`)).default.sagas]
    })
    return  pluginSagas;
}
//process();
export default process;
