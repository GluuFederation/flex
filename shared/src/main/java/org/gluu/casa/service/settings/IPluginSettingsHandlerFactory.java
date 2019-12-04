package org.gluu.casa.service.settings;

public interface IPluginSettingsHandlerFactory {

    //TODO: pluginID is not good to guarantee that plugin X cannot try to access or set data of plugin Y
    //Probably classloader is better, however a dev can still get access to it via the plugin manager, see:
    //https://github.com/pf4j/pf4j/issues/353
    <T> IPluginSettingsHandler<T> getHandler(String pluginID, Class<T> cls);

}
