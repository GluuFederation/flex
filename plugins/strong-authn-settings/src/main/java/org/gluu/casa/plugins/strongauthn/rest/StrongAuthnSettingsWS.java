package org.gluu.casa.plugins.strongauthn.rest;

import org.gluu.casa.core.pojo.Basic2FASettings;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.plugins.strongauthn.conf.Configuration;
import org.gluu.casa.plugins.strongauthn.conf.EnforcementPolicy;
import org.gluu.casa.plugins.strongauthn.conf.TrustedDevicesSettings;
import org.gluu.casa.plugins.strongauthn.service.StrongAuthSettingsService;
import org.gluu.casa.service.settings.IPluginSettingsHandler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
@Path("/config")
public class StrongAuthnSettingsWS {

    private Logger logger = LoggerFactory.getLogger(getClass());
    private static StrongAuthSettingsService service = StrongAuthSettingsService.instance();
    private IPluginSettingsHandler<Configuration> settingsHandler = service.getSettingsHandler();
    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    //@ProtectedApi
    public Response retrieve() {
    	
        Response.Status httpStatus;
        String json = null;
        
        logger.trace("StrongAuthnSettingsWS retrieve operation called");
    	try {
    		json = Utils.jsonFromObject(settingsHandler.getSettings());
    		httpStatus = OK;
        } catch (Exception e) {
        	json = e.getMessage();
    		logger.error(json, e);
        	httpStatus = INTERNAL_SERVER_ERROR;
        }
		return Response.status(httpStatus).entity(json).build();
		
    }
    
    @POST
    @Path("basic")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.TEXT_PLAIN)
    //@ProtectedApi
    public Response setBasicConfig(Basic2FASettings settings) {
    	
        Response.Status httpStatus;
        String json = null;
    	Configuration cfg = settingsHandler.getSettings();
    	Basic2FASettings value = cfg.getBasic2FASettings();
        
        logger.trace("StrongAuthnSettingsWS setBasicConfig operation called");
    	try {
    		httpStatus = BAD_REQUEST;
    		if (settings == null) {
    			json = "Empty payload";
    			logger.warn(json);
    			
    		} else {
    			if (settings.getMinCreds() < 1) {
					json = "Minimum number of credentials expected to be greater than zero";
					logger.warn(json);
					
    			} else if (!settings.isAutoEnable() && !settings.isAllowSelfEnableDisable()) {
    				json = "Cannot prevent users to turn 2FA on/off when there is no 2FA auto-enablement";
					logger.warn(json);
					
    			} else {
    				cfg.setBasic2FASettings(settings);
    				settingsHandler.setSettings(cfg);
    				settingsHandler.save();
					httpStatus = OK;
    			}
    		}
        } catch (Exception e) {
        	//Revert state of in-memory copy 
        	cfg.setBasic2FASettings(value);
        	settingsHandler.setSettings(cfg);
        	
        	json = e.getMessage();
    		logger.error(json, e);
        	httpStatus = INTERNAL_SERVER_ERROR;
        }
		return Response.status(httpStatus).entity(json).build();
		
    }
    
    @POST
    @Path("enforcement-policies")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.TEXT_PLAIN)
    //@ProtectedApi
    public Response setEnforcementPolicies(List<EnforcementPolicy> policies) {
    	
        Response.Status httpStatus;
        String json = null;
    	Configuration cfg = settingsHandler.getSettings();
    	List<EnforcementPolicy> value = cfg.getEnforcement2FA();
        
        logger.trace("StrongAuthnSettingsWS setEnforcementPolicies operation called");
    	try {
    		httpStatus = BAD_REQUEST;
    		
    		if (policies == null) {
    			json = "Empty payload";
    			logger.warn(json);
    			
    		} else if (policies.size() == 1 || (policies.size() == 2 && policies.contains(EnforcementPolicy.LOCATION_UNKNOWN)
    			&& policies.contains(EnforcementPolicy.DEVICE_UNKNOWN))) {
    		
				cfg.setEnforcement2FA(policies);
				settingsHandler.setSettings(cfg);
				settingsHandler.save();
    			httpStatus = OK;
    		} else {
    			json = String.format("Unacceptable combination of policies %s", policies);
    			logger.warn(json);
    			
    		}
        } catch (Exception e) {
        	//Revert state of in-memory copy 
        	cfg.setEnforcement2FA(value);
        	settingsHandler.setSettings(cfg);
        	
        	json = e.getMessage();
    		logger.error(json, e);
        	httpStatus = INTERNAL_SERVER_ERROR;
        }
		return Response.status(httpStatus).entity(json).build();
        
    }
    
    @POST
    @Path("trusted-devices")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.TEXT_PLAIN)
    //@ProtectedApi
    public Response setTrustedDevices(TrustedDevicesSettings settings) {
    	
        Response.Status httpStatus;
        String json = null;
    	Configuration cfg = settingsHandler.getSettings();
    	TrustedDevicesSettings value = cfg.getTrustedDevicesSettings();
        
        logger.trace("StrongAuthnSettingsWS setTrustedDevices operation called");
    	try {
    		httpStatus = BAD_REQUEST;
    		
    		if (settings == null) {
    			json = "Empty payload";
    			logger.warn(json);
    			
    		} else {
				int lexp = Optional.ofNullable(settings.getLocationExpirationDays()).orElse(0);
				int dexp = Optional.ofNullable(settings.getDeviceExpirationDays()).orElse(0);
				
				if (lexp > 0 && dexp > 0) {
	
					cfg.setTrustedDevicesSettings(settings);
					settingsHandler.setSettings(cfg);
					settingsHandler.save();
					httpStatus = OK;
				} else {
					json = "One or more of the provided expiration values are invalid";
					logger.warn(json);
				}
    		}
        } catch (Exception e) {
        	//Revert state of in-memory copy 
        	cfg.setTrustedDevicesSettings(value);
        	settingsHandler.setSettings(cfg);
        	
        	json = e.getMessage();
    		logger.error(json, e);
        	httpStatus = INTERNAL_SERVER_ERROR;
        }
		return Response.status(httpStatus).entity(json).build();
        
    }
    
}