package org.gluu.casa.plugins.cert.vm;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.gluu.casa.core.pojo.User;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.misc.WebUtils;
import org.gluu.casa.plugins.cert.service.CertService;
import org.gluu.casa.plugins.cert.service.UserCertificateMatch;
import org.gluu.casa.service.IPersistenceService;
import org.gluu.casa.service.ISessionContext;
import org.gluu.oxauth.model.util.CertUtils;
import org.gluu.util.security.StringEncrypter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.bind.annotation.Init;
import org.zkoss.util.Pair;
import org.zkoss.zk.ui.select.annotation.WireVariable;

import javax.servlet.http.Cookie;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import java.security.cert.X509Certificate;

public class CertAuthenticationViewModel {

    private static final String RND_KEY = "key";
    private static final String CERT_HEADER = "X-ClientCert";

    private Logger logger = LoggerFactory.getLogger(getClass());
    private CertService certService;
    private StringEncrypter stringEncrypter;

    @WireVariable
    private ISessionContext sessionContext;

    private boolean hasConfigErrors;
    private boolean present;
    private boolean parsed;
    private boolean valid;
    private boolean inCasaSession;
    private UserCertificateMatch userCertMatch;
    private String userId;

    public boolean isPresent() {
        return present;
    }

    public boolean isParsed() {
        return parsed;
    }

    public boolean isValid() {
        return valid;
    }

    public boolean isHasConfigErrors() {
        return hasConfigErrors;
    }

    public boolean isInCasaSession() {
        return inCasaSession;
    }

    public String getUserId() {
        return userId;
    }

    public UserCertificateMatch getUserCertMatch() {
        return userCertMatch;
    }

    //See LocationMatch directive in Apache's https_gluu.conf
    @Init
    public void init() throws Exception {

        logger.info("Loading certificate validation page...");
        User user = sessionContext.getLoggedUser();
        stringEncrypter = Utils.stringEncrypter();

        //Truthy value means usage of this page is in the context of enrollment only (not authentication)
        inCasaSession = user != null;
        logger.info("There is{} user in session", inCasaSession ? "": " no");

        String key = WebUtils.getQueryParam(RND_KEY);
        if (inCasaSession) {
            userId = user.getId();
        } else {
            if (Utils.isEmpty(key)) {
                logger.warn("Expected parameter '{}' not specified in URL.", RND_KEY);
            } else {
                Pair<String, String> pair = getTokens(key);
                key = pair.getX();
                userId = pair.getY();
            }
            if (userId != null) {
                logger.debug("User id is {}", userId);
            } else {
                logger.error("No user ID could be obtained. Aborting...");
                return;
            }
        }

        certService = CertService.getInstance();
        hasConfigErrors = !certService.isHasValidProperties();

        if (hasConfigErrors) {
            logger.info("Configuration errors were detected. Please check the log file and plugin documentation");
            return;
        }

        X509Certificate userCert = processCert();
        //If parsed is true, present is too
        //If valid is true, parsed is too
        userCertMatch = valid ? certService.processMatch(userCert, userId, inCasaSession) : null;

        if (!inCasaSession) {
            logger.debug("Setting cookie with outcome of operation");
            setCookie(key, present, parsed, valid, userCertMatch);

            logger.info("Preparing redirect for completion of authentication flow");
            String url = Utils.managedBean(IPersistenceService.class).getIssuerUrl();
            WebUtils.execRedirect(String.format("%s/oxauth/postlogin.htm", url), true);
        }

    }

    private X509Certificate processCert() {

        X509Certificate clientCert = null;
        String clientCertString = WebUtils.getRequestHeader(CERT_HEADER);

        try {
            if (Utils.isEmpty(clientCertString)) {
                String attribute = "javax.servlet.request.X509Certificate";
                Optional<?> optAttr = Optional.ofNullable(WebUtils.getServletRequest().getAttribute(attribute));

                if (optAttr.isPresent()) {
                    logger.info("Got a certificate in request attribute '{}'", attribute);
                    present = true;
                    clientCert = optAttr.map(X509Certificate[].class::cast).map(certs -> certs[0]).orElse(null);
                }

            } else {
                logger.info("Got a certificate in request header '{}'", CERT_HEADER);
                present = true;
                clientCert = CertUtils.x509CertificateFromPem(clientCertString);
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

        if (clientCert == null) {
            logger.warn("No client certificate was found. Probably the user hit the Cancel button in the browser prompt");
        } else {
            //parsing was successful
            parsed = true;
            //apply applicable validations
            valid = certService.validate(clientCert);
        }

        return clientCert;

    }

    private Pair<String, String> getTokens(String encrypted) {

        Pair<String, String> pair = new Pair<>(null, null);
        try {
            String decrypted = stringEncrypter.decrypt(encrypted);
            String tokens[] = decrypted.split(";");
            return new Pair<>(tokens[0], tokens[1]);

        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return pair;

    }

    private void setCookie(String rndkey, boolean present, boolean parsed, boolean valid, UserCertificateMatch match) {

        try {
            int val = present ? 1 : 0;
            val+= parsed ? 1 : 0;
            val+= valid ? 1 : 0;

            Map<String, Object> map = new LinkedHashMap<>();
            map.put("key", rndkey);
            map.put("status", val);

            if (valid) {
                map.put("match", match.name());
            }

            //value = new String(Base64.getEncoder().encode(value.getBytes()), StandardCharsets.UTF_8);
            String value = new ObjectMapper().writeValueAsString(map);

            Cookie coo = new Cookie("casa-cert-authn", stringEncrypter.encrypt(value));
            coo.setPath("/");
            coo.setSecure(true);
            coo.setHttpOnly(true);
            coo.setMaxAge(10);
            WebUtils.getServletResponse().addCookie(coo);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

    }

}
