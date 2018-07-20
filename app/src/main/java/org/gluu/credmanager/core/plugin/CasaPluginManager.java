/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.credmanager.core.plugin;

import org.pf4j.DefaultPluginManager;
import org.pf4j.ExtensionFactory;
import org.pf4j.PluginState;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Set;

/**
 * @author jgomer
 */
public class CasaPluginManager extends DefaultPluginManager {

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

        Set<String> extensionsClassNames = super.getExtensionClassNames(pluginId);
        PluginState state = super.stopPlugin(pluginId);
        if (PluginState.STOPPED.equals(state)) {
            extensionsClassNames.forEach(name -> extensionFactory.removeSingleton(name));
        }
        return state;

    }

}
