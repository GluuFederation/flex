package org.gluu.casa.client.config.api;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.gluu.oxauth.client.*;
import org.gluu.casa.client.config.*;
import org.gluu.casa.client.config.auth.*;

import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder;
import org.jboss.resteasy.util.Base64;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.Form;
import javax.ws.rs.core.Response;

public class BaseTest {
    
    private static final String API_HOST_PROP = "API_HOST";
    private static final String CLIENT_ID_PROP = "CLIENT_ID";
    private static final String CLIENT_SECRET_PROP = "CLIENT_SECRET";
    
    DefaultApi client;
    
    static {
        
        try {
            ApiClient defaultClient = Configuration.getDefaultApiClient();
            //https://buster.gluu.info
            
            String apiHost = sysprop(API_HOST_PROP);
            defaultClient.setBasePath(apiHost + "/casa/rest/config");
            
            String token = getAccessToken(apiHost + "/oxauth/restv1/token", sysprop(CLIENT_ID_PROP), 
                sysprop(CLIENT_SECRET_PROP), "casa.config");
            
            OAuth config_auth = (OAuth) defaultClient.getAuthentication("config_auth");
            config_auth.setAccessToken(token);
            
            System.out.println("Using token " + token + " from " + apiHost);
        } catch (Exception e) {
            e.printStackTrace();
        }
        
    }
    
    BaseTest() {
        client = new DefaultApi();
    }
    
    private static String getAccessToken(String tokenEndpoint, String clientId, 
        String clientSecret, String scope) throws Exception {
        /*
        I tried using oxauth-client (tokenClient.execClientCredentialsGrant) 
        but it conflicts with resteasy of swagger-generated client
        
        TokenClient tokenClient = new TokenClient(tokenEndpoint);
        TokenResponse response = tokenClient.execClientCredentialsGrant(scope, clientId, clientSecret);
        return response.getAccessToken();
        
        Resorting to requesting a token manually...
        */
        
        ResteasyWebTarget target = new ResteasyClientBuilder().build().target(tokenEndpoint);
        Form form = new Form().param("grant_type", "client_credentials").param("scope", scope);
        
        String authz = clientId + ":" + clientSecret;
        authz = "Basic " + Base64.encodeBytes(authz.getBytes("UTF-8"));
        Response response = target.request().header("Authorization", authz).post(Entity.form(form));
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readTree(response.readEntity(String.class)).get("access_token").asText();
        } finally {
            response.close();
        }
        
    }
    
    private static String sysprop(String property) {
        return System.getProperty(property);
    }

}
