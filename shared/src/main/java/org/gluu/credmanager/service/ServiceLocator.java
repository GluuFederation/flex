/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.credmanager.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.gluu.credmanager.misc.Utils;

/**
 * TODO: is this really needed?
 * @author jgomer
 */
public final class ServiceLocator {

    private static ObjectMapper MAPPER = new ObjectMapper();

    private ServiceLocator() { }

    public static ILdapService getLdapService() {
        return Utils.managedBean(ILdapService.class);
    }

    public static ObjectMapper getObjectMapper() {
        return MAPPER;
    }

}
