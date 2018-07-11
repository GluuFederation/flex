/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2017, Gluu
 */
package org.gluu.credmanager.ui.vm.user;

import org.gluu.credmanager.core.*;
import org.gluu.credmanager.core.pojo.BrowserInfo;
import org.gluu.credmanager.core.pojo.User;
import org.gluu.credmanager.extension.AuthnMethod;
import org.gluu.credmanager.extension.navigation.MenuType;
import org.gluu.credmanager.extension.navigation.NavigationMenu;
import org.gluu.credmanager.ui.CredRemovalConflict;
import org.gluu.credmanager.ui.MenuService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.bind.annotation.Command;
import org.zkoss.bind.annotation.Init;
import org.zkoss.util.Pair;
import org.zkoss.util.resource.Labels;
import org.zkoss.zk.ui.Executions;
import org.zkoss.zk.ui.select.annotation.VariableResolver;
import org.zkoss.zk.ui.select.annotation.WireVariable;
import org.zkoss.zkplus.cdi.DelegatingVariableResolver;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * This is the superclass of all ViewModels associated to zul pages used by regular users of the application
 * @author jgomer
 */
@VariableResolver(DelegatingVariableResolver.class)
public class UserViewModel {

    private Logger logger = LoggerFactory.getLogger(getClass());

    @WireVariable("configurationHandler")
    private ConfigurationHandler confHandler;

    @WireVariable
    private OxdService oxdService;

    @WireVariable
    private SessionContext sessionContext;

    @WireVariable
    private AuthFlowContext authFlowContext;

    @WireVariable
    private MenuService menuService;

    @WireVariable
    UserService userService;

    private int minCredsFor2FA;

    private List<Pair<String, NavigationMenu>> contextMenuItems;

    User user;

    public List<Pair<String, NavigationMenu>> getContextMenuItems() {
        return contextMenuItems;
    }

    @Init
    public void init() {
        user = sessionContext.getUser();
        minCredsFor2FA = confHandler.getSettings().getMinCredsFor2FA();
        contextMenuItems = menuService.getMenusOfType(MenuType.AUXILIARY);
    }

    @Command
    public void logoutFromAuthzServer() {

        try {
            logger.trace("Log off attempt");
            purgeSession();
            //After End-User has logged out, the Client might request to log him out of the OP too
            //TODO: what happens after session expiration?
            String idToken = authFlowContext.getIdToken();
            Executions.sendRedirect(oxdService.getLogoutUrl(idToken));
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

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
        Set<String> enabledMethods = confHandler.getEnabledAcrs();
        List<Pair<AuthnMethod, Integer>> userMethodsCount = userService.getUserMethodsCount(user.getId(), enabledMethods);
        int totalCreds = userMethodsCount.stream().mapToInt(Pair::getY).sum();

        if (totalCreds == minCredsFor2FA) {
            message = CredRemovalConflict.CREDS2FA_NUMBER_UNDERFLOW.getMessage(minCredsFor2FA);
        } else if (nCredsOfType == 1 && credentialType.equals(user.getPreferredMethod())){
            message = CredRemovalConflict.PREFERRED_CREDENTIAL_REMOVED.getMessage();
        } else {
            List<AuthnMethod> methods = userService.get2FARequisiteMethods();
            boolean typeOfCredIs2FARequisite = methods.stream().map(AuthnMethod::getAcr).anyMatch(acr -> acr.equals(credentialType));

            if (typeOfCredIs2FARequisite) {
                int nCredsBelongingTo2FARequisite = userMethodsCount.stream()
                        .filter(pair -> pair.getX().mayBe2faActivationRequisite()).mapToInt(Pair::getY).sum();
                if (nCredsBelongingTo2FARequisite == 1) {
                    //Compute the names of those authentication methods which are requisite for 2FA activation
                    String commaSepNames = methods.stream().map(aMethod -> Labels.getLabel(aMethod.getUINameKey()))
                            .collect(Collectors.toList()).toString();
                    commaSepNames = commaSepNames.substring(1, commaSepNames.length() - 1);
                    message = CredRemovalConflict.REQUISITE_NOT_FULFILED.getMessage(commaSepNames);
                }
            }
        }
        return message;

    }

    private void purgeSession() {
        authFlowContext.setStage(AuthFlowContext.RedirectStage.NONE);
        sessionContext.setUser(null);
    }

}
