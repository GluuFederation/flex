/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.plugins.authnmethod.rs.status.otp;

import com.fasterxml.jackson.databind.ObjectMapper;

import javax.ws.rs.core.Response;
import java.util.LinkedHashMap;
import java.util.Map;

import static javax.ws.rs.core.Response.Status.BAD_REQUEST;
import static javax.ws.rs.core.Response.Status.OK;

/**
 * @author jgomer
 */
public enum ComputeRequestCode {
    NO_DISPLAY_NAME,
    INVALID_MODE,
    SUCCESS;

    private static ObjectMapper MAPPER = new ObjectMapper();

    private String getEntity(String key, String request) {

        String json;
        try {
            Map<String, Object> map = new LinkedHashMap<>();    //Ensure data can be received in the same order as here
            map.put("code", toString());
            if (this.equals(SUCCESS)) {
                map.put("key", key);
                map.put("request", request);
            }
            json = MAPPER.writeValueAsString(map);
        } catch (Exception e) {
            json = "{}";
        }
        return json;

    }

    public Response getResponse(String key, String request) {

        Response.Status httpStatus;
        switch (this) {
            case NO_DISPLAY_NAME:
                httpStatus = BAD_REQUEST;
                break;
            default:
                httpStatus = OK;
        }
        return Response.status(httpStatus).entity(getEntity(key, request)).build();

    }

    public Response getResponse() {
        return getResponse(null, null);
    }

}
