import plugins from '../plugins.config'


//get all metadata path
let pluginSagas = [];
function process() {
    plugins.map((item) => (item.metadataFile)).forEach(async (path) => {
        pluginSagas = [...pluginSagas, ...(require(`${path}`)).default.sagas]
    })
    return  pluginSagas;
}
export default process;
