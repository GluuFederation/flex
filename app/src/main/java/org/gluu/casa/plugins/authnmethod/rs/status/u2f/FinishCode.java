/*
 * casa is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.plugins.authnmethod.rs.status.u2f;

import org.gluu.casa.core.pojo.FidoDevice;
import org.gluu.casa.misc.Utils;

import javax.ws.rs.core.Response;
import java.util.Collections;

import static javax.ws.rs.core.Response.Status.BAD_REQUEST;
import static javax.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR;
import static javax.ws.rs.core.Response.Status.OK;

/**
 * @author jgomer
 */
public enum FinishCode {
    MISSING_PARAMS,
    NO_MATCH_OR_EXPIRED,
    FAILED,
    SUCCESS;

    public Response getResponse() {

        String json = null;
        Response.Status httpStatus;

        if (equals(SUCCESS)) {
            httpStatus = OK;
        } else {
            json = Utils.jsonFromObject(Collections.singletonMap("code", toString()));
            httpStatus = equals(MISSING_PARAMS) ? BAD_REQUEST : INTERNAL_SERVER_ERROR;
        }
        return Response.status(httpStatus).entity(json).build();

    }

}
