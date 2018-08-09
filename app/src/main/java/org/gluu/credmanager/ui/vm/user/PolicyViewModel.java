package org.gluu.credmanager.ui.vm.user;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.gluu.credmanager.conf.sndfactor.EnforcementPolicy;
import org.gluu.credmanager.conf.sndfactor.TrustedDevice;
import org.gluu.credmanager.ui.UIUtils;
import org.zkoss.bind.annotation.BindingParam;
import org.zkoss.bind.annotation.Command;
import org.zkoss.bind.annotation.Init;
import org.zkoss.bind.annotation.NotifyChange;
import org.zkoss.util.Pair;
import org.zkoss.zk.ui.select.annotation.VariableResolver;
import org.zkoss.zkplus.cdi.DelegatingVariableResolver;
import org.zkoss.zul.Checkbox;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.gluu.credmanager.conf.sndfactor.EnforcementPolicy.EVERY_LOGIN;

/**
 * Created by jgomer on 2018-06-12.
 */
@VariableResolver(DelegatingVariableResolver.class)
public class PolicyViewModel extends UserViewModel {

    private Logger logger = LogManager.getLogger(getClass());

    private boolean uiHasPreferredMethod;
    private boolean uiAllowedToSetPolicy;
    private Set<String> enforcementPolicies;
    private Set<String> enforcementPoliciesCopy;
    private List<TrustedDevice> trustedDevices;

    public boolean isUiHasPreferredMethod() {
        return uiHasPreferredMethod;
    }

    public boolean isUiAllowedToSetPolicy() {
        return uiAllowedToSetPolicy;
    }

    public Set<String> getEnforcementPolicies() {
        return enforcementPolicies;
    }

    public List<TrustedDevice> getTrustedDevices() {
        return trustedDevices;
    }

    @Init(superclass = true)
    public void childInit() throws Exception {

        uiHasPreferredMethod = user.getPreferredMethod() != null;
        uiAllowedToSetPolicy = confSettings.getEnforcement2FA().contains(EnforcementPolicy.CUSTOM);
        Pair<Set<String>, List<TrustedDevice>> police = userService.get2FAPolicyData(user.getId());
        enforcementPolicies = police.getX();
        trustedDevices = police.getY();

        if (enforcementPolicies.isEmpty()) {
            resetToDefaultPolicy();
        }
        enforcementPoliciesCopy = new HashSet<>(enforcementPolicies);

    }
    @NotifyChange("enforcementPolicies")
    @Command
    public void checkPolicy(@BindingParam("target") Checkbox box) {

        String policy = box.getId();
        if (box.isChecked()) {
            enforcementPolicies.add(policy);
        } else {
            enforcementPolicies.remove(policy);
        }
        if (enforcementPolicies.contains(EVERY_LOGIN.toString())) {
            resetToDefaultPolicy();
        }

    }

    @Command
    public void updatePolicy() {

        if (userService.update2FAPolicies(user.getId(), enforcementPolicies)) {
            enforcementPoliciesCopy = new HashSet<>(enforcementPolicies);
            UIUtils.showMessageUI(true);
        } else {
            UIUtils.showMessageUI(false);
        }

    }

    @NotifyChange("trustedDevices")
    @Command
    public void deleteDevice(@BindingParam("idx") int index) {
        UIUtils.showMessageUI(userService.deleteTrustedDevice(user.getId(), trustedDevices, index));
    }

    @NotifyChange("enforcementPolicies")
    @Command
    public void cancel() {
        enforcementPolicies = new HashSet<>(enforcementPoliciesCopy);
    }

    private void resetToDefaultPolicy() {
        enforcementPolicies = Stream.of(EVERY_LOGIN.toString()).collect(Collectors.toSet());
    }

}
