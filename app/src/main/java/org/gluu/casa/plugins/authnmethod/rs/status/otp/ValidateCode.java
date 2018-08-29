/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.plugins.authnmethod.rs.status.otp;

import org.gluu.casa.misc.Utils;

import javax.ws.rs.core.Response;
import java.util.Collections;

import static javax.ws.rs.core.Response.Status.BAD_REQUEST;
import static javax.ws.rs.core.Response.Status.OK;

/**
 * @author jgomer
 */
public enum ValidateCode {
    MISSING_PARAMS,
    NO_MATCH,
    SUCCESS;

    private String getEntity() {
        return Utils.jsonFromObject(Collections.singletonMap("code", toString()));
    }

    public Response getResponse() {

        Response.Status httpStatus;
        switch (this) {
            case MISSING_PARAMS:
                httpStatus = BAD_REQUEST;
            default:
                httpStatus = OK;
        }
        return Response.status(httpStatus).entity(getEntity()).build();

    }

}
