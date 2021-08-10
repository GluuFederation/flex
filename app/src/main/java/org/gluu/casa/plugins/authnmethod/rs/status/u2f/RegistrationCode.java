package org.gluu.casa.plugins.authnmethod.rs.status.u2f;

import org.gluu.casa.core.pojo.FidoDevice;
import org.gluu.casa.misc.Utils;

import javax.ws.rs.core.Response;
import java.util.Collections;

import static javax.ws.rs.core.Response.Status.BAD_REQUEST;
import static javax.ws.rs.core.Response.Status.CREATED;
import static javax.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR;

/**
 * @author jgomer
 */
public enum RegistrationCode {
    NO_MATCH_OR_EXPIRED,
    UNKNOWN_USER_ID,
    SUCCESS,
    FAILED;

    public Response getResponse(FidoDevice securityKey) {

        String json;
        Response.Status httpStatus;

        if (equals(SUCCESS)) {
            httpStatus = CREATED;
            json = Utils.jsonFromObject(securityKey);
        } else {
            httpStatus = equals(FAILED) ? INTERNAL_SERVER_ERROR : BAD_REQUEST;
            json = Utils.jsonFromObject(Collections.singletonMap("code", toString()));
        }
        return Response.status(httpStatus).entity(json).build();

    }

}
