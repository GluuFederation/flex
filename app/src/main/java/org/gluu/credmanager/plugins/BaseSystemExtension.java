/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.credmanager.plugins;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.gluu.credmanager.service.ILdapService;
import org.gluu.credmanager.service.ServiceLocator;

/**
 * The parent of all system (aka default) p4fj extensions of this application
 * @author jgomer
 */
public class BaseSystemExtension {

    ILdapService ldapService;
    ObjectMapper mapper;

    public BaseSystemExtension() {
        ldapService = ServiceLocator.getLdapService();
        mapper = ServiceLocator.getObjectMapper();
    }

}
