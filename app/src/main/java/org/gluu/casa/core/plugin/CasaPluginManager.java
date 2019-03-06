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
            extensionsClassNames.forEach(extensionFactory::removeSingleton);
        }
        return state;

    }

    @Override
    public boolean deletePlugin(String pluginId) {

        //On windows, delete is not called but this is not a problem since in practice (production environments)
        //Casa is only used in Linux (See: https://github.com/pf4j/pf4j/issues/217)
        return Utils.onWindows() ? unloadPlugin(pluginId) : super.deletePlugin(pluginId);

    }

}
