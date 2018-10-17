/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.plugins.authnmethod.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.gluu.casa.core.LdapService;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.Map;
import java.util.Optional;

/**
 * @author jgomer
 */
class BaseService {

    @Inject
    LdapService ldapService;

    ObjectMapper mapper;

    org.codehaus.jackson.map.ObjectMapper codehausMapper;

    Map<String, String> props;

    @PostConstruct
    private void inited() {
        mapper = new ObjectMapper();
        codehausMapper = new org.codehaus.jackson.map.ObjectMapper();
    }

    public String getScriptPropertyValue(String key) {
        return Optional.ofNullable(props).flatMap(m -> Optional.ofNullable(m.get(key))).orElse(null);
    }

}
