package org.gluu.casa.core.plugin;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.gluu.casa.core.ConfigurationHandler;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.service.settings.IPluginSettingsHandler;

import java.util.Map;

public class PluginSettingsHandler<T> implements IPluginSettingsHandler<T> {

    private static ConfigurationHandler configurationHandler = Utils.managedBean(ConfigurationHandler.class);
    private static ObjectMapper mapper = new ObjectMapper();

    private String pluginKey;

    public PluginSettingsHandler(String pluginKey) {
        this.pluginKey = pluginKey;
    }

    public void save() throws Exception {
        configurationHandler.saveSettings();
    }

    public T getSettings() {
        Map<String, Object> map = configurationHandler.getSettings().getPluginSettings().get(pluginKey);
        return map == null ? null : mapper.convertValue(map, new TypeReference<T>(){});
    }

    public void setSettings(T settings) {
        Map<String, Object> map = mapper.convertValue(settings, new TypeReference<Map<String, Object>>(){});
        configurationHandler.getSettings().getPluginSettings().put(pluginKey, map);
    }

}
