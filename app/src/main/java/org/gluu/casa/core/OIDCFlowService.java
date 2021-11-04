package org.gluu.casa.core;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.proc.BadJOSEException;
import com.nimbusds.jwt.JWT;
import com.nimbusds.oauth2.sdk.*;
import com.nimbusds.oauth2.sdk.auth.ClientAuthentication;
import com.nimbusds.oauth2.sdk.auth.ClientSecretBasic;
import com.nimbusds.oauth2.sdk.auth.Secret;
import com.nimbusds.oauth2.sdk.http.HTTPResponse;
import com.nimbusds.openid.connect.sdk.*;
import com.nimbusds.oauth2.sdk.id.*;
import com.nimbusds.oauth2.sdk.token.AccessToken;
import com.nimbusds.oauth2.sdk.token.BearerAccessToken;
import com.nimbusds.openid.connect.sdk.claims.ACR;
import com.nimbusds.openid.connect.sdk.claims.UserInfo;
import com.nimbusds.openid.connect.sdk.validators.IDTokenValidator;
import java.io.IOException;

import java.net.*;

import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.inject.Named;
import net.minidev.json.JSONObject;
import org.gluu.casa.conf.MainSettings;
import org.gluu.casa.conf.OIDCSettings;

import org.slf4j.Logger;
import org.zkoss.util.Pair;

@Named
@ApplicationScoped
public class OIDCFlowService {
    
    /*
    The list of scopes required to be able to inspect the claims needed. See attributes of User class
     */
    public static final List<String> REQUIRED_SCOPES = Arrays.asList("openid", "profile", "user_name", "clientinfo");

    private static final Charset utf8 = StandardCharsets.UTF_8;

    @Inject
    private Logger logger;

    @Inject
    private PersistenceService persistenceService;

    @Inject
    private MainSettings mainSettings;

    private OIDCSettings settings;
    private ObjectMapper objectMapper;

    private String authzEndpoint;
    private String tokenEndpoint;
    private String userInfoEndpoint;
    private String jwksUri;

    public Pair<String, String> getAuthnRequestUrl(String acr) {
        return getAuthnRequestUrl(Collections.singletonList(acr), null);
    }
    
    public Pair<String, String> getAuthnRequestUrl(List<String> acrValues, String prompt) {
        
        try {
            ClientID clientID = new ClientID(settings.getClient().getClientId());
            URI callback = new URI(settings.getRedirectUri());

            AuthenticationRequest.Builder builder = new AuthenticationRequest.Builder(
                    new ResponseType("code"),
                    new Scope(REQUIRED_SCOPES.toArray(new String[0])),
                    clientID,
                    callback);

            State state = new State();
            AuthenticationRequest request = builder.endpointURI(new URI(authzEndpoint))
                    .state(state)// .nonce(new Nonce())    // .prompt(new Prompt("?"))
                    .acrValues(acrValues.stream().map(ACR::new).collect(Collectors.toList()))
                    .build();
            
            return new Pair<>(request.toURI().toString(), state.toString());
        } catch (URISyntaxException e) {
            logger.error(e.getMessage());
            return null;
        }
        
    }
    
    public Pair<String, ErrorObject> validateAuthnResponse(String uri, String expectedState) {
        
        ErrorObject error = null;
        String code = null;
        try {
            AuthenticationResponse response = AuthenticationResponseParser.parse(new URI(uri));

            if (response instanceof AuthenticationErrorResponse) {
                error = response.toErrorResponse().getErrorObject();

            } else if (!response.getState().equals(expectedState)) {
                error = new ErrorObject("Unexpected authentication response");

            } else {
                code = response.toSuccessResponse().getAuthorizationCode().toString();
            }
        } catch (ParseException e) {
            error = e.getErrorObject();
        } catch (URISyntaxException e2) {
            logger.error(e2.getMessage());
            error = new ErrorObject(e2.getMessage(), e2.getReason());
        }
        return new Pair<>(code, error);
        
    }

    public Pair<Pair<String, String>, ErrorObject> getTokens(String code) {
        
        Pair<String, String> tokens = null;
        ErrorObject error = null;

        try {
            AuthorizationCode acode = new AuthorizationCode(code);
            URI callback = new URI(settings.getRedirectUri());
            AuthorizationGrant codeGrant = new AuthorizationCodeGrant(acode, callback);

            ClientID clientID = new ClientID(settings.getClient().getClientId());
            Secret clientSecret = new Secret(settings.getClient().getClientSecret());
            ClientAuthentication clientAuth = new ClientSecretBasic(clientID, clientSecret);

            URI endpoint = new URI(tokenEndpoint);
            TokenRequest request = new TokenRequest(endpoint, clientAuth, codeGrant);

            TokenResponse response = OIDCTokenResponseParser.parse(request.toHTTPRequest().send());
            if (!response.indicatesSuccess()) {
                // We got an error response...
                TokenErrorResponse errorResponse = response.toErrorResponse();
                error = errorResponse.getErrorObject();
            } else {
                OIDCTokenResponse successResponse = (OIDCTokenResponse) response.toSuccessResponse();

                JWT idToken = successResponse.getOIDCTokens().getIDToken();
                AccessToken accessToken = successResponse.getOIDCTokens().getAccessToken();
                
                String validationMsg = validateIDToken(idToken);
                if (validationMsg != null) {
                    error = new ErrorObject("Cannot validate id_token", validationMsg);
                } else {                    
                    tokens = new Pair<>(accessToken.toString(), idToken.toString());
                }
            }
        } catch (ParseException e) {
            logger.error(e.getMessage(), e);
            error = e.getErrorObject();
        } catch (URISyntaxException | IOException e2) {
            logger.error(e2.getMessage());
            error = new ErrorObject(e2.getMessage());
        }
        return new Pair<>(tokens, error);

    }

    public Pair<Map<String, Object>, ErrorObject> getUserClaims(String accessToken) {

        Map<String, Object> claims = null;
        ErrorObject error = null;
        try {
            URI endpointUri = new URI(userInfoEndpoint);
            BearerAccessToken token = new BearerAccessToken(accessToken);

            HTTPResponse httpResponse = new UserInfoRequest(endpointUri, token).toHTTPRequest().send();
            UserInfoResponse userInfoResponse = UserInfoResponse.parse(httpResponse);
            
            if (!userInfoResponse.indicatesSuccess()) {
                error = userInfoResponse.toErrorResponse().getErrorObject();                    
            } else {
                UserInfo userInfo = userInfoResponse.toSuccessResponse().getUserInfo();
                JSONObject jsonObj = userInfo.toJSONObject();
                
                claims = jsonObj.entrySet().stream()
                        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
            }
        } catch (ParseException e) {
            logger.error(e.getMessage(), e);
            error = e.getErrorObject();
        } catch (URISyntaxException | IOException e2) {
            logger.error(e2.getMessage());
            error = new ErrorObject(e2.getMessage());
        }
        return new Pair<>(claims, error);


    }

    public String getLogoutUrl(String idTokenHint) {
        return null;
    }
    
    private String validateIDToken(JWT idToken) {
        
        try {
            Issuer iss = new Issuer(persistenceService.getIssuerUrl());
            ClientID clientID = new ClientID(settings.getClient().getClientId());
            JWSAlgorithm jwsAlg = JWSAlgorithm.RS256;

            //TODO: how often the server keys change?
            URL jwkSetURL = new URL(persistenceService.getJwksUri());
            IDTokenValidator validator = new IDTokenValidator(iss, clientID, jwsAlg, jwkSetURL);
            validator.validate(idToken, null);
            
            return null;
        } catch(MalformedURLException | JOSEException | BadJOSEException e) {
            logger.error(e.getMessage(), e);
            return e.getMessage();
        }

    }

    @PostConstruct
    private void init() {
        settings = mainSettings.getOidcSettings();
        objectMapper = new ObjectMapper();
        authzEndpoint = persistenceService.getAuthorizationEndpoint();
        tokenEndpoint = persistenceService.getTokenEndpoint();
        userInfoEndpoint = persistenceService.getUserInfoEndpoint();
        //TODO: reformat URI: in CN internal url should be fetched differently
        jwksUri = persistenceService.getJwksUri(); 
    }

}
