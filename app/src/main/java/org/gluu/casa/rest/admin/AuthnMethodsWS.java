package org.gluu.casa.rest.admin;

import org.gluu.casa.core.model.CustomScript;
import org.gluu.casa.core.ExtensionsManager;
import org.gluu.casa.extension.AuthnMethod;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.rest.ProtectedApi;

import org.pf4j.PluginDescriptor;
import org.slf4j.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.*;
import java.util.stream.Collectors;

import static javax.ws.rs.core.Response.Status.BAD_REQUEST;
import static javax.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR;
import static javax.ws.rs.core.Response.Status.NOT_FOUND;
import static javax.ws.rs.core.Response.Status.OK;

@ApplicationScoped
@Path("/authn-methods")
public class AuthnMethodsWS extends BaseWS {
    
    @Inject
    private ExtensionsManager extManager;
    
    @Inject
    private Logger logger;
    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    //@ProtectedApi
    public Response list() {
    	
        Response.Status httpStatus;
        String json = null;
        
        logger.trace("AuthnMethodsWS list operation called");
    	try {    	
    		Set<String> pluginIds = extManager.authnMethodPluginImplementers().stream()
    			.map(PluginDescriptor::getPluginId).collect(Collectors.toSet());
			Set<String> uniqueAcrs = extManager.getAuthnMethodExts(pluginIds)
					.stream().map(AuthnMethod::getAcr).collect(Collectors.toSet());
			
			json = Utils.jsonFromObject(uniqueAcrs);
			httpStatus = OK;
        } catch (Exception e) {
    		logger.error(e.getMessage(), e);
        	json = jsonString(e.getMessage());
        	httpStatus = INTERNAL_SERVER_ERROR;
        }
		return Response.status(httpStatus).entity(json).build();
        
    }
    
    @POST
    @Path("disable")
    @Produces(MediaType.APPLICATION_JSON)
    //@ProtectedApi
    public Response disable(@QueryParam("acr") String acr) {
    	
        Response.Status httpStatus;
        Map<String, String> map = null;
        String json = null;
        Boolean exists = null;
        String value = null;

        logger.trace("AuthnMethodsWS disable operation called");
    	try {
			//This map can hold null values
			map = mainSettings.getAcrPluginMap();
			exists = map.containsKey(acr);
			value = map.get(acr);
    	
			logger.trace("ACR '{}' does%s exist in current acr-plugin mapping of Casa configuration", acr, exists ? "": " not");
    		if (exists) {
    			map.remove(acr);
    			
    			logger.trace("Persisting removal of ACR in acr/plugin configuration mapping");
    			confHandler.saveSettings();
    			httpStatus = OK;
    		} else {
    			httpStatus = NOT_FOUND;
    		}
    		
    	} catch (Exception e) {
    		logger.error(e.getMessage(), e);
    			
    		if (map != null && Boolean.TRUE.equals(exists)) {
    			//restore map in case of error
    			map.put(acr, value);
    		}
        	json = jsonString(e.getMessage());
        	httpStatus = INTERNAL_SERVER_ERROR;
    	}
    	
		return Response.status(httpStatus).entity(json).build();
    	
    }
    
    @POST
    @Path("assign-plugin")
    @Produces(MediaType.APPLICATION_JSON)
    //@ProtectedApi
    public Response assign(@QueryParam("acr") String acr, @QueryParam("plugin") String pluginId) {
    	
        Response.Status httpStatus;
        Map<String, String> map = null;
        String json = null;
        Boolean exists = null;
        String value = null;

        logger.trace("AuthnMethodsWS assign operation called");
    	try {
    		pluginId = Utils.isEmpty(pluginId) ? null : pluginId; 
			if (!Utils.isEmpty(acr) && extManager.pluginImplementsAuthnMethod(acr, pluginId) && scriptEnabled(acr)) {				
				//This map can hold null values
				map = mainSettings.getAcrPluginMap();
				exists = map.containsKey(acr);
				value = map.get(acr);
				
				logger.trace("ACR '{}' does%s exist in current acr-plugin mapping of Casa configuration", acr, exists ? "": " not");				
				map.put(acr, pluginId);
				
    			logger.trace("Persisting update in acr/plugin configuration mapping");
				confHandler.saveSettings();
				httpStatus = OK;
			} else {
				httpStatus = BAD_REQUEST;
				json = String.format("Inconsistency. Check the script for ACR '%s' is enabled and that plugin '%s' implements such Authentication Mechanism"
					, acr, pluginId);
				logger.warn(json);
				json = jsonString(json);
			}
			    		
    	} catch (Exception e) {
    		logger.error(e.getMessage(), e);
    		
    		if (map != null && exists != null) {
    			//restore map in case of error
    			if (exists) {
    				map.put(acr, value);
    			} else {
    				map.remove(acr);
    			}
    		}
        	json = jsonString(e.getMessage());
        	httpStatus = INTERNAL_SERVER_ERROR;
    	}
    	
		return Response.status(httpStatus).entity(json).build();
		
    }
    
    private boolean scriptEnabled(String acr) {
    	return Optional.ofNullable(persistenceService.getScript(acr))
    		.flatMap(sc -> Optional.ofNullable(sc.getEnabled())).orElse(false);
    }
    
}