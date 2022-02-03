package org.gluu.casa.rest;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.gluu.casa.core.PersistenceService;
import org.gluu.casa.core.UserService;
import org.gluu.casa.core.model.Person;
import org.gluu.casa.core.pojo.User;
import org.gluu.casa.extension.AuthnMethod;
import org.slf4j.Logger;
import org.zkoss.util.Pair;

import java.util.List;
import java.util.stream.Collectors;

import static org.gluu.casa.rest.SecondFactorUserData.StatusCode.*;
import static javax.ws.rs.core.Response.Status.*;

@ApplicationScoped
@ProtectedApi( scopes = "https://jans.io/casa.2fa" )
@Path("/2fa")
public class SecondFactorUserWS {

    @Inject
    private Logger logger;

    @Inject
    private UserService userService;

    @Inject
    private PersistenceService persistenceService;

    @GET
    @Path("user-info/{userid}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response get2FAUserData(@PathParam("userid") String userId) {

        SecondFactorUserData result = new SecondFactorUserData();
        logger.trace("get2FAUserData WS operation called");

        Person person = persistenceService.get(Person.class, persistenceService.getPersonDn(userId));
        if (person == null) {
            result.setCode(UNKNOWN_USER_ID);
        } else {
            try {
                List<Pair<AuthnMethod, Integer>> methodsCount = userService.getUserMethodsCount(userId);

                result.setEnrolledMethods(methodsCount.stream().map(Pair::getX)
                        .map(AuthnMethod::getAcr).collect(Collectors.toList()));
                result.setTotalCreds(methodsCount.stream().mapToInt(Pair::getY).sum());
                result.setTurnedOn(person.getPreferredMethod() != null);
                result.setCode(SUCCESS);
            } catch (Exception e) {
                result.setCode(FAILED);
                logger.error(e.getMessage(), e);
            }
        }
        return result.getResponse();
    }

    @POST
    @Path("turn-on")
    public Response switch2FAOn(String userId) {
    	return switch2FA(userId, true);
    }

    @POST
    @Path("turn-off")
    public Response switch2FAOff(String userId) {
    	return switch2FA(userId, false);    	
    }
    
    private Response switch2FA(String userId, boolean on) {
    	
    	Response.ResponseBuilder rb;
    	try {
            logger.trace("Turning 2FA {} for user '{}'", on ? "on" : "off", userId);

            Person person = persistenceService.get(Person.class, persistenceService.getPersonDn(userId));
            if (person == null) {
                rb = Response.status(NOT_FOUND);
            } else {
                User u = new User();
                u.setId(userId);
                
                boolean success;
                if (on) {
                    success = userService.turn2faOn(u);
                } else {
                    success = userService.turn2faOff(u);
                }
                rb = success ? Response.ok() : Response.serverError();
            }
    	} catch (Exception e) {
            rb = Response.serverError();
            logger.error(e.getMessage(), e);
        }
        return rb.build();
		
    }
    
}
