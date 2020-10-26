package org.gluu.casa.rest.admin;

import org.gluu.casa.core.PasswordStatusService;
import org.gluu.casa.core.PersistenceService;
import org.gluu.casa.rest.ProtectedApi;

import org.slf4j.Logger;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import static javax.ws.rs.core.Response.Status.BAD_REQUEST;
import static javax.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR;
import static javax.ws.rs.core.Response.Status.OK;

@ApplicationScoped
@Path("/config/pwd-reset")
public class PasswordResetAvailWS extends BaseWS {

    @Inject
    private Logger logger;

    @Inject
    private PersistenceService persistenceService;

    @Inject
    private PasswordStatusService pst;
    
    @GET
    @Path("available")
    @Produces(MediaType.APPLICATION_JSON)
    //@ProtectedApi
    public Response available() {
    	
        Response.Status httpStatus;
        String json;
        
        logger.trace("PasswordResetAvailWS available operation called");
    	try {
    		json = isPwdResetAvailable() ? "true" : "false";
        	httpStatus = OK;
        } catch (Exception e) {
        	json = e.getMessage();
        	logger.error(json, e);        	
        	httpStatus = INTERNAL_SERVER_ERROR;
        }
		return Response.status(httpStatus).entity(json).build();  	
        
    }
    
    @GET
    @Path("enabled")
    @Produces(MediaType.APPLICATION_JSON)
    //@ProtectedApi
    public Response isEnabled() {
    	
        Response.Status httpStatus;
        String json;
        
        logger.trace("PasswordResetAvailWS isEnabled operation called");
    	try {
    		json = (isPwdResetAvailable() && mainSettings.isEnablePassReset()) ? "true" : "false";
        	httpStatus = OK;
        } catch (Exception e) {
        	json = e.getMessage();
        	logger.error(json, e);        	
        	httpStatus = INTERNAL_SERVER_ERROR;
        }
		return Response.status(httpStatus).entity(json).build();  	
		
    }

    @POST
    @Path("turn-on")
    @Produces(MediaType.TEXT_PLAIN)
    //@ProtectedApi
    public Response enable() {
        logger.trace("PasswordResetAvailWS enable operation called");
    	return turnOnOff(true);
    }
    
    @POST
    @Path("turn-off")
    @Produces(MediaType.TEXT_PLAIN)
    //@ProtectedApi
    public Response disable() {
        logger.trace("PasswordResetAvailWS disable operation called");
    	return turnOnOff(false);
    }

    private Response turnOnOff(boolean flag) {
    	
        Response.Status httpStatus;
        String json = null;
        boolean value = mainSettings.isEnablePassReset();
        
        try {
			if (isPwdResetAvailable()) {
				if (value != flag) {
					mainSettings.setEnablePassReset(flag);
					logger.trace("Persisting configuration change");
					confHandler.saveSettings();
				}
				httpStatus = OK;
			} else {
				httpStatus = BAD_REQUEST;
				json = "Password reset is not available. Your server may be using an external " +
					"LDAP for identities synchronization"; 
			}
        } catch (Exception e) {
        	json = e.getMessage();
        	logger.error(json, e);
        	
        	//Restore previous value
        	mainSettings.setEnablePassReset(value);
        	httpStatus = INTERNAL_SERVER_ERROR;
        }
		return Response.status(httpStatus).entity(json).build();  

    }
    
    private boolean isPwdResetAvailable() {
    	return !persistenceService.isBackendLdapEnabled();
    }
    
}
