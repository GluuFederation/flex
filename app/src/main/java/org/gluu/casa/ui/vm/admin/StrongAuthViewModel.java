package org.gluu.casa.ui.vm.admin;

import org.gluu.casa.conf.MainSettings;
import org.gluu.casa.conf.TrustedDevicesSettings;
import org.gluu.casa.conf.sndfactor.EnforcementPolicy;
import org.gluu.casa.timer.TrustedDevicesSweeper;
import org.gluu.casa.ui.UIUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.bind.BindUtils;
import org.zkoss.bind.annotation.BindingParam;
import org.zkoss.bind.annotation.Command;
import org.zkoss.bind.annotation.Init;
import org.zkoss.bind.annotation.NotifyChange;
import org.zkoss.util.resource.Labels;
import org.zkoss.zk.ui.event.Event;
import org.zkoss.zk.ui.select.annotation.VariableResolver;
import org.zkoss.zk.ui.select.annotation.WireVariable;
import org.zkoss.zkplus.cdi.DelegatingVariableResolver;
import org.zkoss.zul.Checkbox;
import org.zkoss.zul.Messagebox;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.gluu.casa.conf.sndfactor.EnforcementPolicy.CUSTOM;
import static org.gluu.casa.conf.sndfactor.EnforcementPolicy.EVERY_LOGIN;
import static org.gluu.casa.conf.sndfactor.EnforcementPolicy.LOCATION_UNKNOWN;
import static org.gluu.casa.conf.sndfactor.EnforcementPolicy.DEVICE_UNKNOWN;
import static org.gluu.casa.core.ConfigurationHandler.BOUNDS_MINCREDS_2FA;

/**
 * @author jgomer
 */
@VariableResolver(DelegatingVariableResolver.class)
public class StrongAuthViewModel extends MainViewModel {

    private Logger logger = LoggerFactory.getLogger(getClass());

    @WireVariable
    private TrustedDevicesSweeper trustedDevicesSweeper;

    private MainSettings settings;
    private int minCreds2FA;
    private List<Integer> minCredsList;
    private Set<String> enforcementPolicies;
    private int locationExpiration;
    private int deviceExpiration;

    public int getLocationExpiration() {
        return locationExpiration;
    }

    public int getDeviceExpiration() {
        return deviceExpiration;
    }

    public List<Integer> getMinCredsList() {
        return minCredsList;
    }

    public int getMinCreds2FA() {
        return minCreds2FA;
    }

    public Set<String> getEnforcementPolicies() {
        return enforcementPolicies;
    }

    public void setLocationExpiration(int locationExpiration) {
        this.locationExpiration = locationExpiration;
    }

    public void setDeviceExpiration(int deviceExpiration) {
        this.deviceExpiration = deviceExpiration;
    }

    @Init
    public void init() {
        logger.debug("Initializing ViewModel");
        settings = getSettings();
        reloadConfig();
    }

    @NotifyChange({"enforcementPolicies", "deviceExpiration", "locationExpiration"})
    @Command
    public void checkPolicy(@BindingParam("evt") Event event) {

        Checkbox box = (Checkbox) event.getTarget();
        String policy = box.getId();

        logger.trace("Policy '{}' {}", policy, box.isChecked() ? "checked" : "unchecked");
        if (box.isChecked()) {
            enforcementPolicies.add(policy);
        } else {
            enforcementPolicies.remove(policy);
            //Revert the numbers, this helps prevent entering negative numbers, then deselecting an option, and then saving
            if (LOCATION_UNKNOWN.toString().equals(policy) || CUSTOM.toString().equals(policy)) {
                deviceExpiration = trustedDevicesSweeper.getDeviceExpirationDays();
            }
            if (DEVICE_UNKNOWN.toString().equals(policy) || CUSTOM.toString().equals(policy)) {
                locationExpiration = trustedDevicesSweeper.getLocationExpirationDays();
            }
        }
        if (enforcementPolicies.contains(EVERY_LOGIN.toString())) {
            enforcementPolicies = Stream.of(EVERY_LOGIN.toString()).collect(Collectors.toSet());
        } else if (enforcementPolicies.contains(CUSTOM.toString())) {
            enforcementPolicies = Stream.of(CUSTOM.toString()).collect(Collectors.toSet());
        }
        logger.trace("Newer enforcement policies: {}", enforcementPolicies.toString());

    }

    @Command
    public void change2FASettings(@BindingParam("val") Integer val) {

        val += BOUNDS_MINCREDS_2FA.getX();

        if (val == 1) {     //only one sucks
            promptBefore2FAProceed(Labels.getLabel("adm.strongauth_warning_one"), val);
        } else if (val > minCreds2FA) {   //maybe problematic...
            promptBefore2FAProceed(Labels.getLabel("adm.strongauth_warning_up", new Integer[]{ minCreds2FA }), val);
        } else {
            processUpdate(val);
        }

    }

    private void reloadConfig() {

        locationExpiration = trustedDevicesSweeper.getLocationExpirationDays();
        deviceExpiration = trustedDevicesSweeper.getDeviceExpirationDays();

        minCreds2FA = settings.getMinCredsFor2FA();
        enforcementPolicies = settings.getEnforcement2FA().stream().map(EnforcementPolicy::toString).collect(Collectors.toSet());
        logger.trace("Minimum creds for 2FA: {}", minCreds2FA);
        logger.trace("Current enforcement policies: {}", enforcementPolicies.toString());

        if (minCredsList == null) {
            minCredsList = new ArrayList<>();
            for (int i = BOUNDS_MINCREDS_2FA.getX(); i <= BOUNDS_MINCREDS_2FA.getY(); i++) {
                minCredsList.add(i);
            }
        }

    }

    private void promptBefore2FAProceed(String message, int newval) {

        Messagebox.show(message, null, Messagebox.YES | Messagebox.NO, Messagebox.EXCLAMATION,
                event -> {
                    if (Messagebox.ON_YES.equals(event.getName())) {
                        processUpdate(newval);
                    } else {  //Revert to last known working (or accepted)
                        reloadConfig();
                        BindUtils.postNotifyChange(null, null, StrongAuthViewModel.this, "minCreds2FA");
                        BindUtils.postNotifyChange(null, null, StrongAuthViewModel.this, "enforcementPolicies");
                    }
                }
        );

    }

    private void processUpdate(int newval) {

        if (locationExpiration > 0 && deviceExpiration > 0) {
            logger.trace("Updating settings");
            update2FASettings(newval, enforcementPolicies.stream().map(EnforcementPolicy::valueOf).collect(Collectors.toList()));
            reloadConfig();
        } else {
            UIUtils.showMessageUI(false, Labels.getLabel("adm.strongauth_exp_invalid"));
        }

    }

    private void update2FASettings(int minCreds, List<EnforcementPolicy> policies) {

        TrustedDevicesSettings tsettings = new TrustedDevicesSettings();
        tsettings.setDeviceExpirationDays(deviceExpiration);
        tsettings.setLocationExpirationDays(locationExpiration);

        settings.setTrustedDevicesSettings(tsettings);
        settings.setMinCredsFor2FA(minCreds);
        settings.setEnforcement2FA(policies);

        if (updateMainSettings(Labels.getLabel("adm.methods_change_success"))) {
            logger.info("Changed minimum number of enrolled credentials for 2FA usage to {}", minCreds);
            logger.info("Changed 2FA enforcement policy to {}", policies.toString());
            logger.trace("Refreshing devices sweeper timer job settings");
            trustedDevicesSweeper.setup();
        }

    }

}
