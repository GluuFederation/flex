package org.gluu.casa.ui.vm.user;

import org.gluu.casa.core.ExtensionsManager;
import org.gluu.casa.extension.AuthnMethod;
import org.gluu.casa.extension.PreferredMethodFragment;
import org.gluu.casa.ui.UIUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.bind.annotation.*;
import org.zkoss.util.Pair;
import org.zkoss.util.resource.Labels;
import org.zkoss.zk.ui.select.annotation.WireVariable;

import java.util.List;
import java.util.stream.Collectors;

/**
 * This is the ViewModel of page fragment preferred.zul (and the fragments included by it). It controls the functionality
 * for setting the user's preferred authentication method when second factor authentication is enabled
 * @author jgomer
 */
public class UserPreferenceViewModel extends UserViewModel {

    private Logger logger = LoggerFactory.getLogger(getClass());

    @WireVariable("extensionsManager")
    private ExtensionsManager extManager;

    private List<Pair<String, String>> preferredFragments;
    private boolean mfaEnabled;
    private boolean uiNotEnoughCredsFor2FA;

    public int getMinCredsFor2FA() {
        return confSettings.getBasic2FASettings().getMinCreds();
    }

    public boolean isEnableDisableAllowed() {
        return confSettings.getBasic2FASettings().isAllowSelfEnableDisable();
    }

    public boolean isUiNotEnoughCredsFor2FA() {
        return uiNotEnoughCredsFor2FA;
    }

    public boolean isMfaEnabled() {
        return mfaEnabled;
    }

    public void setMfaEnabled(boolean mfaEnabled) {
        this.mfaEnabled = mfaEnabled;
    }

    public List<Pair<String, String>> getPreferredFragments() {
        return preferredFragments;
    }

    @Init(superclass = true)
    public void childInit() {

        List<Pair<AuthnMethod, Integer>> userMethodsCount = userService.getUserMethodsCount(user.getId());
        int totalCreds = userMethodsCount.stream().mapToInt(Pair::getY).sum();
        logger.info("Number of credentials for user {}: {}", user.getUserName(), totalCreds);
        
        //Try to autoenable 2FA. This covers the case in which admin sets the autoenable feature after users
        //have already enrolled creds in the system. Users will be prompted for 2FA the next time they login
    	userService.attemptAutoEnable2FA(user, totalCreds);
        
    	mfaEnabled = user.getPreferredMethod() != null;
        uiNotEnoughCredsFor2FA = totalCreds < getMinCredsFor2FA();

        preferredFragments = extManager.getPluginExtensionsForClass(PreferredMethodFragment.class).stream()
                .map(p -> new Pair<>(String.format("/%s/%s", ExtensionsManager.PLUGINS_EXTRACTION_DIR, p.getX()), p.getY().getUrl()))
                .collect(Collectors.toList());

    }

    @Command
    public void change() {
        boolean outcome = mfaEnabled ? userService.turn2faOn(user) : userService.turn2faOff(user);
        UIUtils.showMessageUI(outcome);
    }

}
