package org.gluu.casa.plugins.authnmethod.rs.status.u2f;

import org.gluu.casa.misc.Utils;

import javax.ws.rs.core.Response;
import java.util.Collections;

import static javax.ws.rs.core.Response.Status.*;

/**
 * @author jgomer
 */
public enum RegisterMessageCode {
    NO_USER_ID,
    UNKNOWN_USER_ID,
    SUCCESS,
    FAILED;

    public Response getResponse(String request) {

        String json;
        Response.Status httpStatus;

        if (equals(SUCCESS)) {
            httpStatus = OK;
            json = request;
        } else {
            if (equals(UNKNOWN_USER_ID)){
                httpStatus = NOT_FOUND;
            } else {
                httpStatus = equals(FAILED) ? INTERNAL_SERVER_ERROR : BAD_REQUEST;
            }
            json = Utils.jsonFromObject(Collections.singletonMap("code", toString()));
        }
        return Response.status(httpStatus).entity(json).build();

    }

}
