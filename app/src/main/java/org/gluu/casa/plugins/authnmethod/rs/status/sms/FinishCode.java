/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.plugins.authnmethod.rs.status.sms;

import org.gluu.casa.core.pojo.VerifiedMobile;
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
public enum FinishCode {
    MISSING_PARAMS,
    NO_MATCH,
    EXPIRED,
    FAILED,
    SUCCESS;

    private String getEntity(VerifiedMobile phone) {

        Map<String, Object> map = new LinkedHashMap<>();    //Ensure data can be received in the same order as here
        map.put("code", toString());
        if (phone != null) {
            map.put("data", phone);
        }
        return Utils.jsonFromObject(map);

    }

    public Response getResponse(VerifiedMobile phone) {

        Response.Status httpStatus;
        switch (this) {
            case MISSING_PARAMS:
                httpStatus = BAD_REQUEST;
                break;
            case FAILED:
                httpStatus = INTERNAL_SERVER_ERROR;
                break;
            default:
                httpStatus = OK;
        }
        return Response.status(httpStatus).entity(getEntity(phone)).build();

    }

}
