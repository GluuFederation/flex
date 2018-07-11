/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.credmanager.plugins.authnmethod.rs;

import org.gluu.credmanager.core.pojo.VerifiedMobile;
import org.gluu.credmanager.misc.ExpirationMap;
import org.gluu.credmanager.misc.Utils;
import org.gluu.credmanager.plugins.authnmethod.OTPSmsExtension;
import org.gluu.credmanager.plugins.authnmethod.rs.status.sms.FinishCode;
import org.gluu.credmanager.plugins.authnmethod.rs.status.sms.SendCode;
import org.gluu.credmanager.plugins.authnmethod.rs.status.sms.ValidateCode;
import org.gluu.credmanager.plugins.authnmethod.service.MobilePhoneService;
import org.gluu.credmanager.service.ILdapService;
import org.slf4j.Logger;
import org.zkoss.util.Pair;
import org.zkoss.util.resource.Labels;

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
import java.util.stream.Stream;

/**
 * @author jgomer
 */
//This REST service is temporarily disabled, will be back in version 4
//@ApplicationScoped
//@Path("/enroll/{userid}/" + OTPSmsExtension.ACR)
public class MobilePhoneEnrollingWS {

    private static final String SEPARATOR = ",";

    @Inject
    private Logger logger;

    @Inject
    private ILdapService ldapService;

    @Inject
    private MobilePhoneService mobilePhoneService;

    private ExpirationMap<String, String> recentCodes;

    @PostConstruct
    private void inited() {
        recentCodes = new ExpirationMap<>();
    }

    @GET
    @Path("send")
    @Produces(MediaType.APPLICATION_JSON)
    public Response sendCode(@QueryParam("number") String number,
                             @PathParam("userid") String userId) {

        SendCode result;
        logger.trace("sendCode WS operation called");

        if (Utils.isEmpty(number)) {
            result = SendCode.NO_NUMBER;
        } else if (mobilePhoneService.isNumberRegistered(number)
                || mobilePhoneService.isNumberRegistered(number.replaceAll("[-\\+\\s]", ""))) {
            result = SendCode.NUMBER_ALREADY_ENROLLED;
        } else {
            try {
                String aCode = Integer.toString(new Double(100000 + Math.random() * 899999).intValue());
                //Compose SMS body
                String body = ldapService.getOrganization().getDisplayName();
                body = Labels.getLabel("usr.mobile_sms_body", new String[]{ body, aCode });

                //Send message (service bean already knows all settings to perform this step)
                result = mobilePhoneService.sendSMS(number, body);

                if (SendCode.SUCCESS.equals(result)) {
                    logger.trace("sendCode. code={}", aCode);
                    recentCodes.put(userId + SEPARATOR + aCode, number);
                }
            } catch (Exception e) {
                logger.error(e.getMessage(), e);
                result = SendCode.WS_SERVICE_ERROR;
            }
        }
        return result.getResponse();

    }

    @GET
    @Path("validate")
    @Produces(MediaType.APPLICATION_JSON)
    public Response validateCode(@QueryParam("code") String code,
                                 @PathParam("userid") String userId) {

        ValidateCode result;
        logger.trace("validateCode WS operation called");

        if (Utils.isEmpty(code)) {
            result = ValidateCode.NO_CODE;
        } else {
            Pair<String, Boolean> pair = recentCodes.getWithExpired(userId + SEPARATOR + code, System.currentTimeMillis());
            if (pair == null) {
                //no match
                result = ValidateCode.NO_MATCH;
            } else {
                if (pair.getY()) {
                    result = ValidateCode.EXPIRED;
                } else {
                    result = ValidateCode.MATCH;
                }
            }
        }
        return result.getResponse();

    }

    @GET
    @Path("finish")
    @Produces(MediaType.APPLICATION_JSON)
    public Response finishEnrollment(@QueryParam("nick") String nickName,
                                     @QueryParam("code") String code,
                                     @PathParam("userid") String userId) {

        FinishCode result;
        VerifiedMobile phone = null;
        logger.trace("finishEnrollment WS operation called");

        if (Stream.of(nickName, code).anyMatch(Utils::isEmpty)) {
            //One or more params are missing
            result = FinishCode.MISSING_PARAMS;
        } else {
            String key = userId + SEPARATOR + code;
            long now = System.currentTimeMillis();
            Pair<String, Boolean> pair = recentCodes.getWithExpired(key, now);

            if (pair == null) {
                //No match
                result = FinishCode.NO_MATCH;
            } else {
                if (pair.getY()) {
                    //too much time elapsed to finish enrollment
                    result = FinishCode.EXPIRED;
                } else {
                    //data still valid
                    phone = new VerifiedMobile();
                    phone.setNickName(nickName);
                    phone.setAddedOn(now);
                    phone.setNumber(pair.getX());

                    if (mobilePhoneService.addPhone(userId, phone)) {
                        result = FinishCode.SUCCESS;
                        recentCodes.remove(key);
                    } else {
                        result = FinishCode.FAILED;
                        phone = null;
                    }
                }
            }
        }
        return result.getResponse(phone);

    }

}
