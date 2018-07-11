/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa;

import org.gluu.credmanager.misc.Utils;
import org.gluu.credmanager.service.ILdapService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.bind.annotation.Command;
import org.zkoss.bind.annotation.Init;
import org.zkoss.bind.annotation.NotifyChange;

/**
 * Created by jgomer on 2018-07-10.
 */
public class HelloWorldVM {

    private Logger logger = LoggerFactory.getLogger(getClass());

    private String message;
    private String organizationName;
    private ILdapService ldapService;

    public String getOrganizationName() {
        return organizationName;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Init
    public void init() {
        logger.info("Hello World ViewModel inited");
        //TODO: use service locator?
        ldapService = Utils.managedBean(ILdapService.class);
    }

    @NotifyChange("organizationName")
    @Command
    public void loadOrgName() {
        logger.debug("You typed {}", message);
        organizationName = ldapService.getOrganization().getDisplayName();
    }

}
