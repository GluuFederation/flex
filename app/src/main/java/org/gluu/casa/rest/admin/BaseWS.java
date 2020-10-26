package org.gluu.casa.rest.admin;

import org.gluu.casa.conf.MainSettings;
import org.gluu.casa.core.ConfigurationHandler;
import org.gluu.casa.core.PersistenceService;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

@ApplicationScoped
class BaseWS {
	
    @Inject
    MainSettings mainSettings;
	
    @Inject
    ConfigurationHandler confHandler;
	
    @Inject
    PersistenceService persistenceService;
    
}