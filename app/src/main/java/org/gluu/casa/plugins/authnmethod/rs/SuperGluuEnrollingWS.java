/*
 * casa is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.plugins.authnmethod.rs;

import net.jodah.expiringmap.ExpiringMap;
import org.gluu.casa.core.LdapService;
import org.gluu.casa.core.UserService;
import org.gluu.casa.core.ldap.Person;
import org.gluu.casa.core.pojo.FidoDevice;
import org.gluu.casa.core.pojo.SuperGluuDevice;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.plugins.authnmethod.SuperGluuExtension;
import org.gluu.casa.plugins.authnmethod.rs.status.sg.ComputeRequestCode;
import org.gluu.casa.plugins.authnmethod.rs.status.sg.EnrollmentStatusCode;
import org.gluu.casa.plugins.authnmethod.rs.status.u2f.FinishCode;
import org.gluu.casa.plugins.authnmethod.service.SGService;
import org.gluu.casa.rest.ProtectedApi;
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

    private static final int MIN_CLIENT_POLL_PERIOD = 5;
    private static final int TIME_WINDOW_DEFAULT = 2;
    private static final int MAX_STORED_ENTRIES = 300;

    @Inject
    private Logger logger;

    @Inject
    private SGService sgService;

    @Inject
    private LdapService ldapService;

    @Inject
    private UserService userService;

    private Map<String, String> bannedLookupKeys;

    private Map<String, String> pendingEnrollments;

    private Map<String, String> recentlyEnrolledDevices;

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
            Person person = ldapService.get(Person.class, ldapService.getPersonDn(userId));
            if (person == null) {
                result = ComputeRequestCode.UNKNOWN_USER_ID;
            } else {
                String userName = person.getUid();
                String code = userService.generateRandEnrollmentCode(userId);

                //key serves an identifier for clients to poll status afterwards
                String key = UUID.randomUUID().toString();
                bannedLookupKeys.put(key, null);
                pendingEnrollments.put(key, userId);

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

        if (bannedLookupKeys.containsKey(key)) {
            //early abort
            return EnrollmentStatusCode.PENDING.getResponse();
        }

        //If it gets here, a reasonable amount of time have elapsed for client to check status
        EnrollmentStatusCode status;
        SuperGluuDevice newDevice = null;
        String userId = pendingEnrollments.get(key);

        if (userId == null) {
            status = EnrollmentStatusCode.FAILED;
        } else {

            newDevice = sgService.getLatestSuperGluuDevice(userId, System.currentTimeMillis());
            if (newDevice == null) {
                bannedLookupKeys.put(userId, null);
                return EnrollmentStatusCode.PENDING.getResponse();
            }

            //Enrollment was made!
            pendingEnrollments.remove(key);
            try {
                boolean enrolled = sgService.isDeviceUnique(newDevice, userId);
                if (enrolled) {
                    status = EnrollmentStatusCode.SUCCESS;
                    recentlyEnrolledDevices.put(newDevice.getId(), userId);
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
        } else if (!recentlyEnrolledDevices.containsKey(deviceId)) {
            result = FinishCode.NO_MATCH_OR_EXPIRED;
        } else {
            FidoDevice dev = getDeviceWithID(deviceId);
            dev.setNickName(nickName);

            if (sgService.updateDevice(dev)) {
                result = FinishCode.SUCCESS;
                recentlyEnrolledDevices.remove(deviceId);
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

        bannedLookupKeys = ExpiringMap.builder()
                .maxSize(MAX_STORED_ENTRIES).expiration(MIN_CLIENT_POLL_PERIOD, TimeUnit.SECONDS).build();

        pendingEnrollments = ExpiringMap.builder()
                .maxSize(MAX_STORED_ENTRIES).expiration(TIME_WINDOW_DEFAULT, TimeUnit.MINUTES)
                .asyncExpirationListener((deviceId, userId) -> {
                    //Removes the random code if it status was never checked (see #enrollmentReady)
                    //sgService.removeDevice(getDeviceWithID(deviceId.toString()));
                    userService.cleanRandEnrollmentCode(userId.toString());
                })
                .build();

        recentlyEnrolledDevices = ExpiringMap.builder()
                .maxSize(MAX_STORED_ENTRIES).expiration(TIME_WINDOW_DEFAULT, TimeUnit.MINUTES).build();

    }

}
