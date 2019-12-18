package org.gluu.casa.plugins.authnmethod.service;

/**
 * Created by jgomer on 2017-07-24.
 * An enumeration that holds the response codes that a u2f device registration request may output
 */
public enum U2fClientCodes {
    OTHER_ERROR, BAD_REQUEST, CONFIGURATION_UNSUPPORTED, DEVICE_INELIGIBLE, TIMEOUT;

    public static U2fClientCodes get(int ord) {
        return U2fClientCodes.values()[ord-1];
    }

}
