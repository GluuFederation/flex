package org.gluu.casa.plugins.authnmethod.service.otp;

import com.google.common.io.BaseEncoding;
import com.lochbridge.oath.otp.HmacShaAlgorithm;
import com.lochbridge.oath.otp.TOTP;
import com.lochbridge.oath.otp.TOTPBuilder;
import com.lochbridge.oath.otp.keyprovisioning.OTPAuthURIBuilder;
import com.lochbridge.oath.otp.keyprovisioning.OTPKey;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.plugins.authnmethod.conf.otp.TOTPConfig;
import org.slf4j.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.inject.Named;
import java.util.concurrent.TimeUnit;

import static com.lochbridge.oath.otp.keyprovisioning.OTPKey.OTPType;

/**
 * Created by jgomer on 2018-06-28.
 * An app. scoped bean that encapsulates logic related to generating and validating OTP keys.
 * See https://tools.ietf.org/html/rfc6238 and https://tools.ietf.org/html/rfc4226.
 */
@Named
@ApplicationScoped
public class TOTPAlgorithmService implements IOTPAlgorithm {

    @Inject
    private Logger logger;

    private TOTPConfig conf;

    private String issuer;

    private HmacShaAlgorithm hmacShaAlgorithm;

    public void init(TOTPConfig conf, String issuer) {
        this.issuer = issuer;
        this.conf = conf;
        hmacShaAlgorithm = HmacShaAlgorithm.from("Hmac" + conf.getHmacShaAlgorithm().toUpperCase());
    }

    public byte[] generateSecretKey() {
        return Utils.randomBytes(conf.getKeyLength());
    }

    public String generateSecretKeyUri(byte[] secretKey, String displayName) {

        String secretKeyBase32 = BaseEncoding.base32().omitPadding().encode(secretKey);
        OTPKey otpKey = new OTPKey(secretKeyBase32, OTPType.TOTP);

        OTPAuthURIBuilder uribe = OTPAuthURIBuilder.fromKey(otpKey).label(displayName);
        uribe = uribe.issuer(issuer).digits(conf.getDigits());
        uribe = uribe.timeStep(TimeUnit.SECONDS.toMillis(conf.getTimeStep()));

        logger.trace("Generating secret key URI");
        return uribe.build().toUriString();

    }

    public String getExternalUid(byte[] secretKey, String code) {

        return validateKey(secretKey, code)
                ? String.format("%s:%s", OTPType.TOTP.getName().toLowerCase(), BaseEncoding.base64Url().encode(secretKey))
                : null;
    }

    private boolean validateKey(byte[] secretKey, String otpCode) {
        TOTPBuilder builder = TOTP.key(secretKey).digits(conf.getDigits()).hmacSha(hmacShaAlgorithm);
        String localTotpKey = builder.timeStep(TimeUnit.SECONDS.toMillis(conf.getTimeStep())).build().value();
        return otpCode.equals(localTotpKey);
    }

}
