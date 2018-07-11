/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2017, Gluu
 */
package org.gluu.credmanager.ui.vm.user;

import org.gluu.credmanager.core.ConfigurationHandler;
import org.gluu.credmanager.core.ExtensionsManager;
import org.gluu.credmanager.extension.AuthnMethod;
import org.gluu.credmanager.misc.UIUtils;
import org.gluu.credmanager.misc.Utils;
import org.gluu.credmanager.service.LdapService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.bind.BindUtils;
import org.zkoss.bind.annotation.AfterCompose;
import org.zkoss.bind.annotation.Command;
import org.zkoss.bind.annotation.ContextParam;
import org.zkoss.bind.annotation.ContextType;
import org.zkoss.bind.annotation.DependsOn;
import org.zkoss.bind.annotation.Init;
import org.zkoss.bind.annotation.NotifyChange;
import org.zkoss.util.resource.Labels;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.event.Event;
import org.zkoss.zk.ui.select.Selectors;
import org.zkoss.zk.ui.select.annotation.Listen;
import org.zkoss.zk.ui.select.annotation.VariableResolver;
import org.zkoss.zk.ui.select.annotation.WireVariable;
import org.zkoss.zkplus.cdi.DelegatingVariableResolver;

import java.util.List;
import java.util.stream.Collectors;

/**
 * This is the ViewModel of page user.zul (the main page of this app).
 * Main functionalities controlled here are: summary of users's enrolled devices by type
 * @author jgomer
 */
@VariableResolver(DelegatingVariableResolver.class)
public class UserMainViewModel extends UserViewModel {

    private Logger logger = LoggerFactory.getLogger(getClass());

    @WireVariable("configurationHandler")
    private ConfigurationHandler confHandler;

    @WireVariable
    private LdapService ldapService;

    private String introText;
    private boolean methodsAvailability;
    private boolean has2faRequisites;

    private List<AuthnMethod> widgets;
    private List<AuthnMethod> pre2faMethods;

    public String getIntroText() {
        return introText;
    }

    public boolean isMethodsAvailability() {
        return methodsAvailability;
    }

    public boolean isHas2faRequisites() {
        return has2faRequisites;
    }

    public List<AuthnMethod> getWidgets() {
        return widgets;
    }

    public List<AuthnMethod> getPre2faMethods() {
        return pre2faMethods;
    }

    @Init(superclass = true)
    public void childInit() {

        widgets = userService.getLiveAuthnMethods();
        methodsAvailability = widgets.size() > 0;

        if (methodsAvailability) {
            StringBuffer helper = new StringBuffer();
            widgets.forEach(aMethod -> helper.append(", ").append(Labels.getLabel(aMethod.getPanelTitleKey())));
            String orgName = ldapService.getOrganization().getDisplayName();
            introText = Labels.getLabel("usr.main_intro", new String[] { orgName, helper.substring(2) });

            pre2faMethods = widgets.stream().filter(AuthnMethod::mayBe2faActivationRequisite).collect(Collectors.toList());
            has2faRequisites = pre2faMethods.stream().anyMatch(aMethod ->  aMethod.getTotalUserCreds(user.getId(), true) > 0);
        }

    }


}
