package org.gluu.casa.core;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.inject.Named;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.StringUtils;
import org.gluu.casa.core.model.OIDCClient;
import org.gluu.service.cache.CacheInterface;
import org.gluu.casa.conf.MainSettings;
import org.gluu.casa.conf.OxdClientSettings;
import org.gluu.casa.conf.OxdSettings;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.rest.RSUtils;
import org.gluu.oxd.common.params.GetAuthorizationUrlParams;
import org.gluu.oxd.common.params.GetClientTokenParams;
import org.gluu.oxd.common.params.GetLogoutUrlParams;
import org.gluu.oxd.common.params.GetTokensByCodeParams;
import org.gluu.oxd.common.params.GetUserInfoParams;
import org.gluu.oxd.common.params.IParams;
import org.gluu.oxd.common.params.RegisterSiteParams;
import org.gluu.oxd.common.params.RemoveSiteParams;
import org.gluu.oxd.common.params.UpdateSiteParams;
import org.gluu.oxd.common.response.*;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.slf4j.Logger;
import org.zkoss.util.Pair;

import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Stream;

import static org.gluu.casa.core.ConfigurationHandler.DEFAULT_ACR;

/**
 * An app. scoped bean that encapsulates interactions with an oxd-server. Contains methods depicting the steps of the
 * authorization code flow of OpenId Connect spec
 * @author jgomer
 */
@Named
@ApplicationScoped
public class OxdService {

    /*
    The list of scopes required to be able to inspect the claims needed. See attributes of User class
     */
    public static final List<String> REQUIRED_SCOPES = Arrays.asList("openid", "profile", "user_name", "clientinfo", "oxd");

    private final String OXD_SETTINGS_KEY = getClass().getName() + "_oxdSettings";

    private static final int REGISTRATION_WAIT_TIME = 12;	//12 seconds

    @Inject
    private Logger logger;

    @Inject
    private MainSettings settings;

    @Inject
    private PersistenceService persistenceService;

    @Inject
    private CacheInterface storeService;

    @Inject
    private ScopeService scopeService;

    private OxdSettings config;
    private ResteasyClient client;
    private ObjectMapper mapper;

    @PostConstruct
    public void inited() {
        mapper =  new ObjectMapper();
        client = RSUtils.getClient();
    }

    //This method does a best effort to avoid multiple client registrations in a multi node environment
    public boolean initialize() {

        boolean success = false;
        OxdSettings oxdSettings = settings.getOxdSettings();

        try {
            String oxdId = Optional.ofNullable(oxdSettings).map(OxdSettings::getClient)
                    .map(OxdClientSettings::getOxdId).orElse(null);

            if (oxdId == null) {
                if (storeService.get(OXD_SETTINGS_KEY) == null) {
                    //temporarily take the ownership for attempting registration
                    storeService.put(REGISTRATION_WAIT_TIME, OXD_SETTINGS_KEY, true);   //Any non-null value is OK
                    success = initialize(oxdSettings);
                    if (success) {
                        storeService.put(REGISTRATION_WAIT_TIME, OXD_SETTINGS_KEY, mapper.writeValueAsString(oxdSettings));
                    } else {
                        storeService.remove(OXD_SETTINGS_KEY);
                    }
                } else {
                    //Block for some time hoping a registration operation was performed
                    Thread.sleep(TimeUnit.SECONDS.toMillis(REGISTRATION_WAIT_TIME));
                    oxdSettings = mapper.readValue(storeService.get(OXD_SETTINGS_KEY).toString(), new TypeReference<OxdSettings>(){});
                    //If it reaches this point, it means registration took place successfully while sleeping
                    //Simulate initialization
                    success = initialize(oxdSettings);
                }
            } else {
                success = initialize(oxdSettings);
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        if (success) {
            //Replace local copy
            settings.setOxdSettings(oxdSettings);
        }
        return success;

    }

    //This method modifies the param supplied
    private boolean initialize(OxdSettings oxdConfig) {

        boolean success = false;
        if (oxdConfig == null) {
            logger.error("No oxd configuration was provided");
        } else {
            boolean missing = Stream.of(oxdConfig.getHost(), oxdConfig.getRedirectUri(), oxdConfig.getPostLogoutUri(),
                                        oxdConfig.getFrontLogoutUri()).anyMatch(Utils::isEmpty);

            if (oxdConfig.getPort() <= 0 || missing) {
                logger.error("The following must be present in configuration file: host, port, redirect URI, post logout URI, and front channel logout URI");
            } else {
                oxdConfig.setOpHost(persistenceService.getIssuerUrl());
                oxdConfig.setAcrValues(Collections.singletonList(DEFAULT_ACR));

                try {
                    if (persistenceService.getDynamicClientExpirationTime() != 0) {

                        if (Utils.isEmpty(settings.getOxdSettings().getScopes())) {
                            oxdConfig.setScopes(REQUIRED_SCOPES);
                        }

                        Optional<String> oxdIdOpt = Optional.ofNullable(oxdConfig.getClient()).map(OxdClientSettings::getOxdId);
                        setSettings(oxdConfig, !oxdIdOpt.isPresent());
                        success = true;
                    } else {
                        logger.error("Dynamic registration of OpenId Connect clients must be enabled in the server.");
                    }
                } catch (Exception e) {
                    logger.warn("Users will not be able to login until a new sucessful attempt to refresh oxd-associated "
                            + "clients takes place. Restart the app to trigger the update immediately");
                    logger.error(e.getMessage());
                }
            }
        }
        return success;

    }

    public void setSettings(OxdSettings cfg, boolean triggerRegistration) throws Exception {

        this.config = cfg;
        if (triggerRegistration) {
            cfg.setClient(doRegister());
        }

    }

    private OxdClientSettings doRegister() throws Exception {

        OxdClientSettings computedSettings;
        String clientName;
        logger.info("Setting oxd configs (host: {}, port: {},  post logout: {})",
                config.getHost(), config.getPort(),  config.getPostLogoutUri());

        try {
            String timeStamp = Long.toString(System.currentTimeMillis()/1000);
            clientName = "gluu-casa_" + timeStamp;

            RegisterSiteParams cmdParams = new RegisterSiteParams();
            cmdParams.setOpHost(config.getOpHost());
            cmdParams.setRedirectUris(Collections.singletonList(config.getRedirectUri()));
            cmdParams.setPostLogoutRedirectUris(Collections.singletonList(config.getPostLogoutUri()));
            cmdParams.setAcrValues(config.getAcrValues());
            cmdParams.setClientName(clientName);
            cmdParams.setClientFrontchannelLogoutUris(Collections.singletonList(config.getFrontLogoutUri()));
            cmdParams.setGrantTypes(Collections.singletonList("client_credentials"));

            cmdParams.setScope(config.getScopes());
            cmdParams.setResponseTypes(Collections.singletonList("code"));
            cmdParams.setTrustedClient(true);

            RegisterSiteResponse setup = restResponse(cmdParams, "register-site", null, RegisterSiteResponse.class);
            computedSettings = new OxdClientSettings(clientName, setup.getOxdId(), setup.getClientId(), setup.getClientSecret());

            logger.info("oxd client registered successfully, oxd-id={}", computedSettings.getOxdId());
        } catch (Exception e) {
            String msg = "Setting oxd-server configs failed";
            logger.error(msg, e);
            throw new Exception(msg, e);
        }
        return computedSettings;

    }

    public void removeSite(String oxdId) {

        try {
            RemoveSiteParams cmdParams = new RemoveSiteParams(oxdId);
            RemoveSiteResponse resp = restResponse(cmdParams, "remove-site", getPAT(), RemoveSiteResponse.class);
            logger.info("Site removed {}", resp.getOxdId());
        } catch (Exception e) {
            logger.debug(e.getMessage(), e);
        }

    }

    /**
     * Returns a string with an autorization URL to redirect an application (see OpenId connect "code" flow)
     * @param acrValues List of acr_values. See OpenId Connect core 1.0 (section 3.1.2.1)
     * @param prompt See OpenId Connect core 1.0 (section 3.1.2.1)
     * @return String consisting of an authentication request with desired parameters
     * @throws Exception A problem with oxd server occurred
     */
    public String getAuthzUrl(List<String> acrValues, String prompt) throws Exception {

        GetAuthorizationUrlParams cmdParams = new GetAuthorizationUrlParams();
        cmdParams.setOxdId(config.getClient().getOxdId());
        cmdParams.setAcrValues(acrValues);
        cmdParams.setPrompt(prompt);
        cmdParams.setScope(config.getScopes());

        GetAuthorizationUrlResponse resp = restResponse(cmdParams, "get-authorization-url", getPAT(), GetAuthorizationUrlResponse.class);
        return resp.getAuthorizationUrl();

    }

    public String getAuthzUrl(String acrValues) throws Exception {
        return getAuthzUrl(Collections.singletonList(acrValues), null);
    }

    public Pair<String, String> getTokens(String code, String state) throws Exception {

        GetTokensByCodeParams cmdParams = new GetTokensByCodeParams();
        cmdParams.setOxdId(config.getClient().getOxdId());
        cmdParams.setCode(code);
        cmdParams.setState(state);

        GetTokensByCodeResponse resp = restResponse(cmdParams, "get-tokens-by-code", getPAT(), GetTokensByCodeResponse.class);
        //validate accessToken with at_hash inside idToken: resp.getIdToken();
        return new Pair<>(resp.getAccessToken(), resp.getIdToken());

    }

    public Map getUserClaims(String accessToken) throws Exception {

        GetUserInfoParams cmdParams = new GetUserInfoParams();
        cmdParams.setOxdId(config.getClient().getOxdId());
        cmdParams.setAccessToken(accessToken);

        return restResponse(cmdParams, "get-user-info", getPAT(), Map.class);

    }

    public String getLogoutUrl(String idTokenHint) throws Exception {

        GetLogoutUrlParams cmdParams = new GetLogoutUrlParams();
        cmdParams.setOxdId(config.getClient().getOxdId());
        cmdParams.setPostLogoutRedirectUri(config.getPostLogoutUri());
        cmdParams.setIdTokenHint(idTokenHint);

        GetLogoutUriResponse resp = restResponse(cmdParams, "get-logout-uri", getPAT(), GetLogoutUriResponse.class);
        return resp.getUri();

    }

    public boolean updateSite(String postLogoutUri, List<String> newScopes) throws Exception {
        //This method updates the OIDC client directly (does not use oxd). Less tinkering

        OIDCClient client = new OIDCClient();
        client.setInum(config.getClient().getClientId());
        client.setBaseDn(persistenceService.getClientsDn());

        logger.info("Looking up Casa client...");
        client = persistenceService.find(client).get(0);
        client.setPostLogoutURI(postLogoutUri);

        Set<String> scopeSet = new HashSet<>(REQUIRED_SCOPES);
        scopeSet.addAll(newScopes);
        client.setScopes(scopeService.getDNsFromIds(new ArrayList<>(scopeSet)));

        logger.info("Updating client with new scopes {} and post logout URI {}", newScopes, postLogoutUri);
        boolean ret = persistenceService.modify(client);
        if (ret) {
            //Update global state of this bean
            config.setScopes(client.getScopes());
            config.setPostLogoutUri(client.getPostLogoutURI());
        }
        return ret;

    }


    //This does not seem to work properly (strange side effects)
    public boolean updateSite(String postLogoutUri) throws Exception {

        UpdateSiteParams cmdParams = new UpdateSiteParams();
        cmdParams.setOxdId(config.getClient().getOxdId());

        if (postLogoutUri != null) {
            cmdParams.setPostLogoutRedirectUris(Collections.singletonList(postLogoutUri));
        }
        //Do not remove the following lines, sometimes problematic if missing
        cmdParams.setGrantType(Collections.singletonList("client_credentials"));
        cmdParams.setResponseTypes(Collections.singletonList("code"));
        UpdateSiteResponse resp = restResponse(cmdParams, "update-site", getPAT(), UpdateSiteResponse.class);

        return resp != null;

    }

    private String getPAT() throws Exception {

        GetClientTokenParams cmdParams = new GetClientTokenParams();
        cmdParams.setOpHost(config.getOpHost());
        cmdParams.setClientId(config.getClient().getClientId());
        cmdParams.setClientSecret(config.getClient().getClientSecret());
        cmdParams.setScope(config.getScopes());

        GetClientTokenResponse resp = restResponse(cmdParams, "get-client-token", null, GetClientTokenResponse.class);
        String token = resp.getAccessToken();
        logger.trace("getPAT. token={}", token);

        return token;

    }

    private <T> T restResponse(IParams params, String path, String token, Class<T> responseClass) throws Exception {

        String payload = mapper.writeValueAsString(params);
        logger.trace("Sending /{} request to oxd-server with payload \n{}", path, payload);

        String authz = StringUtils.isEmpty(token) ? null : "Bearer " + token;
        ResteasyWebTarget target = client.target(String.format("https://%s:%s/%s", config.getHost(), config.getPort(), path));

        Response response = target.request().header("Authorization", authz).post(Entity.json(payload));
        response.bufferEntity();
        logger.trace("Response received was \n{}", response.readEntity(String.class));
        return response.readEntity(responseClass);

    }

    @PreDestroy
    private void destroy() {
        if (client != null) {
            client.close();
        }
    }

}
