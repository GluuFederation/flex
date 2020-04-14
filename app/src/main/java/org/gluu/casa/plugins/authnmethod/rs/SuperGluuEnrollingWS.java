package org.gluu.casa.plugins.authnmethod.rs;

import net.jodah.expiringmap.ExpiringMap;
import org.gluu.casa.core.PersistenceService;
import org.gluu.casa.core.UserService;
import org.gluu.casa.core.model.Person;
import org.gluu.casa.core.pojo.FidoDevice;
import org.gluu.casa.core.pojo.SuperGluuDevice;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.plugins.authnmethod.SuperGluuExtension;
import org.gluu.casa.plugins.authnmethod.rs.status.sg.ComputeRequestCode;
import org.gluu.casa.plugins.authnmethod.rs.status.sg.EnrollmentStatusCode;
import org.gluu.casa.plugins.authnmethod.rs.status.u2f.FinishCode;
import org.gluu.casa.plugins.authnmethod.service.SGService;
import org.gluu.casa.rest.ProtectedApi;
import org.gluu.service.cache.CacheProvider;
import org.slf4j.Logger;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.stream.Stream;

/**
 * @author jgomer
 */
@ApplicationScoped
@Path("/enrollment/" + SuperGluuExtension.ACR)
public class SuperGluuEnrollingWS {

    private static final String BANNED_KEYS_PREFIX = "casa_blk_";   //Banned lookup keys
    private static final String PENDING_ENROLLS_PREFIX = "casa_pend_"; //Pending enrollments
    private static final String RECENT_DEVICES_PREFIX = "casa_recdev_"; //Recently enrolled devices
    private static final int MIN_CLIENT_POLL_PERIOD = 5000;
    private static final int EXPIRATION = (int) TimeUnit.MINUTES.toSeconds(2);

    @Inject
    private Logger logger;

    @Inject
    private CacheProvider cacheProvider;

    @Inject
    private SGService sgService;

    @Inject
    private PersistenceService persistenceService;

    @Inject
    private UserService userService;

    private Map<String, String> usersWithRandEnrollmentCodes;

    @GET
    @Path("qr-request")
    @Produces(MediaType.APPLICATION_JSON)
    @ProtectedApi
    public Response computeRequest(@QueryParam("remoteIP") String remoteIP,
                                   @QueryParam("userid") String userId) {

        String qrRequest;
        ComputeRequestCode result;
        logger.trace("computeRequest WS operation called");

        if (Utils.isEmpty(userId)) {
            result = ComputeRequestCode.NO_USER_ID;
        } else {
            Person person = persistenceService.get(Person.class, persistenceService.getPersonDn(userId));
            if (person == null) {
                result = ComputeRequestCode.UNKNOWN_USER_ID;
            } else {
                String userName = person.getUid();
                String code = userService.generateRandEnrollmentCode(userId);
                usersWithRandEnrollmentCodes.put(userId, null);

                //key serves an identifier for clients to poll status afterwards
                String key = UUID.randomUUID().toString();

                cacheProvider.put(EXPIRATION, PENDING_ENROLLS_PREFIX + key, userId);
                //ensure method enrollmentReady is not abused
                cacheProvider.put(MIN_CLIENT_POLL_PERIOD, BANNED_KEYS_PREFIX + key, "");

                qrRequest = sgService.generateRequest(userName, code, remoteIP);
                return ComputeRequestCode.SUCCESS.getResponse(key, qrRequest);
            }
        }
        return result.getResponse();

    }

    @GET
    @Path("status")
    @Produces(MediaType.APPLICATION_JSON)
    @ProtectedApi
    public Response enrollmentReady(@QueryParam("key") String key) {

        logger.trace("enrollmentReady WS operation called");

        if (cacheProvider.get(BANNED_KEYS_PREFIX + key) != null) {
            //early abort
            return EnrollmentStatusCode.PENDING.getResponse();
        }

        //If it gets here, a reasonable amount of time have elapsed for client to check status
        EnrollmentStatusCode status;
        SuperGluuDevice newDevice = null;
        String queryParamKey = key;
        key = PENDING_ENROLLS_PREFIX + key;
        String userId = Optional.ofNullable(cacheProvider.get(key)).map(Object::toString).orElse(null);

        if (userId == null) {
            status = EnrollmentStatusCode.FAILED;
        } else {

            newDevice = sgService.getLatestSuperGluuDevice(userId, System.currentTimeMillis());
            if (newDevice == null) {
                //Not ready yet (probably due to delayed push or user delayed to approve)
                cacheProvider.put(MIN_CLIENT_POLL_PERIOD, BANNED_KEYS_PREFIX + queryParamKey, "");
                return EnrollmentStatusCode.PENDING.getResponse();
            }

            //Enrollment was made!
            cacheProvider.remove(key);
            try {
                boolean enrolled = sgService.isDeviceUnique(newDevice, userId);
                if (enrolled) {
                    status = EnrollmentStatusCode.SUCCESS;
                    cacheProvider.put(EXPIRATION, RECENT_DEVICES_PREFIX + newDevice.getId(), userId);
                } else {
                    sgService.removeDevice(newDevice);
                    logger.info("Duplicated SuperGluu device {} has been removed", newDevice.getDeviceData().getUuid());
                    status = EnrollmentStatusCode.DUPLICATED;
                }
                userService.cleanRandEnrollmentCode(userId);
            } catch (Exception e) {
                logger.error(e.getMessage(), e);
                status = EnrollmentStatusCode.FAILED;
            }
        }
        return status.getResponse(newDevice);

    }

    @GET
    @Path("creds/{userid}/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @ProtectedApi
    public Response getEnrollments() {
        return Response.status(Response.Status.NOT_IMPLEMENTED).build();
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
            FidoDevice dev = getDeviceWithID(deviceId);
            dev.setNickName(nickName);

            if (sgService.updateDevice(dev)) {
                result = FinishCode.SUCCESS;
                cacheProvider.remove(RECENT_DEVICES_PREFIX + deviceId);
            } else {
                result = FinishCode.FAILED;
            }
        }
        return result.getResponse();

    }

    private FidoDevice getDeviceWithID(String id) {
        FidoDevice dev = new FidoDevice();
        dev.setId(id);
        return dev;
    }

    @PostConstruct
    private void inited() {
        logger.trace("Service inited");
        usersWithRandEnrollmentCodes = ExpiringMap.builder().expiration(EXPIRATION, TimeUnit.MINUTES)
                .asyncExpirationListener((userId, dummy) ->
                    //Removes the user's random enrollment code if #enrollmentReady was never called
                    //sgService.removeDevice(getDeviceWithID(deviceId.toString()));
                    userService.cleanRandEnrollmentCode(userId.toString())
                )
                .build();

    }

}
