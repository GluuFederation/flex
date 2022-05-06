package org.gluu.casa.rest.config;

import org.gluu.casa.conf.MainSettings;
import org.gluu.casa.core.ConfigurationHandler;
import org.gluu.casa.core.PersistenceService;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
class BaseWS {

    @Inject
    MainSettings mainSettings;

    @Inject
    ConfigurationHandler confHandler;

    @Inject
    PersistenceService persistenceService;
    
}
