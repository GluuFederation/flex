package org.gluu.casa.plugins.strongauthn;

import org.gluu.casa.core.ITrackable;
import org.gluu.casa.misc.Utils;
import org.pf4j.Plugin;
import org.pf4j.PluginWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.reflect.Method;
import java.util.Collections;
import java.util.stream.Stream;

/**
 * A plugin for handling second factor authentication settings for administrators and users.
 * @author jgomer
 */
public class StrongAuthnSettingsPlugin extends Plugin implements ITrackable {

    public StrongAuthnSettingsPlugin(PluginWrapper wrapper) {
        super(wrapper);
    }

    @Override
    public void delete() {

        //This impl is a extreme hack... there was no other feasible way though. This plugin offers features orthogonal
        //to core Casa so there is no way to refactor the core without exposing many vital classes that must not be
        //publicly accessible (eg. in casa-shared module). Unfortunately it generates a coupling with ConfigurationHandler
        //and MainSettings classes.
        //This method helps prevent cheating (e.g. installing the plugin once to configure 2FA settings and then remove it
        //(not paying $$$ more) and still enjoy the benefits of the configuration)
        Logger logger = LoggerFactory.getLogger(getClass());
        try {
            Class<?> clazz = Class.forName("org.gluu.casa.core.ConfigurationHandler");
            Object confHandler = Utils.managedBean(clazz);
            Method method = getAMethod("getSettings", clazz);
            Object settings = method.invoke(confHandler);

            logger.info("MainSettings obtained");
            clazz = settings.getClass();
            logger.info("Reverting 2FA settings to factory settings");

            method = getAMethod("setMinCredsFor2FA", clazz);
            method.invoke(settings, 2);

            method = getAMethod("setTrustedDevicesSettings", clazz);
            method.invoke(settings, new Object[]{null});

            Class<?> epcls = Class.forName("org.gluu.casa.conf.sndfactor.EnforcementPolicy");
            Object epclsInstance = epcls.cast(getAMethod("valueOf", epcls).invoke(epcls,"EVERY_LOGIN"));

            method = getAMethod("setEnforcement2FA", clazz);
            method.invoke(settings, Collections.singletonList(epclsInstance));

            method = getAMethod("saveSettings", confHandler.getClass());
            method.invoke(confHandler);

            logger.info("Done");
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
    }

    private Method getAMethod(String name, Class<?> clazz) {
        return Stream.of(clazz.getMethods()).filter(m -> m.getName().equals(name)).findFirst().orElse(null);
    }

}
