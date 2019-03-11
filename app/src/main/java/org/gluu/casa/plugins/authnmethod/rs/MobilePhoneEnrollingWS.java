package org.gluu.casa.plugins.authnmethod.rs;

import net.jodah.expiringmap.ExpiringMap;
import org.gluu.casa.core.PersistenceService;
import org.gluu.casa.core.model.Person;
import org.gluu.casa.core.pojo.VerifiedMobile;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.plugins.authnmethod.OTPSmsExtension;
import org.gluu.casa.plugins.authnmethod.rs.status.otp.FinishCode;
import org.gluu.casa.plugins.authnmethod.rs.status.sms.SendCode;
import org.gluu.casa.plugins.authnmethod.rs.status.sms.ValidateCode;
import org.gluu.casa.plugins.authnmethod.service.MobilePhoneService;
import org.gluu.casa.plugins.authnmethod.service.SMSDeliveryStatus;
import org.gluu.casa.rest.ProtectedApi;
import org.slf4j.Logger;
import org.zkoss.util.resource.Labels;

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

import static org.gluu.casa.plugins.authnmethod.service.SMSDeliveryStatus.SUCCESS;

/**
 * @author jgomer
 */
@ApplicationScoped
@Path("/enrollment/" + OTPSmsExtension.ACR)
public class MobilePhoneEnrollingWS {

    private static final String SEPARATOR = ",";
    private static final int TIME_WINDOW_DEFAULT = 2;
    private static final int MAX_STORED_ENTRIES = 1000;   //one thousand entries stored at most

    @Inject
    private Logger logger;

    @Inject
    private MobilePhoneService mobilePhoneService;

    @Inject
    private PersistenceService persistenceService;

    private Map<String, String> recentCodes;

    @GET
    @Path("send-code")
    @Produces(MediaType.APPLICATION_JSON)
    @ProtectedApi
    public Response sendCode(@QueryParam("number") String number,
                             @QueryParam("userid") String userId) {

        SendCode result;
        String message = null;
        logger.trace("sendCode WS operation called");

        if (Stream.of(number, userId).anyMatch(Utils::isEmpty)) {
            result = SendCode.MISSING_PARAMS;
        } else if (persistenceService.get(Person.class, persistenceService.getPersonDn(userId)) == null) {
            result = SendCode.UNKNOWN_USER_ID;
        } else if (mobilePhoneService.isNumberRegistered(number)
                || mobilePhoneService.isNumberRegistered(number.replaceAll("[-\\+\\s]", ""))) {
            result = SendCode.NUMBER_ALREADY_ENROLLED;
        } else {
            try {
                String aCode = Integer.toString(new Double(100000 + Math.random() * 899999).intValue());
                //Compose SMS body
                String body = Labels.getLabel("usr.mobile_sms_body", new String[]{ aCode });

                //Send message (service bean already knows all settings to perform this step)
                SMSDeliveryStatus deliveryStatus = mobilePhoneService.sendSMS(number, body);
                if (deliveryStatus.equals(SUCCESS)) {
                    logger.trace("sendCode. code={}", aCode);
                    recentCodes.put(userId + SEPARATOR + aCode, number);
                    result = SendCode.SUCCESS;
                } else {
                    result = SendCode.FAILURE;
                    message = deliveryStatus.toString();
                }
            } catch (Exception e) {
                logger.error(e.getMessage(), e);
                result = SendCode.FAILURE;
            }
        }
        return result.getResponse(message);

    }

    @GET
    @Path("validate-code")
    @Produces(MediaType.APPLICATION_JSON)
    @ProtectedApi
    public Response validateCode(@QueryParam("code") String code,
                                 @QueryParam("userid") String userId) {

        ValidateCode result;
        logger.trace("validateCode WS operation called");

        if (Stream.of(code, userId).anyMatch(Utils::isEmpty)) {
            result = ValidateCode.MISSING_PARAMS;
        } else {
            String value = recentCodes.get(userId + SEPARATOR + code);
            result = value == null ? ValidateCode.NO_MATCH_OR_EXPIRED : ValidateCode.MATCH;
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
        String code = Optional.ofNullable(credential).map(NamedCredential::getKey).orElse(null);

        FinishCode result;
        VerifiedMobile phone = null;

        if (Stream.of(nickName, code).anyMatch(Utils::isEmpty)) {
            //One or more params are missing
            result = FinishCode.MISSING_PARAMS;
        } else {
            String key = userId + SEPARATOR + code;
            long now = System.currentTimeMillis();
            String value = recentCodes.get(key);

            if (value == null) {
                //No match
                result = FinishCode.NO_MATCH_OR_EXPIRED;
            } else {
                //data still valid
                phone = new VerifiedMobile();
                phone.setNickName(nickName);
                phone.setAddedOn(now);
                phone.setNumber(value);

                if (mobilePhoneService.addPhone(userId, phone)) {
                    result = FinishCode.SUCCESS;
                    recentCodes.remove(key);
                } else {
                    result = FinishCode.FAILED;
                    phone = null;
                }
            }
        }
        return result.getResponse(phone);

    }

    @PostConstruct
    private void inited() {
        logger.trace("Service inited");
        recentCodes = ExpiringMap.builder()
                .maxSize(MAX_STORED_ENTRIES).expiration(TIME_WINDOW_DEFAULT, TimeUnit.MINUTES).build();
    }

}
