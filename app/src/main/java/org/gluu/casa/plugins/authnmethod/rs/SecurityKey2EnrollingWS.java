package org.gluu.casa.plugins.authnmethod.rs;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.gluu.casa.core.PersistenceService;
import org.gluu.casa.plugins.authnmethod.SecurityKey2Extension;
import org.gluu.casa.plugins.authnmethod.service.Fido2Service;
import org.slf4j.Logger;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.Path;

/**
 * @author jgomer
 */
@ApplicationScoped
@Path("/enrollment/" + SecurityKey2Extension.ACR)
public class SecurityKey2EnrollingWS {

    @Inject
    private Logger logger;

    @Inject
    private Fido2Service u2fService;

    @Inject
    private PersistenceService persistenceService;

    private ObjectMapper mapper;

    @PostConstruct
    private void init() {

        logger.trace("Service inited");
    }

}
