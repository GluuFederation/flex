package org.gluu.casa.plugins.authnmethod.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.gluu.casa.core.PersistenceService;
import org.gluu.persist.model.base.SimpleBranch;

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

    Map<String, String> props;

    @PostConstruct
    private void inited() {
        mapper = new ObjectMapper();
    }

    public String getScriptPropertyValue(String key) {
        return Optional.ofNullable(props).flatMap(m -> Optional.ofNullable(m.get(key))).orElse(null);
    }

    boolean branchMissing(String ou, String dn) {
        String fulldn = String.format("ou=%s,%s", ou, dn);
        return persistenceService.count(new SimpleBranch(fulldn)) <= 0;
    }

}
