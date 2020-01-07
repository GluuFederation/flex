package org.gluu.casa.plugins.authnmethod.rs;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.gluu.casa.core.PersistenceService;
import org.gluu.casa.core.UserService;
import org.gluu.casa.core.model.Person;
import org.gluu.casa.extension.AuthnMethod;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.plugins.authnmethod.rs.status.SecondFactorUserData;
import org.gluu.casa.rest.ProtectedApi;
import org.slf4j.Logger;
import org.zkoss.util.Pair;

import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.gluu.casa.plugins.authnmethod.rs.status.SecondFactorUserData.StatusCode.*;

@ApplicationScoped
@Path("/2fa-info")
public class SecondFactorUserInfoWS {

    @Inject
    private Logger logger;

    @Inject
    private UserService userService;

    @Inject
    private PersistenceService persistenceService;

    @GET
    @Path("user")
    @Produces(MediaType.APPLICATION_JSON)
    @ProtectedApi
    public Response get2FAUserData(@QueryParam("userid") String userId) {

        SecondFactorUserData result = new SecondFactorUserData();
        logger.trace("get2FAUserData WS operation called");

        if (Utils.isEmpty(userId)) {
            result.setCode(NO_USER_ID);
        } else {
            Person person = persistenceService.get(Person.class, persistenceService.getPersonDn(userId));
            if (person == null) {
                result.setCode(UNKNOWN_USER_ID);
            } else {
                try {
                    Stream<AuthnMethod> acrStream = userService.getUserMethodsCount(userId).stream().map(Pair::getX);
                    result.setEnrolledMethods(acrStream.map(AuthnMethod::getAcr).collect(Collectors.toList()));
                    result.setTurnedOn(person.getPreferredMethod() != null);
                    result.setCode(SUCCESS);
                } catch (Exception e) {
                    result.setCode(FAILED);
                    logger.error(e.getMessage(), e);
                }
            }
        }
        return result.getResponse();
    }

}
