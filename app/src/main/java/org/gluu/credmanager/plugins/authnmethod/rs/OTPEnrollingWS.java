/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.credmanager.plugins.authnmethod.rs;

import org.gluu.credmanager.core.pojo.OTPDevice;
import org.gluu.credmanager.misc.ExpirationMap;
import org.gluu.credmanager.misc.Utils;
import org.gluu.credmanager.plugins.authnmethod.OTPExtension;
import org.gluu.credmanager.plugins.authnmethod.rs.status.otp.ComputeRequestCode;
import org.gluu.credmanager.plugins.authnmethod.rs.status.otp.FinishCode;
import org.gluu.credmanager.plugins.authnmethod.rs.status.otp.ValidateCode;
import org.gluu.credmanager.plugins.authnmethod.service.OTPService;
import org.gluu.credmanager.plugins.authnmethod.service.otp.IOTPAlgorithm;
import org.gluu.credmanager.service.ILdapService;
import org.slf4j.Logger;
import org.zkoss.util.Pair;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Base64;
import java.util.stream.Stream;

import static com.lochbridge.oath.otp.keyprovisioning.OTPKey.OTPType;

/**
 * @author jgomer
 */
//This REST service is temporarily disabled, will be back in version 4
//@ApplicationScoped
//@Path("/enroll/{userid}/" + OTPExtension.ACR)
public class OTPEnrollingWS {

    @Inject
    private Logger logger;

    @Inject
    private ILdapService ldapService;

    @Inject
    private OTPService otpService;

    private ExpirationMap<String, String> keyExternalUidMapping;

    @PostConstruct
    private void inited() {
        keyExternalUidMapping = new ExpirationMap<>();
    }

    @GET
    @Path("qrrequest")
    @Produces(MediaType.APPLICATION_JSON)
    public Response computeRequest(@QueryParam("displayName") String name,
                                   @QueryParam("mode") String mode,
                                   @PathParam("userid") String userId) {

        ComputeRequestCode result;
        logger.trace("computeRequest WS operation called");

        if (Utils.isEmpty(name)) {
            return ComputeRequestCode.NO_DISPLAY_NAME.getResponse();
        } else {
            try {
                IOTPAlgorithm as = otpService.getAlgorithmService(OTPType.valueOf(mode.toUpperCase()));
                byte[] secretKey = as.generateSecretKey();
                String request = as.generateSecretKeyUri(secretKey, name);

                result = ComputeRequestCode.SUCCESS;
                return result.getResponse(Base64.getEncoder().encodeToString(secretKey), request);
            } catch (Exception e) {
                return ComputeRequestCode.INVALID_MODE.getResponse();
            }
        }

    }

    @GET
    @Path("validate")
    @Produces(MediaType.APPLICATION_JSON)
    public Response validateCode(@QueryParam("code") String code,
                                 @QueryParam("key") String key,
                                 @QueryParam("mode") String mode,
                                 @PathParam("userid") String userId) {

        ValidateCode result;
        logger.trace("validateCode WS operation called");

        if (Stream.of(code, key).anyMatch(Utils::isEmpty)) {
            result = ValidateCode.MISSING_PARAMS;
        } else {
            try {
                IOTPAlgorithm as = otpService.getAlgorithmService(OTPType.valueOf(mode.toUpperCase()));
                String uid = as.getExternalUid(Base64.getDecoder().decode(key), code);
                if (uid == null) {
                    result = ValidateCode.NO_MATCH;
                } else {
                    keyExternalUidMapping.put(key, uid);
                    result = ValidateCode.SUCCESS;
                }
            } catch (Exception e) {
                return ComputeRequestCode.INVALID_MODE.getResponse();
            }
        }
        return result.getResponse();

    }

    @GET
    @Path("finish")
    @Produces(MediaType.APPLICATION_JSON)
    public Response finishEnrollment(@QueryParam("nick") String nickName,
                                     @QueryParam("key") String key,
                                     @PathParam("userid") String userId) {

        FinishCode result;
        OTPDevice device = null;
        logger.trace("finishEnrollment WS operation called");

        if (Stream.of(nickName, key).anyMatch(Utils::isEmpty)) {
            result = FinishCode.MISSING_PARAMS;
        } else {
            long now = System.currentTimeMillis();
            Pair<String, Boolean> pair = keyExternalUidMapping.getWithExpired(key, now);
            if (pair == null) {
                result = FinishCode.NO_MATCH;
            } else {
                if (pair.getY()) {
                    result = FinishCode.EXPIRED;
                } else {
                    device = new OTPDevice();
                    device.setUid(pair.getX());
                    device.setAddedOn(now);
                    device.setNickName(nickName);

                    if (otpService.addDevice(userId, device)) {
                        result = FinishCode.SUCCESS;
                        keyExternalUidMapping.remove(key);
                    } else {
                        result = FinishCode.FAILED;
                        device = null;
                    }
                }
            }
        }
        return result.getResponse(device);

    }

}
