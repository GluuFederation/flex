/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.plugins.authnmethod.rs.status.otp;

import org.gluu.casa.core.pojo.OTPDevice;
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

    private String getEntity(OTPDevice device) {

        Map<String, Object> map = new LinkedHashMap<>();    //Ensure data can be received in the same order as here
        map.put("code", toString());
        if (device != null) {
            map.put("data", device);
        }
        return Utils.jsonFromObject(map);

    }

    public Response getResponse(OTPDevice device) {

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
        return Response.status(httpStatus).entity(getEntity(device)).build();

    }

}
