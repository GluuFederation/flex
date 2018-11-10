/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2017, Gluu
 */
package org.gluu.casa.ui.vm.user;

import org.gluu.casa.core.ExtensionsManager;
import org.gluu.casa.extension.AuthnMethod;
import org.gluu.casa.extension.PreferredMethodFragment;
import org.gluu.casa.ui.UIUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.bind.annotation.BindingParam;
import org.zkoss.bind.annotation.Command;
import org.zkoss.bind.annotation.DependsOn;
import org.zkoss.bind.annotation.Init;
import org.zkoss.bind.annotation.NotifyChange;
import org.zkoss.util.Pair;
import org.zkoss.util.resource.Labels;
import org.zkoss.zk.ui.event.Event;
import org.zkoss.zk.ui.select.annotation.VariableResolver;
import org.zkoss.zk.ui.select.annotation.WireVariable;
import org.zkoss.zkplus.cdi.DelegatingVariableResolver;

import java.util.List;
import java.util.Optional;
import java.util.Set;
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
    private String noMethodName;
    private String prevSelectedMethod;
    private String selectedMethod;
    private List<Pair<String, String>> availMethods;

    private boolean uiEditing;
    private boolean uiEditable;
    private boolean uiNotEnoughCredsFor2FA;

    public boolean isUiNotEnoughCredsFor2FA() {
        return uiNotEnoughCredsFor2FA;
    }

    public boolean isUiEditing() {
        return uiEditing;
    }

    public boolean isUiEditable() {
        return uiEditable;
    }

    public List<Pair<String, String>> getAvailMethods() {
        return availMethods;
    }

    public String getSelectedMethod() {
        return selectedMethod;
    }

    public List<Pair<String, String>> getPreferredFragments() {
        return preferredFragments;
    }

    @DependsOn("selectedMethod")
    public String getSelectedMethodName() {
        return Optional.ofNullable(selectedMethod).map(extManager::getExtensionForAcr)
                .map(aMethod -> Labels.getLabel(aMethod.get().getUINameKey())).orElse(noMethodName);
    }

    @Init(superclass = true)
    public void childInit() {

        selectedMethod = user.getPreferredMethod();
        noMethodName = Labels.getLabel("usr.method.none");

        List<Pair<AuthnMethod, Integer>> userMethodsCount = userService.getUserMethodsCount(user.getId());
        availMethods = userMethodsCount.stream().map(Pair::getX)
                .map(aMethod -> new Pair<>(aMethod.getAcr(), Labels.getLabel(aMethod.getUINameKey())))
                .collect(Collectors.toList());

        int totalCreds = userMethodsCount.stream().mapToInt(Pair::getY).sum();
        logger.info("Number of credentials for user {}: {}", user.getUserName(), totalCreds);

        //Note: It may happen user already has enrolled credentials, but admin changed availability of method. In that
        //case user should not be able to edit
        uiEditable = totalCreds >= confSettings.getMinCredsFor2FA() && availMethods.size() > 0;
        uiNotEnoughCredsFor2FA = totalCreds < confSettings.getMinCredsFor2FA() && confSettings.getAcrPluginMap().size() > 0;

        availMethods.add(new Pair<>(null, noMethodName));

        preferredFragments = extManager.getPluginExtensionsForClass(PreferredMethodFragment.class).stream()
                .map(p -> new Pair<>(String.format("/%s/%s", ExtensionsManager.PLUGINS_EXTRACTION_DIR, p.getX()), p.getY().getUrl()))
                .collect(Collectors.toList());

    }

    @NotifyChange({"uiEditing", "selectedMethod"})
    @Command
    public void cancel(@BindingParam("event") Event event) {
        uiEditing = false;
        selectedMethod = prevSelectedMethod;
        if (event != null) {
            event.stopPropagation();
        }
    }

    @NotifyChange({"uiEditing", "selectedMethod"})
    @Command
    public void update() {

        uiEditing = false;
        //saves to LDAP and updates user object afterwards
        if (userService.setPreferredMethod(user, selectedMethod)) {
            UIUtils.showMessageUI(true);
        } else {
            selectedMethod = prevSelectedMethod;
            UIUtils.showMessageUI(false);
        }

    }

    @NotifyChange({"uiEditing"})
    @Command
    public void prepareUpdateMethod() {
        if (uiEditable) {
            prevSelectedMethod = selectedMethod;
            uiEditing = true;
        }
    }

    @Command
    public void change(@BindingParam("method") String cred){
        selectedMethod = cred;
    }

}
