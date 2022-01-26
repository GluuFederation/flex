import plugins from '../plugins.config'


//get all metadata path

function process() {
    let pluginSagas = [];
    plugins
    .map((item) => (item.metadataFile)).forEach(async (path) => {
        pluginSagas = [...pluginSagas, ...(require(`${path}`)).default.sagas]
    })
    return  pluginSagas;
}
export default process;
