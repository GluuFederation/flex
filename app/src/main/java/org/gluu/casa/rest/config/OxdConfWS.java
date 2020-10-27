package org.gluu.casa.rest.config;

import org.gluu.casa.conf.OxdClientSettings;
import org.gluu.casa.conf.OxdSettings;
import org.gluu.casa.core.OxdService;
import org.gluu.casa.misc.Utils;
import org.slf4j.Logger;

import java.util.LinkedHashMap;
import java.util.Map;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import static javax.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR;
import static javax.ws.rs.core.Response.Status.OK;

@ApplicationScoped
@Path("/config/oxd")
public class OxdConfWS extends BaseWS {
	
	@Inject
    private Logger logger;
	
	@Inject
    private OxdService oxdService;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    //@ProtectedApi
    public Response retrieve() {
    	
        Response.Status httpStatus;
        String json = null;
        logger.trace("OxdConfWS retrieve operation called");
    	
    	try {
    		OxdSettings oxdSettings = (OxdSettings) Utils.cloneObject(mainSettings.getOxdSettings());
    		OxdClientSettings clientSettings = oxdSettings.getClient(); 
    		oxdSettings.setClient(null);
    		
    		Map<String, Object> map = new LinkedHashMap<>();
    		map.put("settings", oxdSettings);
    		map.put("client_details", clientSettings);
    		
			json = Utils.jsonFromObject(map);
        	httpStatus = OK;
    	} catch (Exception e) {
        	json = e.getMessage();
    		logger.error(json, e);
        	httpStatus = INTERNAL_SERVER_ERROR;
    	}
    	
		return Response.status(httpStatus).entity(json).build();
    
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    //@ProtectedApi
    public Response replace(OxdSettings oxdSettings) {
    	
        Response.Status httpStatus;
        String json = null;
        OxdSettings value = mainSettings.getOxdSettings();
        logger.trace("OxdConfWS replace operation called");
    	
    	try {
    		logger.info("Trying to override current OXD configuration with {}", Utils.jsonFromObject(oxdSettings));
    		json = oxdService.updateSettings(oxdSettings);
    		
    		if (json == null) {
				logger.trace("Persisting update in configuration");
				confHandler.saveSettings();
				json = Utils.jsonFromObject(mainSettings.getOxdSettings().getClient());
				httpStatus = OK;
    		} else {
				httpStatus = INTERNAL_SERVER_ERROR;
    		}
    	} catch (Exception e) {
        	json = e.getMessage();
    		logger.error(json, e);
    		
    		mainSettings.setOxdSettings(value);
        	httpStatus = INTERNAL_SERVER_ERROR;
    	}
    	
		return Response.status(httpStatus).entity(json).build();
		
    }
    
}
