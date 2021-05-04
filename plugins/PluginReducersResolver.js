import plugins from '../plugins.config'
import reducerRegistry from '../app/redux/reducers/ReducerRegistry'

async function process() {
    const metadataFilePath = await plugins.map((item) => (item.metadataFile))
    let pluginReducers = [];
    await metadataFilePath.forEach(async (path) => {
        pluginReducers = await [...pluginReducers, ...(require(`${path}`)).default.reducers]
    })
    console.log(pluginReducers)
    pluginReducers.forEach(async (element) => {
        await reducerRegistry.register(element.name, element.reducer);
    })

    //return await pluginReducers;
}
//process();
export default process;
