package org.gluu.casa.plugins.authnmethod.service.otp;

/**
 * @author jgomer
 */
public interface IOTPAlgorithm {

    byte[] generateSecretKey();

    String generateSecretKeyUri(byte[] secretKey, String displayName);

    String getExternalUid(byte[] secretKey, String code);

}
