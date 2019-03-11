package org.gluu.casa.plugins.authnmethod.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.gluu.casa.core.PersistenceService;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.Map;
import java.util.Optional;

/**
 * @author jgomer
 */
class BaseService {

    @Inject
    PersistenceService persistenceService;

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
