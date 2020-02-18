package org.gluu.casa.plugins.branding;

import org.gluu.casa.misc.Utils;
import org.gluu.casa.service.IBrandingManager;
import org.pf4j.Plugin;
import org.pf4j.PluginWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * The plugin for custom branding Gluu Casa.
 * @author jgomer
 */
public class CustomBrandingPlugin extends Plugin {

    private Logger logger = LoggerFactory.getLogger(getClass());

    public CustomBrandingPlugin(PluginWrapper wrapper) {
        super(wrapper);
    }

    @Override
    public void delete() {

        try {
            Utils.managedBean(IBrandingManager.class).factoryReset();
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

    }

}
