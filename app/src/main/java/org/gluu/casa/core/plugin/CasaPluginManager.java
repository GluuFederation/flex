/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.core.plugin;

import org.gluu.casa.misc.Utils;
import org.pf4j.DefaultPluginManager;
import org.pf4j.ExtensionFactory;
import org.pf4j.Plugin;
import org.pf4j.PluginState;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.reflect.Method;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Stream;

/**
 * @author jgomer
 */
public class CasaPluginManager extends DefaultPluginManager {

    private Logger logger = LoggerFactory.getLogger(getClass());

    private SingletonExtensionFactory extensionFactory = new SingletonExtensionFactory();

    @Override
    protected ExtensionFactory createExtensionFactory() {
        return extensionFactory;
    }

    @Override
    public ExtensionFactory getExtensionFactory() {
        return extensionFactory;
    }

    @Override
    public PluginState stopPlugin(String pluginId) {

        //This call is needed before actual stop takes place, otherwise and empty set is obtained
        Set<String> extensionsClassNames = getExtensionClassNames(pluginId);
        PluginState state = super.stopPlugin(pluginId);
        if (PluginState.STOPPED.equals(state)) {
            extensionsClassNames.forEach(name -> extensionFactory.removeSingleton(name));

        }
        return state;

    }

    @Override
    public boolean deletePlugin(String pluginId) {

        //TODO: remove when fixed
        //See https://github.com/GluuFederation/casa-ee-plugins/issues/6
        Plugin plugin = getPlugin(pluginId).getPlugin();
        Stream.of(plugin.getClass().getDeclaredMethods()).filter(m -> m.getName().equals("delete")).forEach(m -> {
            try {
                logger.info("Calling delete method for plugin {}", pluginId);
                m.invoke(plugin);
            } catch (Exception e) {
                logger.error(e.getMessage(), e);
            }
        });

        //See: https://github.com/pf4j/pf4j/issues/217
        return Utils.onWindows() ? unloadPlugin(pluginId) : super.deletePlugin(pluginId);

    }

}
