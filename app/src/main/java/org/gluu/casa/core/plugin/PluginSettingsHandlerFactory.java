package org.gluu.casa.core.plugin;

import org.gluu.casa.service.settings.IPluginSettingsHandler;
import org.gluu.casa.service.settings.IPluginSettingsHandlerFactory;

import javax.enterprise.context.ApplicationScoped;
import java.util.HashMap;
import java.util.Map;

@ApplicationScoped
public class PluginSettingsHandlerFactory implements IPluginSettingsHandlerFactory {

    private Map<String, IPluginSettingsHandler> registered = new HashMap<>();

    public <T> IPluginSettingsHandler<T> getHandler(String pluginID, Class<T> configClass) {
        registered.computeIfAbsent(pluginID, key -> new PluginSettingsHandler<T>(key, configClass));
        return registered.get(pluginID);
    }

}
