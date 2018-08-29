/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.plugins.authnmethod.rs.status.sms;

import org.gluu.casa.misc.Utils;

import javax.ws.rs.core.Response;
import java.util.Collections;

import static javax.ws.rs.core.Response.Status.BAD_REQUEST;
import static javax.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR;
import static javax.ws.rs.core.Response.Status.OK;

/**
 * All status codes are returned in a 200 (OK) HTTP response, except for the following:
 * <ul>
 *     <li>{@link #NO_NUMBER}: 400 (BAD REQUEST)</li>
 *     <li>{@link #APP_SETUP_ERROR}, {@link #SMS_SERVICE_ERROR}, and {@link #WS_SERVICE_ERROR}: 500 (INTERNAL SERVER ERROR)</li>
 * </ul>
 * @author jgomer
 */
public enum SendCode {
    /**
     * The underlying Twilio API call returned a status other than {@link #UNDELIVERED} or {@link #DELIVERY_FAILED}.
     * See Twilio <a href="https://www.twilio.com/docs/api/messaging/message#message-status-values">status values</a>.
     * <p>Recall that a success status does not guarantee the recipient actually receiving a message.</p>
     */
    SUCCESS,
    /**
     * The API call received no phone number to send the message to
     */
    NO_NUMBER,
    /**
     * The phone number supplied is already enrolled and should not receive a SMS
     */
    NUMBER_ALREADY_ENROLLED,
    /**
     * The underlying Twilio API call returned a status of "undelivered".
     * See Twilio <a href="https://www.twilio.com/docs/api/messaging/message#message-status-values">status values</a>.
     */
    UNDELIVERED,
    /**
     * The underlying Twilio API call returned a status of "failed".
     * See Twilio <a href="https://www.twilio.com/docs/api/messaging/message#message-status-values">status values</a>.
     */
    DELIVERY_FAILED,
    /**
     * The message was not delivered due to a misconfiguration in the connection with the underlying Twilio service
     */
    APP_SETUP_ERROR,
    /**
     * The underlying Twilio API call threw an exception. This may happen in a variety of situations, for instance, providing
     * a non-valid phone number (e.g 555-1234-AB)
     */
    SMS_SERVICE_ERROR,
    /**
     * Any other error not already listed
     */
    WS_SERVICE_ERROR;

    private String getEntity() {
        return Utils.jsonFromObject(Collections.singletonMap("code", toString()));
    }

    public Response getResponse() {

        Response.Status httpStatus;
        switch (this) {
            case NO_NUMBER:
                httpStatus = BAD_REQUEST;
                break;
            case APP_SETUP_ERROR:
            case SMS_SERVICE_ERROR:
            case WS_SERVICE_ERROR:
                httpStatus = INTERNAL_SERVER_ERROR;
                break;
            default:
                httpStatus = OK;
        }
        return Response.status(httpStatus).entity(getEntity()).build();

    }

}
