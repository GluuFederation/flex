/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.ui.vm.admin;

import org.gluu.casa.conf.OxdSettings;
import org.gluu.casa.core.OxdService;
import org.gluu.casa.misc.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.bind.BindUtils;
import org.zkoss.bind.annotation.BindingParam;
import org.zkoss.bind.annotation.Command;
import org.zkoss.bind.annotation.Init;
import org.zkoss.bind.annotation.NotifyChange;
import org.zkoss.util.resource.Labels;
import org.zkoss.zk.ui.select.annotation.VariableResolver;
import org.zkoss.zk.ui.select.annotation.WireVariable;
import org.zkoss.zkplus.cdi.DelegatingVariableResolver;
import org.zkoss.zul.Messagebox;

import java.net.InetSocketAddress;
import java.util.stream.Stream;

/**
 * @author jgomer
 */
@VariableResolver(DelegatingVariableResolver.class)
public class OxdViewModel extends MainViewModel {

    private Logger logger = LoggerFactory.getLogger(getClass());

    @WireVariable
    private OxdService oxdService;

    private OxdSettings oxdSettings;

    public OxdSettings getOxdSettings() {
        return oxdSettings;
    }

    @Init//(superclass = true)
    public void init() {
        reloadConfig();
    }

    private void reloadConfig() {
        oxdSettings = (OxdSettings) Utils.cloneObject(getSettings().getOxdSettings());
    }

   

    @NotifyChange("oxdSettings")
    @Command
    public void saveOxdSettings() {

        int oxdPort = oxdSettings.getPort();
        String oxdHost = oxdSettings.getHost();
        String postlogoutUrl = Utils.isValidUrl(oxdSettings.getPostLogoutUri()) ? oxdSettings.getPostLogoutUri() : null;

        if (Stream.of(oxdHost, postlogoutUrl).allMatch(Utils::isNotEmpty) && oxdPort > 0 && oxdPort < 65536) {

            boolean connected = false;    //Try to guess if it looks like an oxd-server
            try {
                oxdHost = oxdHost.trim();
               
                    connected = Utils.hostAvailabilityCheck(oxdHost, oxdPort);
               
            } catch (Exception e) {
                logger.error(e.getMessage(), e);
            }
            if (!connected) {
                Messagebox.show(Labels.getLabel("adm.oxd_no_connection"), null, Messagebox.YES | Messagebox.NO, Messagebox.QUESTION,
                        event -> {
                            if (Messagebox.ON_YES.equals(event.getName())) {
                                processUpdate();
                            } else {
                                reloadConfig();
                            }
                            BindUtils.postNotifyChange(null, null, OxdViewModel.this, "oxdSettings");
                        }
                );
            } else {
                processUpdate();
            }
        } else {
            Messagebox.show(Labels.getLabel("adm.oxd_no_settings"), null, Messagebox.OK, Messagebox.INFORMATION);
        }

    }

    @NotifyChange("oxdSettings")
    @Command
    public void cancel() {
        reloadConfig();
    }

    private void processUpdate() {

        OxdSettings lastWorkingConfig = getSettings().getOxdSettings();
        String msg = updateOxdSettings(lastWorkingConfig);
        if (msg == null) {
            getSettings().setOxdSettings(oxdSettings);
            updateMainSettings();
        } else {
            reloadConfig();
            msg = Labels.getLabel("general.error.detailed", new String[] { msg });
            Messagebox.show(msg, null, Messagebox.OK, Messagebox.EXCLAMATION);
        }

    }

    private String updateOxdSettings(OxdSettings lastWorkingConfig) {

        String msg = null;
        //Triger a new registration only if host/port changed, otherwise call update site operation
        if (lastWorkingConfig.getHost().equalsIgnoreCase(oxdSettings.getHost()) && lastWorkingConfig.getPort() == oxdSettings.getPort()) {

            try {
                //TODO: oxd-4.0 will allow several post-logout uris: https://github.com/GluuFederation/oxd/issues/217
                //This way instead of replacing the postlogout I might just add it, thus, when logging out oxauth will not give error
                //When a new client is created (see else branch), the error at logout cannot be avoided
                if (!oxdService.updateSite(oxdSettings.getPostLogoutUri())) {
                    msg = Labels.getLabel("adm.oxd_site_update_failure");
                }
            } catch (Exception e) {
                msg = e.getMessage();
                logger.error(msg, e);
            }
        } else {

            try {
                //A new registration is made when pointing to a different oxd installation because the current oxd-id won't exist there
                oxdService.setSettings(oxdSettings, true);

                //remove unneeded client
                oxdService.removeSite(lastWorkingConfig.getClient().getOxdId());
            } catch (Exception e) {
                msg = e.getMessage();
                try {
                    logger.warn("Reverting to previous working OXD settings");
                    //Revert to last working settings
                    oxdService.setSettings(lastWorkingConfig, false);
                } catch (Exception e1) {
                    msg += "\n" + Labels.getLabel("admin.error_reverting");
                    logger.error(e1.getMessage(), e1);
                }
            }
        }
        return msg;

    }

}
