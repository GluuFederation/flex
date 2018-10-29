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
import static javax.ws.rs.core.Response.Status.OK;

/**
 * @author jgomer
 */
public enum ValidateCode {
    MATCH,
    NO_MATCH_OR_EXPIRED,
    NO_CODE;

    public Response getResponse() {

        String json = null;
        Response.Status httpStatus;

        if (equals(NO_CODE)) {
            httpStatus = BAD_REQUEST;
        } else {
            httpStatus = OK;
        }
        json = Utils.jsonFromObject(Collections.singletonMap("code", toString()));
        return Response.status(httpStatus).entity(json).build();

    }

}
