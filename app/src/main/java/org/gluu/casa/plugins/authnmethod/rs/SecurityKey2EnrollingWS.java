package org.gluu.casa.plugins.authnmethod.rs;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.gluu.casa.core.PersistenceService;
import org.gluu.casa.core.model.Person;
import org.gluu.casa.core.pojo.SecurityKey;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.plugins.authnmethod.SecurityKey2Extension;
import org.gluu.casa.plugins.authnmethod.rs.status.u2f.FinishCode;
import org.gluu.casa.plugins.authnmethod.rs.status.u2f.RegisterMessageCode;
import org.gluu.casa.plugins.authnmethod.rs.status.u2f.RegistrationCode;
import org.gluu.casa.plugins.authnmethod.service.Fido2Service;
import org.gluu.casa.rest.ProtectedApi;
import org.gluu.service.cache.CacheProvider;
import org.slf4j.Logger;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.stream.Stream;

/**
 * @author jgomer
 */
@ApplicationScoped
@Path("/enrollment/" + SecurityKey2Extension.ACR)
public class SecurityKey2EnrollingWS {

    private static final String USERS_PENDING_REG_PREFIX = "casa_upreg_";    //Users with pending registrations
    private static final String RECENT_DEVICES_PREFIX = "casa_recdev_";     //Recently enrolled devices
    private static final int EXPIRATION = (int) TimeUnit.MINUTES.toSeconds(2);

    @Inject
    private Logger logger;

    @Inject
    private CacheProvider cacheProvider;

    @Inject
    private Fido2Service fido2Service;

    @Inject
    private PersistenceService persistenceService;

    private ObjectMapper mapper;

    @GET
    @Path("attestation")
    @Produces(MediaType.APPLICATION_JSON)
    @ProtectedApi
    public Response getAttestationMessage(@QueryParam("userid") String userId) {

        String request = null;
        RegisterMessageCode result;
        logger.trace("getAttestationMessage WS operation called");

        if (Utils.isEmpty(userId)) {
            result = RegisterMessageCode.NO_USER_ID;
        } else {
            Person person = persistenceService.get(Person.class, persistenceService.getPersonDn(userId));
            if (person == null) {
                result = RegisterMessageCode.UNKNOWN_USER_ID;
            } else {
                try {
                    String userName = person.getUid();
                    request = fido2Service.doRegister(userName, Optional.ofNullable(person.getGivenName()).orElse(userName));
                    result = RegisterMessageCode.SUCCESS;
                    cacheProvider.put(EXPIRATION, USERS_PENDING_REG_PREFIX + userId, "");
                } catch (Exception e) {
                    result = RegisterMessageCode.FAILED;
                    logger.error(e.getMessage(), e);
                }
            }
        }
        return result.getResponse(request);

    }

    @POST
    @Path("registration/{userid}")
    @Produces(MediaType.APPLICATION_JSON)
    @ProtectedApi
    public Response sendRegistrationResult(String body, @PathParam("userid") String userId) {

        RegistrationCode result;
        SecurityKey newDevice = null;
        logger.trace("sendRegistrationResult WS operation called");
        String key = USERS_PENDING_REG_PREFIX + userId;

        if (cacheProvider.hasKey(key)) {
            cacheProvider.remove(key);

            Person person = persistenceService.get(Person.class, persistenceService.getPersonDn(userId));
            if (person == null) {
                result = RegistrationCode.UNKNOWN_USER_ID;
            } else {
                try {
                    if (fido2Service.verifyRegistration(body)) {
                        newDevice = fido2Service.getLatestSecurityKey(userId, System.currentTimeMillis());

                        if (newDevice == null){
                            logger.info("Entry of recently registered fido 2 key could not be found for user {}", userId);
                            result = RegistrationCode.FAILED;
                        } else {
                            cacheProvider.put(EXPIRATION, RECENT_DEVICES_PREFIX + newDevice.getId(), userId);
                            result = RegistrationCode.SUCCESS;
                        }
                    } else {
                        logger.error("Verification has failed. See oxauth logs");
                        result = RegistrationCode.FAILED;
                    }
                } catch (Exception e) {
                    logger.error(e.getMessage(), e);
                    result = RegistrationCode.FAILED;
                }
            }

        } else {
            result = RegistrationCode.NO_MATCH_OR_EXPIRED;
        }
        return result.getResponse(newDevice);

    }

    @POST
    @Path("creds/{userid}")
    @Produces(MediaType.APPLICATION_JSON)
    @ProtectedApi
    public Response nameEnrollment(NamedCredential credential,
                                   @PathParam("userid") String userId) {

        logger.trace("nameEnrollment WS operation called");
        String nickName = Optional.ofNullable(credential).map(NamedCredential::getNickName).orElse(null);
        String deviceId = Optional.ofNullable(credential).map(NamedCredential::getKey).orElse(null);

        FinishCode result;

        if (Stream.of(nickName, deviceId).anyMatch(Utils::isEmpty)) {
            result = FinishCode.MISSING_PARAMS;
        } else if (!cacheProvider.hasKey(RECENT_DEVICES_PREFIX + deviceId)) {
            result = FinishCode.NO_MATCH_OR_EXPIRED;
        } else {
            SecurityKey key = new SecurityKey();
            key.setId(deviceId);
            key.setNickName(nickName);

            if (fido2Service.updateDevice(key)) {
                result = FinishCode.SUCCESS;
                cacheProvider.remove(RECENT_DEVICES_PREFIX + deviceId);
            } else {
                result = FinishCode.FAILED;
            }
        }
        return result.getResponse();

    }

    @PostConstruct
    private void init() {
        logger.trace("Service inited");
        mapper = new ObjectMapper();
    }

}
