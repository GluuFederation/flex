/*
 * casa is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.plugins.authnmethod.rs;

import net.jodah.expiringmap.ExpiringMap;
import org.gluu.casa.core.pojo.OTPDevice;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.plugins.authnmethod.OTPExtension;
import org.gluu.casa.plugins.authnmethod.rs.status.otp.ComputeRequestCode;
import org.gluu.casa.plugins.authnmethod.rs.status.otp.FinishCode;
import org.gluu.casa.plugins.authnmethod.rs.status.otp.ValidateCode;
import org.gluu.casa.plugins.authnmethod.service.OTPService;
import org.gluu.casa.plugins.authnmethod.service.otp.IOTPAlgorithm;
import org.gluu.casa.rest.ProtectedApi;
import org.slf4j.Logger;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.stream.Stream;

import static com.lochbridge.oath.otp.keyprovisioning.OTPKey.OTPType;

/**
 * @author jgomer
 */
@ApplicationScoped
@Path("/enrollment/" + OTPExtension.ACR)
public class OTPEnrollingWS {

    private static final int TIME_WINDOW_DEFAULT = 2;
    private static final int MAX_STORED_ENTRIES = 1000;   //one thousand entries stored at most

    @Inject
    private Logger logger;

    @Inject
    private OTPService otpService;

    private Map<String, String> keyExternalUidMapping;

    @GET
    @Path("qr-request")
    @Produces(MediaType.APPLICATION_JSON)
    @ProtectedApi
    public Response computeRequest(@QueryParam("displayName") String name,
                                   @QueryParam("mode") String mode) {

        logger.trace("computeRequest WS operation called");

        if (Utils.isEmpty(name)) {
            return ComputeRequestCode.NO_DISPLAY_NAME.getResponse();
        } else {
            try {
                IOTPAlgorithm as = otpService.getAlgorithmService(OTPType.valueOf(mode.toUpperCase()));
                byte[] secretKey = as.generateSecretKey();
                String request = as.generateSecretKeyUri(secretKey, name);

                return ComputeRequestCode.SUCCESS.getResponse(Base64.getEncoder().encodeToString(secretKey), request);
            } catch (Exception e) {
                return ComputeRequestCode.INVALID_MODE.getResponse();
            }
        }

    }

    @GET
    @Path("code-validity")
    @Produces(MediaType.APPLICATION_JSON)
    @ProtectedApi
    public Response validateCode(@QueryParam("code") String code,
                                 @QueryParam("key") String key,
                                 @QueryParam("mode") String mode) {

        ValidateCode result;
        logger.trace("validateCode WS operation called");

        if (Stream.of(code, key, mode).anyMatch(Utils::isEmpty)) {
            result = ValidateCode.MISSING_PARAMS;
        } else {
            try {
                IOTPAlgorithm as = otpService.getAlgorithmService(OTPType.valueOf(mode.toUpperCase()));
                String uid = as.getExternalUid(Base64.getDecoder().decode(key), code);
                if (uid == null) {
                    result = ValidateCode.NO_MATCH;
                } else {
                    keyExternalUidMapping.put(key, uid);
                    result = ValidateCode.MATCH;
                }
            } catch (Exception e) {
                result = ValidateCode.INVALID_MODE;
            }
        }
        return result.getResponse();

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
    public Response finishEnrollment(NamedCredential credential,
                                     @PathParam("userid") String userId) {

        logger.trace("finishEnrollment WS operation called");
        String nickName = Optional.ofNullable(credential).map(NamedCredential::getNickName).orElse(null);
        String key = Optional.ofNullable(credential).map(NamedCredential::getKey).orElse(null);

        FinishCode result;
        OTPDevice device = null;

        if (Stream.of(nickName, key).anyMatch(Utils::isEmpty)) {
            result = FinishCode.MISSING_PARAMS;
        } else {
            long now = System.currentTimeMillis();
            String value = keyExternalUidMapping.get(key);
            if (value == null) {
                result = FinishCode.NO_MATCH_OR_EXPIRED;
            } else {
                device = new OTPDevice();
                device.setUid(value);
                device.setAddedOn(now);
                device.setNickName(nickName);
                device.setSoft(true);

                if (otpService.addDevice(userId, device)) {
                    result = FinishCode.SUCCESS;
                    keyExternalUidMapping.remove(key);
                } else {
                    result = FinishCode.FAILED;
                    device = null;
                }
            }
        }
        return result.getResponse(device);

    }

    @PostConstruct
    private void inited() {
        keyExternalUidMapping = ExpiringMap.builder()
                .maxSize(MAX_STORED_ENTRIES).expiration(TIME_WINDOW_DEFAULT, TimeUnit.MINUTES).build();
    }

}
