/*
 * casa is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.plugins.authnmethod.rs;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.jodah.expiringmap.ExpiringMap;
import org.gluu.casa.core.LdapService;
import org.gluu.casa.core.UserService;
import org.gluu.casa.core.ldap.Person;
import org.gluu.casa.core.pojo.FidoDevice;
import org.gluu.casa.core.pojo.SecurityKey;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.plugins.authnmethod.SecurityKeyExtension;
import org.gluu.casa.plugins.authnmethod.rs.status.u2f.FinishCode;
import org.gluu.casa.plugins.authnmethod.rs.status.u2f.RegisterMessageCode;
import org.gluu.casa.plugins.authnmethod.rs.status.u2f.RegistrationCode;
import org.gluu.casa.plugins.authnmethod.service.U2fService;
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
import java.util.concurrent.TimeUnit;
import java.util.stream.Stream;

/**
 * @author jgomer
 */
@ApplicationScoped
@Path("/enrollment/" + SecurityKeyExtension.ACR)
public class SecurityKeyEnrollingWS {

    private static final int TIME_WINDOW_DEFAULT = 2;
    private static final int MAX_STORED_ENTRIES = 1000;   //one thousand entries stored at most

    @Inject
    private Logger logger;

    @Inject
    private U2fService u2fService;

    @Inject
    private LdapService ldapService;

    @Inject
    private UserService userService;

    private ObjectMapper mapper;

    private Map<String, String> usersWithPendingRegistrations;

    private Map<String, String> recentlyEnrolledDevices;

    @GET
    @Path("registration-message")
    @Produces(MediaType.APPLICATION_JSON)
    @ProtectedApi
    public Response getRegistrationMessage(@QueryParam("userid") String userId) {

        String request = null;
        RegisterMessageCode result;
        logger.trace("getRegistrationMessage WS operation called");

        if (Utils.isEmpty(userId)) {
            result = RegisterMessageCode.NO_USER_ID;
        } else {
            Person person = ldapService.get(Person.class, ldapService.getPersonDn(userId));
            if (person == null) {
                result = RegisterMessageCode.UNKNOWN_USER_ID;
            } else {
                try {
                    String userName = person.getUid();
                    String code = userService.generateRandEnrollmentCode(userId);
                    request = u2fService.generateJsonRegisterMessage(userName, code);
                    result = RegisterMessageCode.SUCCESS;
                    usersWithPendingRegistrations.put(userId, null);
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
    public Response receiveRegistrationResult(Map<String, Object> registrationResult,
                                              @PathParam("userid") String userId) {

        RegistrationCode result;
        SecurityKey newDevice = null;

        if (usersWithPendingRegistrations.containsKey(userId)) {
            usersWithPendingRegistrations.remove(userId);

            Person person = ldapService.get(Person.class, ldapService.getPersonDn(userId));
            if (person == null) {
                result = RegistrationCode.UNKNOWN_USER_ID;
            } else {
                try {
                    String userName = person.getUid();
                    String jsonStr = mapper.writeValueAsString(registrationResult);
                    String error = u2fService.getRegistrationResult(jsonStr);

                    if (error == null) {
                        u2fService.finishRegistration(userName, jsonStr);
                        newDevice = u2fService.getLatestSecurityKey(userId, System.currentTimeMillis());
                        if (newDevice == null){
                            result = RegistrationCode.FAILED;
                        } else {
                            recentlyEnrolledDevices.put(newDevice.getId(), userId);
                            result = RegistrationCode.SUCCESS;
                            userService.cleanRandEnrollmentCode(userId);
                        }
                    } else {
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

        FidoDevice dev = null;
        FinishCode result;

        if (Stream.of(nickName, deviceId).anyMatch(Utils::isEmpty)) {
            result = FinishCode.MISSING_PARAMS;
        } else if (!recentlyEnrolledDevices.containsKey(deviceId)) {
            result = FinishCode.NO_MATCH_OR_EXPIRED;
        } else {
            dev = getDeviceWithID(deviceId);
            dev.setNickName(nickName);

            if (u2fService.updateDevice(dev)) {
                result = FinishCode.SUCCESS;
                recentlyEnrolledDevices.remove(deviceId);
            } else {
                result = FinishCode.FAILED;
            }
        }
        return result.getResponse(dev);

    }

    private FidoDevice getDeviceWithID(String id) {
        FidoDevice dev = new FidoDevice();
        dev.setId(id);
        return dev;
    }

    @PostConstruct
    private void init() {

        logger.trace("Service inited");
        mapper = new ObjectMapper();

        usersWithPendingRegistrations = ExpiringMap.builder()
                .maxSize(MAX_STORED_ENTRIES).expiration(TIME_WINDOW_DEFAULT, TimeUnit.MINUTES)
                .asyncExpirationListener((userId, nothing) -> userService.cleanRandEnrollmentCode(userId.toString()))
                .build();

        recentlyEnrolledDevices = ExpiringMap.builder()
                .maxSize(MAX_STORED_ENTRIES).expiration(TIME_WINDOW_DEFAULT, TimeUnit.MINUTES).build();
    }

}
