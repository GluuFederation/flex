package org.gluu.casa.plugins.authnmethod.rs.status.sms;

import org.gluu.casa.misc.Utils;

import javax.ws.rs.core.Response;

import java.util.LinkedHashMap;
import java.util.Map;

import static javax.ws.rs.core.Response.Status.BAD_REQUEST;
import static javax.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR;
import static javax.ws.rs.core.Response.Status.OK;

/**
 * @author jgomer
 */
public enum SendCode {
    SUCCESS,
    MISSING_PARAMS,
    UNKNOWN_USER_ID,
    NUMBER_ALREADY_ENROLLED,
    FAILURE;

    public Response getResponse(String extraMessage) {

        String json = null;
        Response.Status httpStatus;

        if (equals(SUCCESS)) {
            httpStatus = OK;
        } else {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("code", toString());

            if (equals(FAILURE)) {
                map.put("cause", extraMessage);
            }

            if (equals(MISSING_PARAMS)) {
                httpStatus = BAD_REQUEST;
            } else {
                httpStatus = INTERNAL_SERVER_ERROR;
            }
            json = Utils.jsonFromObject(map);
        }
        return Response.status(httpStatus).entity(json).build();

    }

}
