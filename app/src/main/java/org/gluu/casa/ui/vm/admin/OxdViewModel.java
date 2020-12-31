package org.gluu.casa.ui.vm.admin;

import org.gluu.casa.conf.OxdSettings;
import org.gluu.casa.core.OxdService;
import org.gluu.casa.core.ScopeService;
import org.gluu.casa.core.model.Scope;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.service.IPersistenceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.bind.BindUtils;
import org.zkoss.bind.annotation.*;
import org.zkoss.util.resource.Labels;
import org.zkoss.zk.ui.event.Event;
import org.zkoss.zk.ui.event.Events;
import org.zkoss.zk.ui.select.annotation.WireVariable;
import org.zkoss.zul.Messagebox;

import java.net.URL;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * @author jgomer
 */
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
    
    private String issuerUrl;

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

    @Init
    public void init() {
        issuerUrl = Utils.managedBean(IPersistenceService.class).getIssuerUrl();
        requiredScopes = new HashSet<>(OxdService.REQUIRED_SCOPES);
        reloadConfig();
    }

    private void reloadConfig() {
        oxdSettings = (OxdSettings) Utils.cloneObject(getSettings().getOxdSettings());
        //opHost is lost after cloning due to @JsonIgnore annotation
        oxdSettings.setOpHost(issuerUrl);
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

        //updateSettings call already modifies mainSettings instance (see parent class)
        String msg = oxdService.updateSettings(oxdSettings);
        if (msg == null) {
        	//Persist changes
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
    public void scopeChecked(@BindingParam("checked") boolean checked, @BindingParam("scope") String scope) {
        if (checked) {
            selectedScopes.add(scope);
        } else {
            selectedScopes.remove(scope);
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

    private void computeSelectableScopes() {
        selectableScopes = scopeService.getNonUMAScopes().stream().map(Scope::getId).collect(Collectors.toSet());
        //Remove already checked ones
        selectableScopes.removeAll(oxdSettings.getScopes());
        logger.debug("Selectable scopes are: {}", selectableScopes);
    }

}
