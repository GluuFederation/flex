/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2017, Gluu
 */
package org.gluu.casa.ui.vm.user;

import org.gluu.casa.conf.MainSettings;
import org.gluu.casa.core.*;
import org.gluu.casa.core.pojo.BrowserInfo;
import org.gluu.casa.core.pojo.User;
import org.gluu.casa.extension.AuthnMethod;
import org.gluu.casa.ui.CredRemovalConflict;
import org.zkoss.bind.annotation.Init;
import org.zkoss.util.Pair;
import org.zkoss.util.resource.Labels;
import org.zkoss.zk.ui.select.annotation.VariableResolver;
import org.zkoss.zk.ui.select.annotation.WireVariable;
import org.zkoss.zkplus.cdi.DelegatingVariableResolver;

import java.util.List;
import java.util.stream.Collectors;

/**
 * This is the superclass of all ViewModels associated to zul pages used by regular users of the application
 * @author jgomer
 */
@VariableResolver(DelegatingVariableResolver.class)
public class UserViewModel {

    @WireVariable
    private SessionContext sessionContext;

    @WireVariable("configurationHandler")
    private ConfigurationHandler confHandler;

    @WireVariable
    UserService userService;

    MainSettings confSettings;

    User user;

    @Init
    public void init() {
        user = sessionContext.getUser();
        //Note MainSettings is not injectable in ViewModels
        confSettings = confHandler.getSettings();
    }

    public String getAuthnMethodPageUrl(AuthnMethod method) {

        String page = method.getPageUrl();
        String pluginId = confSettings.getAcrPluginMap().get(method.getAcr());
        if (pluginId != null) {
            page = String.format("/%s/%s/%s", ExtensionsManager.PLUGINS_EXTRACTION_DIR, pluginId, page);
        }
        return page;


    }

    int getScreenWidth() {
        return sessionContext.getScreenWidth();
    }

    BrowserInfo getBrowserInfo() {
        return sessionContext.getBrowser();
    }

    Pair<String, String> getDeleteMessages(String nick, String extraMessage){

        StringBuilder text=new StringBuilder();
        if (extraMessage != null) {
            text.append(extraMessage).append("\n\n");
        }
        text.append(Labels.getLabel("usr.del_confirm", new String[]{ nick==null ? Labels.getLabel("general.no_named") : nick }));
        if (extraMessage != null) {
            text.append("\n");
        }

        return new Pair<>(Labels.getLabel("usr.del_title"), text.toString());

    }

    String resetPreferenceMessage(String credentialType, int nCredsOfType) {

        //Assume removal has no problem
        String message = null;
        List<Pair<AuthnMethod, Integer>> userMethodsCount = userService.getUserMethodsCount(user.getId());
        int totalCreds = userMethodsCount.stream().mapToInt(Pair::getY).sum();
        int minCredsFor2FA = confSettings.getMinCredsFor2FA();

        if (nCredsOfType == 1) {
            List<AuthnMethod> methods = userService.get2FARequisiteMethods();
            boolean typeOfCredIs2FARequisite = methods.stream().map(AuthnMethod::getAcr).anyMatch(acr -> acr.equals(credentialType));

            if (typeOfCredIs2FARequisite) {
                //Discard if credential being removed is the only registered that belongs to 2FARequisiteMethods
                int nCredsBelongingTo2FARequisite = userMethodsCount.stream()
                        .filter(pair -> pair.getX().mayBe2faActivationRequisite()).mapToInt(Pair::getY).sum();
                if (nCredsBelongingTo2FARequisite == 1) {
                    //Compute the names of those authentication methods which are requisite for 2FA activation
                    String commaSepNames = methods.stream().map(aMethod -> Labels.getLabel(aMethod.getUINameKey()))
                            .collect(Collectors.toList()).toString();
                    commaSepNames = commaSepNames.substring(1, commaSepNames.length() - 1);
                    message = CredRemovalConflict.REQUISITE_NOT_FULFILED.getMessage(commaSepNames);
                }
            } else if (credentialType.equals(user.getPreferredMethod())) {
                message = CredRemovalConflict.PREFERRED_CREDENTIAL_REMOVED.getMessage();
            }
        }
        if (message == null && totalCreds == minCredsFor2FA) {
            message = CredRemovalConflict.CREDS2FA_NUMBER_UNDERFLOW.getMessage(minCredsFor2FA);
        }
        if (message != null) {
            message = Labels.getLabel("usr.del_conflict_revert", new String[]{ message });
        }
        return message;

    }

}
