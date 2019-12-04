package org.gluu.casa.service.settings;

public interface IPluginSettingsHandler<T> {

    void save() throws Exception;

    T getSettings();

    void setSettings(T settings);

}
