package org.gluu.casa.plugins.authnmethod.rs.status.otp;

import org.gluu.casa.misc.Utils;

import javax.ws.rs.core.Response;
import java.util.Collections;

import static javax.ws.rs.core.Response.Status.BAD_REQUEST;
import static javax.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR;
import static javax.ws.rs.core.Response.Status.OK;

/**
 * @author jgomer
 */
public enum ValidateCode {
    MISSING_PARAMS,
    NO_MATCH,
    INVALID_MODE,
    FAILURE,
    MATCH;

    public Response getResponse() {

        String json;
        Response.Status httpStatus;

        if (equals(MATCH) || equals(NO_MATCH)) {
            httpStatus = OK;
        } else if (equals(FAILURE)){
            httpStatus = INTERNAL_SERVER_ERROR;
        } else {
            httpStatus = BAD_REQUEST;
        }
        json = Utils.jsonFromObject(Collections.singletonMap("code", toString()));
        return Response.status(httpStatus).entity(json).build();

    }

}
