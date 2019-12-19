package org.gluu.casa.plugins.accounts.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.gluu.casa.core.model.CustomScript;
import org.gluu.casa.core.pojo.User;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.plugins.accounts.pojo.*;
import org.gluu.casa.service.IPersistenceService;
import org.gluu.casa.service.ISessionContext;
import org.gluu.oxauth.model.common.WebKeyStorage;
import org.gluu.oxauth.model.configuration.AppConfiguration;
import org.gluu.oxauth.model.crypto.CryptoProviderFactory;
import org.gluu.oxauth.model.jwt.Jwt;
import org.gluu.util.security.StringEncrypter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.util.resource.Labels;
import org.zkoss.web.servlet.http.Encodes;

import javax.ws.rs.*;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import java.net.URI;
import java.net.URL;
import java.util.*;

/**
 * @author jgomer
 */
@Path("/idp-linking")
public class PassportLinkingService {

    private static final String CE_SALT_PATH = "/etc/gluu/conf/salt";

    private Logger logger = LoggerFactory.getLogger(getClass());

    private ObjectMapper mapper = new ObjectMapper();

    private IPersistenceService persistenceService;

    private StringEncrypter stringEncrypter;

    private Map<ProviderType, PassportScriptProperties> passportProperties;

    @Context
    private UriInfo uriInfo;

    public PassportLinkingService() {

        try {
            logger.info("Creating an instance of PassportLinkingService");
            mapper = new ObjectMapper();
            persistenceService = Utils.managedBean(IPersistenceService.class);
            stringEncrypter = Utils.stringEncrypter(CE_SALT_PATH);

            passportProperties = new HashMap<>();
            for (ProviderType pt : ProviderType.values()) {

                PassportScriptProperties psp = new PassportScriptProperties();
                CustomScript script = new CustomScript();
                script.setDisplayName(pt.getAcr());
                script.setBaseDn(persistenceService.getCustomScriptsDn());

                List<CustomScript> list = persistenceService.find(script);
                script = list.size() > 0  ? list.get(0) : null;

                if (script != null) {
                    Map<String, String> props = Utils.scriptConfigPropertiesAsMap(script);
                    psp.setKeyStoreFile(props.get("key_store_file"));
                    psp.setKeyStorePassword(props.get("key_store_password"));
                    passportProperties.put(pt, psp);
                }
            }

        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            logger.warn("Service for linking external identities may not work properly");
        }

    }

    @GET
    public Response processError(@QueryParam("failure") String msg) throws Exception {
        logger.warn("An error occurred: {}", msg);
        return Response.serverError().entity(msg).build();
    }

    @POST
    @Path("{provider}")
    public Response doLink(@FormParam("user") String userJwt, @PathParam("provider") String provider) throws Exception {

        LinkingSummary summary = new LinkingSummary();
        String msg = null;

        ISessionContext sessionContext = Utils.managedBean(ISessionContext.class);
        String userId = Optional.ofNullable(sessionContext.getLoggedUser()).map(User::getId).orElse(null);
        logger.info("Linking provider {} to user {} ...", provider, userId);

        try {
            if (userId == null) {
                msg = Labels.getLabel("sociallogin.link_result.session_lost");
                logger.warn(msg);

            } else if (PendingLinks.contains(userId, provider)) {
                Provider prv = AvailableProviders.get().stream().filter(p -> p.getId().equals(provider)).findFirst().get();
                PassportScriptProperties psp = passportProperties.get(prv.getScriptType());

                Jwt jwt = validateJWT(userJwt, psp);
                if (jwt != null) {
                    logger.info("JWT validated successfully\n{}", jwt);
                    String profile = jwt.getClaims().getClaimAsString("data");

                    logger.info("Decrypting user profile data...");
                    profile = stringEncrypter.decrypt(profile);
                    String uid = mapper.readTree(profile).get("uid").get(0).asText();

                    //Verify it's not already enrolled by someone
                    if (!prv.getEnrollmentManager().isAssigned(uid)) {
                        summary.setProvider(provider);
                        summary.setUid(uid);
                    } else {
                        msg = Labels.getLabel("sociallogin.link_result.already_taken", new String[]{uid, provider});
                        logger.warn(msg);
                    }
                } else {
                    msg = Labels.getLabel("sociallogin.link_result.validation_failed");
                    logger.error(msg);
                }
            } else {
                msg = Labels.getLabel("sociallogin.link_result.unexpected_provider", new String[]{provider});
                logger.warn(msg);
            }
        } catch (Exception e) {
            msg = e.getMessage();
            logger.error(msg, e);
        }
        if (msg != null) {
            summary.setErrorMessage(msg);
        }

        //Removes the /idp-linking/{provider} portion
        String url = uriInfo.getAbsolutePath().toString();
        url+= "/../../account-linking-result.zul?provider=" + Encodes.encodeURIComponent(provider);
        URI uri = new URL(url.replaceFirst("/rest", "")).toURI();

        PendingLinks.add(userId, provider, summary);
        logger.debug("Redirecting to {}", uri.toString());
        return Response.seeOther(uri).build();

    }

    private Jwt validateJWT(String encodedJWT, PassportScriptProperties properties) {

        try {
            //Verify JWT
            Jwt jwt = Jwt.parse(encodedJWT);
            AppConfiguration appCfg = new AppConfiguration();
            appCfg.setWebKeysStorage(WebKeyStorage.KEYSTORE);
            appCfg.setKeyStoreFile(properties.getKeyStoreFile());
            appCfg.setKeyStoreSecret(properties.getKeyStorePassword());
            appCfg.setKeyRegenerationEnabled(false);

            return CryptoProviderFactory.getCryptoProvider(appCfg).verifySignature(jwt.getSigningInput(), jwt.getEncodedSignature(),
                    jwt.getHeader().getKeyId(), null, null, jwt.getHeader().getAlgorithm()) ? jwt : null;
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return null;
        }

    }

}
