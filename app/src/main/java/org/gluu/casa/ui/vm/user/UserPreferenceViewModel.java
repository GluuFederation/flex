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
import org.zkoss.zk.ui.event.Event;
import org.zkoss.zk.ui.select.annotation.VariableResolver;
import org.zkoss.zk.ui.select.annotation.WireVariable;
import org.zkoss.zkplus.cdi.DelegatingVariableResolver;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * This is the ViewModel of page fragment preferred.zul (and the fragments included by it). It controls the functionality
 * for setting the user's preferred authentication method when second factor authentication is enabled
 * @author jgomer
 */
@VariableResolver(DelegatingVariableResolver.class)
public class UserPreferenceViewModel extends UserViewModel {

    private Logger logger = LoggerFactory.getLogger(getClass());

    @WireVariable("extensionsManager")
    private ExtensionsManager extManager;

    private List<Pair<String, String>> preferredFragments;
    private boolean mfaEnabled;
    private boolean uiEditable;
    private boolean uiNotEnoughCredsFor2FA;

    public boolean isUiNotEnoughCredsFor2FA() {
        return uiNotEnoughCredsFor2FA;
    }

    public boolean isUiEditable() {
        return uiEditable;
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

        mfaEnabled= user.getPreferredMethod() != null;

        List<Pair<AuthnMethod, Integer>> userMethodsCount = userService.getUserMethodsCount(user.getId());
        List<Pair<String, String>> availMethods = userMethodsCount.stream().map(Pair::getX)
                .map(aMethod -> new Pair<>(aMethod.getAcr(), Labels.getLabel(aMethod.getUINameKey())))
                .collect(Collectors.toList());

        int totalCreds = userMethodsCount.stream().mapToInt(Pair::getY).sum();
        logger.info("Number of credentials for user {}: {}", user.getUserName(), totalCreds);

        //Note: It may happen user already has enrolled credentials, but admin changed availability of method. In that
        //case user should not be able to edit
        uiEditable = totalCreds >= confSettings.getMinCredsFor2FA() && availMethods.size() > 0;
        uiNotEnoughCredsFor2FA = totalCreds < confSettings.getMinCredsFor2FA() && confSettings.getAcrPluginMap().size() > 0;

        preferredFragments = extManager.getPluginExtensionsForClass(PreferredMethodFragment.class).stream()
                .map(p -> new Pair<>(String.format("/%s/%s", ExtensionsManager.PLUGINS_EXTRACTION_DIR, p.getX()), p.getY().getUrl()))
                .collect(Collectors.toList());

    }

    @Command
    public void change() {
        String value = mfaEnabled ? Long.toString(System.currentTimeMillis()) : null;
        //saves to LDAP and updates user object afterwards
        UIUtils.showMessageUI(userService.setPreferredMethod(user, value));
    }

}
