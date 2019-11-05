package org.gluu.casa.ui.vm.admin;

import org.gluu.casa.conf.OxdSettings;
import org.gluu.casa.core.OxdService;
import org.gluu.casa.core.ScopeService;
import org.gluu.casa.core.model.Scope;
import org.gluu.casa.misc.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.bind.BindUtils;
import org.zkoss.bind.annotation.*;
import org.zkoss.util.resource.Labels;
import org.zkoss.zk.ui.event.Event;
import org.zkoss.zk.ui.event.Events;
import org.zkoss.zk.ui.select.annotation.VariableResolver;
import org.zkoss.zk.ui.select.annotation.WireVariable;
import org.zkoss.zkplus.cdi.DelegatingVariableResolver;
import org.zkoss.zul.Checkbox;
import org.zkoss.zul.Messagebox;

import java.net.URL;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * @author jgomer
 */
@VariableResolver(DelegatingVariableResolver.class)
public class OxdViewModel extends MainViewModel {

    private Logger logger = LoggerFactory.getLogger(getClass());

    @WireVariable
    private OxdService oxdService;

    @WireVariable
    private ScopeService scopeService;

    private OxdSettings oxdSettings;

    private boolean uiEditingScopes;

    private Set<String> selectableScopes;

    private Set<String> selectedScopes;

    private Set<String> requiredScopes;

    public OxdSettings getOxdSettings() {
        return oxdSettings;
    }

    public boolean isUiEditingScopes() {
        return uiEditingScopes;
    }

    public Set<String> getSelectableScopes() {
        return selectableScopes;
    }

    @Immutable
    public Set<String> getRequiredScopes() {
        return requiredScopes;
    }

    @Init//(superclass = true)
    public void init() {
        reloadConfig();
        requiredScopes = new HashSet<>(OxdService.REQUIRED_SCOPES);
    }

    private void reloadConfig() {
        oxdSettings = (OxdSettings) Utils.cloneObject(getSettings().getOxdSettings(true));
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
                connected = Utils.urlAvailabilityCheck(new URL("https", oxdHost, oxdPort, "/health-check"));
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

    @NotifyChange("oxdSettings")
    @Command
    public void dropScope(@BindingParam("id") String scope) {
        oxdSettings.getScopes().remove(scope);
        logger.debug("New scope list is {}", oxdSettings.getScopes());
    }

    @NotifyChange({"uiEditingScopes", "selectableScopes"})
    @Command
    public void preAddScopes() {
        uiEditingScopes = true;
        computeSelectableScopes();
        selectedScopes = new HashSet<>();
    }

    @Command
    public void scopedChecked(@BindingParam("target") Checkbox box, @BindingParam("scope") String scope) {
        if (box.isChecked()) {
            selectedScopes.add(scope);
        }
    }

    @NotifyChange("uiEditingScopes")
    @Command
    public void cancelAddScopes(@BindingParam("event") Event event) {
        uiEditingScopes = false;
        if (event != null && event.getName().equals(Events.ON_CLOSE)) {
            event.stopPropagation();
        }
    }

    @NotifyChange({"uiEditingScopes", "oxdSettings"})
    @Command
    public void addScopes() {
        uiEditingScopes = false;
        oxdSettings.getScopes().addAll(selectedScopes);
    }

    private String updateOxdSettings(OxdSettings lastWorkingConfig) {

        String msg = null;
        //Triger a new registration only if host/port changed, otherwise call update site operation
        if (lastWorkingConfig.getHost().equalsIgnoreCase(oxdSettings.getHost()) && lastWorkingConfig.getPort() == oxdSettings.getPort()) {

            try {
                //TODO: oxd-4.0 will allow several post-logout uris: https://github.com/GluuFederation/oxd/issues/217
                //This way instead of replacing the postlogout I might just add it, thus, when logging out oxauth will not give error
                //When a new client is created (see else branch), the error at logout cannot be avoided
                if (!oxdService.updateSite(oxdSettings.getPostLogoutUri(), oxdSettings.getScopes())) {
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

    private void computeSelectableScopes() {
        selectableScopes = scopeService.getNonUMAScopes().stream().map(Scope::getId).collect(Collectors.toSet());
        //Remove already checked ones
        selectableScopes.removeAll(oxdSettings.getScopes());
        logger.debug("Selectable scopes are: {}",selectableScopes);
    }

}
