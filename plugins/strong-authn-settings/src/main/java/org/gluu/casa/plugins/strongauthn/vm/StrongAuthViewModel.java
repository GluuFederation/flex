package org.gluu.casa.plugins.strongauthn.vm;

import org.gluu.casa.plugins.strongauthn.conf.TrustedDevicesSettings;
import org.gluu.casa.plugins.strongauthn.conf.Configuration;
import org.gluu.casa.plugins.strongauthn.conf.EnforcementPolicy;
import org.gluu.casa.plugins.strongauthn.service.StrongAuthSettingsService;
import org.gluu.casa.service.settings.IPluginSettingsHandler;
import org.gluu.casa.ui.UIUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.bind.BindUtils;
import org.zkoss.bind.annotation.BindingParam;
import org.zkoss.bind.annotation.Command;
import org.zkoss.bind.annotation.Init;
import org.zkoss.bind.annotation.NotifyChange;
import org.zkoss.util.Pair;
import org.zkoss.util.resource.Labels;
import org.zkoss.zul.Checkbox;
import org.zkoss.zul.Messagebox;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.gluu.casa.plugins.strongauthn.StrongAuthnSettingsPlugin.*;
import static org.gluu.casa.plugins.strongauthn.conf.EnforcementPolicy.*;

/**
 * @author jgomer
 */
public class StrongAuthViewModel {

    private static final Pair<Integer, Integer> BOUNDS_MINCREDS_2FA = new Pair<>(1, 3);
    private Logger logger = LoggerFactory.getLogger(getClass());

    private IPluginSettingsHandler<Configuration> settingsHandler;
    private Configuration settings;
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
        settingsHandler = StrongAuthSettingsService.instance().getSettingsHandler();
        settings = settingsHandler.getSettings();
        reloadConfig();
    }

    @NotifyChange({"enforcementPolicies", "deviceExpiration", "locationExpiration"})
    @Command
    public void checkPolicy(@BindingParam("cbox") Checkbox box) {

        String policy = box.getId();

        logger.trace("Policy '{}' {}", policy, box.isChecked() ? "checked" : "unchecked");
        if (box.isChecked()) {
            enforcementPolicies.add(policy);
        } else {
            enforcementPolicies.remove(policy);
            //Revert the numbers, this helps prevent entering negative numbers, then deselecting an option, and then saving
            if (LOCATION_UNKNOWN.toString().equals(policy) || CUSTOM.toString().equals(policy)) {
                deviceExpiration = settings.getTrustedDevicesSettings().getDeviceExpirationDays();
            }
            if (DEVICE_UNKNOWN.toString().equals(policy) || CUSTOM.toString().equals(policy)) {
                locationExpiration = settings.getTrustedDevicesSettings().getLocationExpirationDays();
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

        Optional<TrustedDevicesSettings> opt = Optional.ofNullable(settings.getTrustedDevicesSettings());
        locationExpiration = opt.map(TrustedDevicesSettings::getLocationExpirationDays).orElse(TRUSTED_LOCATION_EXPIRATION_DAYS);
        deviceExpiration = opt.map(TrustedDevicesSettings::getDeviceExpirationDays).orElse(TRUSTED_DEVICE_EXPIRATION_DAYS);

        minCreds2FA = settings.getBasic2FASettings().getMinCreds();
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
        settings.getBasic2FASettings().setMinCreds(minCreds);
        settings.setEnforcement2FA(policies);

        updateMainSettings(Labels.getLabel("adm.methods_change_success"));

    }

    private boolean updateMainSettings(String sucessMessage) {

        boolean success = false;
        try {
            logger.info("Updating global configuration settings");
            //update app-level config and persist
            settingsHandler.setSettings(settings);
            settingsHandler.save();
            if (sucessMessage == null) {
                UIUtils.showMessageUI(true);
            } else {
                Messagebox.show(sucessMessage, null, Messagebox.OK, Messagebox.INFORMATION);
            }
            success = true;
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            UIUtils.showMessageUI(false, Labels.getLabel("adm.conffile_error_update"));
        }
        return success;

    }

}
